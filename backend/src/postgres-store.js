import fs from 'node:fs'
import path from 'node:path'
import { JsonStore, freshDatabase } from './store.js'

const STATE_TABLE = 'al_aziz_app_state'
const RETRYABLE_POSTGRES_CODES = new Set([
  '57P03', // PostgreSQL recovery/startup holatida
  '08000', '08001', '08003', '08004', '08006', '08007', '08P01',
  '53300',
])

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

function isRetryablePostgresError(error) {
  const code = String(error?.code || '')
  const message = String(error?.message || error?.cause?.message || '')
  return RETRYABLE_POSTGRES_CODES.has(code)
    || /recovery|not yet accepting connections|connection terminated|connection timeout|econnrefused|enotfound|socket hang up/i.test(message)
}

function parseState(value) {
  if (!value) return null
  return typeof value === 'string' ? JSON.parse(value) : value
}

export class PostgresStore extends JsonStore {
  constructor(connectionString, options = {}) {
    const seedFile = options.seedFile || path.join(process.cwd(), 'data', 'database.json')
    super(seedFile)
    this.connectionString = connectionString
    this.seedFile = seedFile
    this.pool = options.pool || null
    this.saveQueue = Promise.resolve()
    this.storageType = 'postgresql'
  }

  async ensurePool() {
    if (this.pool) return
    const pgModule = await import('pg')
    const { Pool } = pgModule.default || pgModule
    this.pool = new Pool({
      connectionString: this.connectionString,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      application_name: 'al-aziz-test-platform',
    })
    this.pool.on('error', error => {
      console.error('PostgreSQL pool xatosi:', error.message)
    })
  }

  async queryWithRetry(sql, params = [], options = {}) {
    const attempts = Math.max(1, Number(options.attempts || 6))
    const operation = options.operation || 'PostgreSQL ulanishi'
    let lastError

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await this.pool.query(sql, params)
      } catch (error) {
        lastError = error
        if (!isRetryablePostgresError(error) || attempt >= attempts) throw error
        const delay = Math.min(1000 + attempt * 1000, 5000)
        console.warn(`${operation}: baza hali tayyor emas (${attempt}/${attempts}). ${delay / 1000} sekunddan keyin qayta uriniladi.`)
        await wait(delay)
      }
    }

    throw lastError
  }

  async init({ adminLogin, adminPassword }) {
    await this.ensurePool()
    await this.queryWithRetry(`
      CREATE TABLE IF NOT EXISTS ${STATE_TABLE} (
        id SMALLINT PRIMARY KEY CHECK (id = 1),
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `, [], { attempts: 12, operation: 'PostgreSQL ishga tushishi' })

    const result = await this.queryWithRetry(
      `SELECT state FROM ${STATE_TABLE} WHERE id = 1`,
      [],
      { attempts: 6, operation: 'PostgreSQL ma’lumotlarini o‘qish' },
    )
    if (result.rowCount) {
      this.db = parseState(result.rows[0].state)
    } else if (this.seedFile && fs.existsSync(this.seedFile)) {
      this.db = JSON.parse(fs.readFileSync(this.seedFile, 'utf8'))
    } else {
      this.db = freshDatabase()
    }

    await this.prepareDatabase({ adminLogin, adminPassword })
    await this.save()
    await this.flush()
  }

  save() {
    const snapshot = JSON.stringify(this.db)
    this.saveQueue = this.saveQueue
      .catch(() => {})
      .then(() => this.queryWithRetry(`
        INSERT INTO ${STATE_TABLE} (id, state, updated_at)
        VALUES (1, $1::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET state = EXCLUDED.state, updated_at = NOW()
      `, [snapshot], { attempts: 6, operation: 'PostgreSQL ma’lumotlarini saqlash' }))

    this.saveQueue.catch(error => {
      console.error('PostgreSQL saqlash xatosi:', error.message)
    })
    return this.saveQueue
  }

  async flush() {
    await this.saveQueue
  }

  async close() {
    await this.flush()
    await this.pool?.end?.()
  }
}
