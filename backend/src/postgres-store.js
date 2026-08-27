import fs from 'node:fs'
import path from 'node:path'
import { JsonStore, freshDatabase } from './store.js'

const STATE_TABLE = 'al_aziz_app_state'

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
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      application_name: 'al-aziz-test-platform',
    })
    this.pool.on('error', error => {
      console.error('PostgreSQL pool xatosi:', error.message)
    })
  }

  async init({ adminLogin, adminPassword }) {
    await this.ensurePool()
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS ${STATE_TABLE} (
        id SMALLINT PRIMARY KEY CHECK (id = 1),
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const result = await this.pool.query(`SELECT state FROM ${STATE_TABLE} WHERE id = 1`)
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
      .then(() => this.pool.query(`
        INSERT INTO ${STATE_TABLE} (id, state, updated_at)
        VALUES (1, $1::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET state = EXCLUDED.state, updated_at = NOW()
      `, [snapshot]))

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
