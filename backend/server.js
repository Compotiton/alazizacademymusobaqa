import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import ExcelJS from 'exceljs'
import { JsonStore, timestamps } from './src/store.js'
import { PostgresStore } from './src/postgres-store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8000)
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'ulugbek'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456'
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'database.json')
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim()
const allowedOrigins = String(process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)

if (process.env.NODE_ENV === 'production' && !DATABASE_URL) {
  throw new Error('Production uchun DATABASE_URL majburiy. Railway PostgreSQL service ulang.')
}

const store = DATABASE_URL
  ? new PostgresStore(DATABASE_URL, { seedFile: DATA_FILE })
  : new JsonStore(DATA_FILE)
await store.init({ adminLogin: ADMIN_LOGIN, adminPassword: ADMIN_PASSWORD })

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin) || /^https:\/\/[^/]+\.netlify\.app$/.test(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('CORS: bu domen uchun ruxsat berilmagan.'))
  },
}))
app.use(express.json({ limit: '2mb' }))
app.use(morgan('tiny'))

const clean = value => String(value ?? '').trim()
const int = value => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : null
}
const isoNow = () => timestamps.now()
const byName = (a, b) => String(a.name).localeCompare(String(b.name), 'uz')
const sameText = (a, b) => clean(a).toLocaleLowerCase('uz') === clean(b).toLocaleLowerCase('uz')
const isMentalName = name => clean(name).toLowerCase().replace(/[‘’'`]/g, '').includes('mental')
const httpError = (status, detail) => Object.assign(new Error(detail), { status })

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

function signToken(admin, type, expiresIn) {
  return jwt.sign({ sub: admin.id, type, username: admin.username }, JWT_SECRET, { expiresIn })
}

function auth(req, res, next) {
  const token = clean(req.headers.authorization).replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ detail: 'Avtorizatsiya talab qilinadi.' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.type !== 'access') throw new Error('wrong token type')
    const admin = store.db.admins.find(item => item.id === Number(payload.sub) && item.is_staff)
    if (!admin) throw new Error('admin not found')
    req.admin = admin
    next()
  } catch {
    res.status(401).json({ detail: 'Token yaroqsiz yoki eskirgan.' })
  }
}

function requireMainAdmin(req, res, next) {
  if (!req.admin?.is_superuser) return res.status(403).json({ detail: 'Bu amal faqat asosiy admin uchun.' })
  next()
}

function getCenter(id) {
  return store.db.centers.find(item => item.id === Number(id)) || null
}
function getSubject(id) {
  return store.db.subjects.find(item => item.id === Number(id)) || null
}
function getLevel(id) {
  return store.db.levels.find(item => item.id === Number(id)) || null
}
function getResultForStudent(studentId) {
  return store.db.results.find(item => item.student === studentId) || null
}

function serializeAdmin(admin) {
  const center = getCenter(admin.center)
  return {
    id: admin.id,
    username: admin.username,
    first_name: admin.first_name || '',
    last_name: admin.last_name || '',
    email: admin.email || '',
    is_staff: Boolean(admin.is_staff),
    is_superuser: Boolean(admin.is_superuser),
    is_main_admin: Boolean(admin.is_superuser),
    center: admin.center || null,
    center_name: center?.name || '',
    branch: admin.branch || '',
    date_joined: admin.date_joined,
  }
}

function serializeStudent(student) {
  const subject = getSubject(student.subject)
  const level = getLevel(student.level)
  const center = getCenter(student.center)
  const result = getResultForStudent(student.id)
  return {
    ...student,
    full_name: `${student.first_name} ${student.last_name}`.trim(),
    subject_name: subject?.name || '',
    level_name: level?.name || '',
    center_name: center?.name || '',
    branch_display: student.branch || '',
    correct_count: result?.correct_count ?? null,
    total_questions: result?.total_questions ?? null,
    percent: result?.percent ?? null,
    spent_seconds: result?.spent_seconds ?? null,
  }
}

function serializeQuestion(question, includeCorrect = true) {
  const subject = getSubject(question.subject)
  const level = getLevel(question.level)
  const output = {
    id: question.id,
    subject: question.subject,
    subject_name: subject?.name || '',
    level: question.level,
    level_name: level?.name || '',
    version: question.version,
    text: question.text,
    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    created_at: question.created_at,
  }
  if (includeCorrect) output.correct_answer = question.correct_answer
  return output
}

function serializeResult(result) {
  const student = store.db.students.find(item => item.id === result.student)
  if (!student) return null
  const subject = getSubject(student.subject)
  const level = getLevel(student.level)
  const center = getCenter(student.center)
  const answers = store.db.answers
    .filter(item => item.result === result.id)
    .map(answer => {
      const question = store.db.questions.find(item => item.id === answer.question)
      return {
        id: answer.id,
        question: answer.question,
        question_text: question?.text || '',
        option_a: question?.option_a || '',
        option_b: question?.option_b || '',
        option_c: question?.option_c || '',
        option_d: question?.option_d || '',
        selected_answer: answer.selected_answer,
        correct_answer: question?.correct_answer || '',
        is_correct: Boolean(answer.is_correct),
      }
    })
  return {
    ...result,
    student_full_name: `${student.first_name} ${student.last_name}`.trim(),
    student_code: student.code,
    subject_name: subject?.name || '',
    level_name: level?.name || '',
    student_selected_version: student.selected_version,
    center_name: center?.name || '',
    student_branch: student.branch,
    answers,
    mental_answers: [],
  }
}

function scopeStudents(admin, list = store.db.students) {
  if (admin.is_superuser) return [...list]
  if (admin.branch) return list.filter(item => sameText(item.branch, admin.branch))
  if (admin.center) return list.filter(item => item.center === admin.center)
  return []
}

function filterStudents(req) {
  let list = scopeStudents(req.admin)
  if (req.admin.is_superuser && req.query.center) list = list.filter(item => item.center === int(req.query.center))
  if (req.admin.is_superuser && req.query.branch) list = list.filter(item => sameText(item.branch, req.query.branch))
  if (req.query.status) list = list.filter(item => item.status === req.query.status)
  if (req.query.subject) list = list.filter(item => item.subject === int(req.query.subject))
  if (req.query.level) list = list.filter(item => item.level === int(req.query.level))
  if (req.query.q) {
    const q = clean(req.query.q).toLowerCase()
    list = list.filter(item => `${item.first_name} ${item.last_name} ${item.code}`.toLowerCase().includes(q))
  }
  return list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

function filterResults(req) {
  const allowedStudentIds = new Set(filterStudents(req).map(item => item.id))
  return store.db.results
    .filter(item => allowedStudentIds.has(item.student))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

function generateCode() {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    if (!store.db.students.some(item => item.code === code)) return code
  }
  throw httpError(500, 'Yangi code yaratib bo‘lmadi.')
}

function validateStudentPayload(body, existing = null) {
  const subjectId = int(body.subject ?? existing?.subject)
  const levelId = int(body.level ?? existing?.level)
  const centerId = int(body.center ?? existing?.center)
  const subject = getSubject(subjectId)
  const level = getLevel(levelId)
  const center = getCenter(centerId)
  if (!subject) throw httpError(400, 'Fan tanlanmagan yoki topilmadi.')
  if (!level) throw httpError(400, 'Daraja tanlanmagan yoki topilmadi.')
  if (level.subject !== subject.id) throw httpError(400, 'Tanlangan daraja shu fanga tegishli emas.')
  if (!center) throw httpError(400, 'O‘quv markaz tanlanmagan yoki topilmadi.')
  return { subjectId, levelId, centerId }
}

async function sendWorkbook(res, workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer()
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(Buffer.from(buffer))
}

function styleWorksheet(ws) {
  const row = ws.getRow(1)
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } }
  row.alignment = { horizontal: 'center' }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  ws.columns.forEach(column => {
    let max = 10
    column.eachCell?.({ includeEmpty: true }, cell => { max = Math.max(max, clean(cell.value).length + 2) })
    column.width = Math.min(max, 42)
  })
}

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Node.js backend ishlayapti', database: store.storageType }))
app.get('/api/health/', (req, res) => res.json({ status: 'ok', message: 'Node.js backend ishlayapti', database: store.storageType, questions_count: store.db.questions.length }))

app.post('/api/auth/login/', asyncRoute(async (req, res) => {
  const username = clean(req.body.username)
  const password = String(req.body.password || '')
  const admin = store.db.admins.find(item => sameText(item.username, username))
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ detail: 'Login yoki parol noto‘g‘ri.' })
  }
  res.json({ access: signToken(admin, 'access', '4h'), refresh: signToken(admin, 'refresh', '7d') })
}))

app.post('/api/auth/refresh/', (req, res) => {
  try {
    const payload = jwt.verify(clean(req.body.refresh), JWT_SECRET)
    if (payload.type !== 'refresh') throw new Error('wrong token type')
    const admin = store.db.admins.find(item => item.id === Number(payload.sub) && item.is_staff)
    if (!admin) throw new Error('admin not found')
    res.json({ access: signToken(admin, 'access', '4h') })
  } catch {
    res.status(401).json({ detail: 'Refresh token yaroqsiz yoki eskirgan.' })
  }
})

app.get('/api/accounts/me/', auth, (req, res) => {
  const output = serializeAdmin(req.admin)
  output.can_manage_admins = Boolean(req.admin.is_superuser)
  output.can_manage_centers = Boolean(req.admin.is_superuser)
  output.can_manage_branches = Boolean(req.admin.is_superuser)
  output.can_create_students = Boolean(req.admin.is_superuser || req.admin.center)
  output.can_edit_students = Boolean(req.admin.is_superuser)
  output.can_delete_students = Boolean(req.admin.is_superuser)
  output.can_view_tests = true
  output.can_view_results = true
  output.assigned_center = req.admin.center || null
  output.assigned_center_name = getCenter(req.admin.center)?.name || ''
  res.json(output)
})

app.get('/api/accounts/admins/', auth, requireMainAdmin, (req, res) => {
  res.json(store.db.admins.map(serializeAdmin).sort((a, b) => String(b.date_joined).localeCompare(String(a.date_joined))))
})

app.post('/api/accounts/admins/', auth, requireMainAdmin, asyncRoute(async (req, res) => {
  const username = clean(req.body.username)
  const password = String(req.body.password || '')
  const fixedCenter = store.db.centers.find(item => sameText(item.name, 'Al-Aziz'))
  const centerId = fixedCenter?.id || null
  const branch = clean(req.body.branch)
  if (!username) throw httpError(400, 'Login kiriting.')
  if (password.length < 6) throw httpError(400, 'Parol kamida 6 ta belgidan iborat bo‘lsin.')
  if (store.db.admins.some(item => sameText(item.username, username))) throw httpError(400, 'Bu login band.')
  if (!getCenter(centerId)) throw httpError(500, 'Al-Aziz o‘quv markazi topilmadi.')
  if (branch && !store.db.branches.some(item => sameText(item.name, branch))) throw httpError(400, 'Bunday filial topilmadi.')
  const admin = {
    id: store.nextId('admin'), username, password_hash: await bcrypt.hash(password, 12),
    first_name: clean(req.body.first_name), last_name: clean(req.body.last_name), email: clean(req.body.email),
    is_staff: true, is_superuser: false, center: centerId, branch, date_joined: isoNow(),
  }
  store.db.admins.push(admin)
  store.save()
  res.status(201).json(serializeAdmin(admin))
}))

app.get('/api/centers/summary/', auth, (req, res) => {
  const centers = req.admin.is_superuser ? store.db.centers : store.db.centers.filter(item => item.id === req.admin.center)
  res.json(centers.sort(byName).map(center => {
    const students = store.db.students.filter(item => item.center === center.id)
    const studentIds = new Set(students.map(item => item.id))
    const results = store.db.results.filter(item => studentIds.has(item.student))
    return {
      id: center.id,
      name: center.name,
      students_count: students.length,
      not_started_count: students.filter(item => item.status === 'not_started').length,
      in_progress_count: students.filter(item => item.status === 'in_progress').length,
      completed_count: students.filter(item => item.status === 'completed').length,
      results_count: results.length,
      average_percent: results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.percent || 0), 0) / results.length * 10) / 10 : 0,
    }
  }))
})

app.get('/api/centers/', auth, (req, res) => {
  const list = req.admin.is_superuser ? store.db.centers : store.db.centers.filter(item => item.id === req.admin.center)
  res.json([...list].sort(byName))
})
app.post('/api/centers/', auth, requireMainAdmin, (req, res) => {
  const name = clean(req.body.name)
  if (!name) return res.status(400).json({ name: 'O‘quv markaz nomini kiriting.' })
  const existing = store.db.centers.find(item => sameText(item.name, name))
  if (existing) return res.json(existing)
  const center = { id: store.nextId('center'), name }
  store.db.centers.push(center)
  store.save()
  res.status(201).json(center)
})
app.patch('/api/centers/:id/', auth, requireMainAdmin, (req, res) => {
  const center = getCenter(req.params.id)
  if (!center) return res.status(404).json({ detail: 'O‘quv markaz topilmadi.' })
  if (req.body.name !== undefined) center.name = clean(req.body.name)
  store.save()
  res.json(center)
})
app.delete('/api/centers/:id/', auth, requireMainAdmin, (req, res) => {
  const id = int(req.params.id)
  if (store.db.students.some(item => item.center === id)) return res.status(400).json({ detail: 'Bu markazda o‘quvchilar bor.' })
  store.db.centers = store.db.centers.filter(item => item.id !== id)
  store.save()
  res.status(204).send()
})

app.get('/api/branches/', auth, (req, res) => res.json([...store.db.branches].sort((a, b) => a.id - b.id)))
app.post('/api/branches/', auth, requireMainAdmin, (req, res) => {
  const name = clean(req.body.name)
  if (!name) return res.status(400).json({ name: 'Filial nomini kiriting.' })
  if (name.length > 80) return res.status(400).json({ name: 'Filial nomi 80 ta belgidan oshmasin.' })
  const existing = store.db.branches.find(item => sameText(item.name, name))
  if (existing) return res.json(existing)
  const branch = { id: store.nextId('branch'), name, created_at: isoNow() }
  store.db.branches.push(branch)
  store.save()
  res.status(201).json(branch)
})
app.patch('/api/branches/:id/', auth, requireMainAdmin, (req, res) => {
  const branch = store.db.branches.find(item => item.id === int(req.params.id))
  if (!branch) return res.status(404).json({ detail: 'Filial topilmadi.' })
  const oldName = branch.name
  const name = clean(req.body.name)
  if (!name) return res.status(400).json({ name: 'Filial nomini kiriting.' })
  if (name.length > 80) return res.status(400).json({ name: 'Filial nomi 80 ta belgidan oshmasin.' })
  const duplicate = store.db.branches.find(item => item.id !== branch.id && sameText(item.name, name))
  if (duplicate) return res.status(400).json({ name: 'Bu filial avval qo‘shilgan.' })
  branch.name = name
  store.db.students.filter(item => sameText(item.branch, oldName)).forEach(item => { item.branch = branch.name })
  store.db.admins.filter(item => sameText(item.branch, oldName)).forEach(item => { item.branch = branch.name })
  store.save()
  res.json(branch)
})
app.delete('/api/branches/:id/', auth, requireMainAdmin, (req, res) => {
  const branch = store.db.branches.find(item => item.id === int(req.params.id))
  if (!branch) return res.status(404).json({ detail: 'Filial topilmadi.' })
  if (store.db.students.some(item => sameText(item.branch, branch.name))) return res.status(400).json({ detail: 'Bu filialda o‘quvchilar bor.' })
  if (store.db.admins.some(item => sameText(item.branch, branch.name))) return res.status(400).json({ detail: 'Bu filialga admin biriktirilgan.' })
  store.db.branches = store.db.branches.filter(item => item.id !== branch.id)
  store.save()
  res.status(204).send()
})

app.get('/api/subjects/', auth, (req, res) => res.json([...store.db.subjects].sort(byName)))
app.post('/api/subjects/', auth, requireMainAdmin, (req, res) => {
  const name = clean(req.body.name)
  if (!name) return res.status(400).json({ detail: 'Fan nomini kiriting.' })
  const existing = store.db.subjects.find(item => sameText(item.name, name))
  if (existing) return res.json(existing)
  const subject = { id: store.nextId('subject'), name }
  store.db.subjects.push(subject)
  store.save()
  res.status(201).json(subject)
})
app.patch('/api/subjects/:id/', auth, requireMainAdmin, (req, res) => {
  const subject = getSubject(req.params.id)
  if (!subject) return res.status(404).json({ detail: 'Fan topilmadi.' })
  subject.name = clean(req.body.name) || subject.name
  store.save()
  res.json(subject)
})
app.delete('/api/subjects/:id/', auth, requireMainAdmin, (req, res) => {
  const id = int(req.params.id)
  if (store.db.students.some(item => item.subject === id)) return res.status(400).json({ detail: 'Bu fanga o‘quvchilar biriktirilgan.' })
  const levelIds = store.db.levels.filter(item => item.subject === id).map(item => item.id)
  store.db.questions = store.db.questions.filter(item => item.subject !== id)
  store.db.levels = store.db.levels.filter(item => !levelIds.includes(item.id))
  store.db.subjects = store.db.subjects.filter(item => item.id !== id)
  store.save()
  res.status(204).send()
})

app.get('/api/levels/', auth, (req, res) => {
  let levels = [...store.db.levels]
  if (req.query.subject) levels = levels.filter(item => item.subject === int(req.query.subject))
  res.json(levels.sort((a, b) => {
    const subjectOrder = clean(getSubject(a.subject)?.name).localeCompare(clean(getSubject(b.subject)?.name), 'uz')
    return subjectOrder || clean(a.name).localeCompare(clean(b.name), 'uz')
  }).map(item => ({ ...item, subject_name: getSubject(item.subject)?.name || '' })))
})
app.post('/api/levels/', auth, requireMainAdmin, (req, res) => {
  const subject = getSubject(req.body.subject)
  const name = clean(req.body.name)
  const duration = Math.max(1, int(req.body.duration_minutes) || 30)
  if (!subject || !name) return res.status(400).json({ detail: 'Fan va daraja nomini kiriting.' })
  const existing = store.db.levels.find(item => item.subject === subject.id && sameText(item.name, name))
  if (existing) return res.json({ ...existing, subject_name: subject.name })
  const level = { id: store.nextId('level'), subject: subject.id, name, duration_minutes: duration }
  store.db.levels.push(level)
  store.save()
  res.status(201).json({ ...level, subject_name: subject.name })
})
app.patch('/api/levels/:id/', auth, requireMainAdmin, (req, res) => {
  const level = getLevel(req.params.id)
  if (!level) return res.status(404).json({ detail: 'Daraja topilmadi.' })
  if (req.body.subject !== undefined && getSubject(req.body.subject)) level.subject = int(req.body.subject)
  if (req.body.name !== undefined) level.name = clean(req.body.name) || level.name
  if (req.body.duration_minutes !== undefined) level.duration_minutes = Math.max(1, int(req.body.duration_minutes) || level.duration_minutes)
  store.save()
  res.json({ ...level, subject_name: getSubject(level.subject)?.name || '' })
})
app.delete('/api/levels/:id/', auth, requireMainAdmin, (req, res) => {
  const id = int(req.params.id)
  if (store.db.students.some(item => item.level === id)) return res.status(400).json({ detail: 'Bu darajaga o‘quvchilar biriktirilgan.' })
  store.db.questions = store.db.questions.filter(item => item.level !== id)
  store.db.levels = store.db.levels.filter(item => item.id !== id)
  store.save()
  res.status(204).send()
})

app.get('/api/students/export-excel/', auth, asyncRoute(async (req, res) => {
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Barcha oquvchilar')
  ws.addRow(['№', 'Ism familyasi', 'Fani', 'Darajasi', 'Version', "O'quv markazi", 'Filial', 'Code', 'Status', 'Natijasi', 'Sarflagan vaqt'])
  const labels = { not_started: 'Ishlamagan', in_progress: 'Ishlayapti', completed: 'Ishlab bo‘ldi' }
  filterStudents(req).map(serializeStudent).forEach((student, index) => {
    const score = student.correct_count === null ? '—' : `${student.correct_count}/${student.total_questions} ta / ${student.percent}%`
    ws.addRow([index + 1, student.full_name, student.subject_name, student.level_name, student.selected_version ? `Version ${student.selected_version}` : '—', student.center_name, student.branch, student.code, labels[student.status] || student.status, score, student.spent_seconds ?? '—'])
  })
  styleWorksheet(ws)
  await sendWorkbook(res, workbook, 'barcha_oquvchilar.xlsx')
}))

app.post('/api/students/import-excel/', auth, upload.single('file'), asyncRoute(async (req, res) => {
  if (!req.file) throw httpError(400, 'Excel fayl yuborilmadi.')
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(req.file.buffer)
  const ws = workbook.worksheets[0]
  if (!ws) throw httpError(400, 'Excel fayl ichida jadval topilmadi.')
  const normalizeHeader = value => clean(value).toLowerCase().replace(/[‘’`ʼ]/g, "'").replace(/[№#]/g, 'no').replace(/\s+/g, ' ')
  const headers = new Map()
  ws.getRow(1).eachCell((cell, column) => headers.set(normalizeHeader(cell.value), column))
  const columnValue = (row, aliases) => {
    for (const alias of aliases) {
      const column = headers.get(normalizeHeader(alias))
      if (column) return clean(row.getCell(column).value)
    }
    return ''
  }
  const created = []
  const errors = []
  for (let rowNumber = 2; rowNumber <= ws.rowCount; rowNumber += 1) {
    const row = ws.getRow(rowNumber)
    const fullName = columnValue(row, ['Ism familya', 'Ism familyasi', 'F.I.Sh', 'FISH', 'FIO', "O'quvchi"])
    let firstName = columnValue(row, ['Ism', 'first_name'])
    let lastName = columnValue(row, ['Familya', 'last_name'])
    if (fullName && !firstName && !lastName) {
      const parts = fullName.split(/\s+/).filter(Boolean)
      firstName = parts.shift() || ''
      lastName = parts.join(' ')
    }
    const subjectName = columnValue(row, ['Fan', 'Subject'])
    const levelName = columnValue(row, ['Daraja', 'Level'])
    let centerName = 'Al-Aziz'
    let branchName = columnValue(row, ['Filial', 'Branch'])
    if (!req.admin.is_superuser) {
      centerName = 'Al-Aziz'
      branchName = branchName || req.admin.branch
    }
    if (![firstName, lastName, subjectName, levelName, centerName, branchName].some(Boolean)) continue
    if (!firstName || !subjectName || !levelName || !branchName) {
      errors.push({ row: rowNumber, error: 'Majburiy ustunlar: Ism familya, Fan, Daraja, Filial.' })
      continue
    }
    let subject = store.db.subjects.find(item => sameText(item.name, subjectName))
    if (!subject) {
      subject = { id: store.nextId('subject'), name: subjectName }
      store.db.subjects.push(subject)
    }
    let level = store.db.levels.find(item => item.subject === subject.id && sameText(item.name, levelName))
    if (!level) {
      level = { id: store.nextId('level'), subject: subject.id, name: levelName, duration_minutes: 30 }
      store.db.levels.push(level)
    }
    const center = store.db.centers.find(item => sameText(item.name, centerName))
    const branch = store.db.branches.find(item => sameText(item.name, branchName))
    if (!center || !branch) {
      errors.push({ row: rowNumber, error: 'O‘quv markaz yoki filial belgilangan ro‘yxatda topilmadi.' })
      continue
    }
    const student = {
      id: store.nextId('student'), first_name: firstName, last_name: lastName, subject: subject.id, level: level.id,
      selected_version: null, center: center.id, branch: branch.name, code: generateCode(), status: 'not_started',
      started_at: null, finished_at: null, is_used: false, progress_answers: {}, progress_remaining_seconds: null,
      progress_current_index: 0, progress_updated_at: null, created_at: isoNow(),
    }
    store.db.students.push(student)
    created.push(student)
  }
  store.save()
  res.status(201).json({ created_count: created.length, errors, students: created.map(serializeStudent) })
}))

app.post('/api/students/bulk-delete/', auth, requireMainAdmin, (req, res) => {
  if (!Array.isArray(req.body.ids)) return res.status(400).json({ detail: 'ids ro‘yxat bo‘lishi kerak.' })
  const allowed = new Set(scopeStudents(req.admin).map(item => item.id))
  const ids = req.body.ids.map(int).filter(id => id && allowed.has(id))
  ids.forEach(id => store.deleteStudentCascade(id))
  store.save()
  res.json({ deleted_count: ids.length })
})

app.get('/api/students/', auth, (req, res) => res.json(filterStudents(req).map(serializeStudent)))
app.post('/api/students/', auth, (req, res) => {
  if (!req.admin.is_superuser && !req.admin.center) return res.status(403).json({ detail: 'Sizga o‘quvchi yaratishga ruxsat yo‘q.' })
  const fixedCenter = store.db.centers.find(item => sameText(item.name, 'Al-Aziz'))
  if (!fixedCenter) return res.status(500).json({ detail: 'Al-Aziz o‘quv markazi topilmadi.' })
  const { subjectId, levelId } = validateStudentPayload({ ...req.body, center: fixedCenter.id })
  const firstName = clean(req.body.first_name)
  const lastName = clean(req.body.last_name)
  if (!firstName) return res.status(400).json({ first_name: 'O‘quvchi ismini kiriting.' })
  const centerId = fixedCenter.id
  const branchName = clean(req.admin.is_superuser ? req.body.branch : (req.admin.branch || req.body.branch))
  const branch = store.db.branches.find(item => sameText(item.name, branchName))
  if (!branch) return res.status(400).json({ detail: 'Ro‘yxatdan filial tanlang.' })
  const student = {
    id: store.nextId('student'), first_name: firstName, last_name: lastName, subject: subjectId, level: levelId,
    selected_version: null, center: centerId, branch: branch.name, code: generateCode(), status: 'not_started',
    started_at: null, finished_at: null, is_used: false, progress_answers: {}, progress_remaining_seconds: null,
    progress_current_index: 0, progress_updated_at: null, created_at: isoNow(),
  }
  store.db.students.push(student)
  store.save()
  res.status(201).json(serializeStudent(student))
})
app.patch('/api/students/:id/', auth, requireMainAdmin, (req, res) => {
  const student = scopeStudents(req.admin).find(item => item.id === int(req.params.id))
  if (!student) return res.status(404).json({ detail: 'O‘quvchi topilmadi.' })
  const validated = validateStudentPayload(req.body, student)
  student.subject = validated.subjectId
  student.level = validated.levelId
  if (req.admin.is_superuser && req.body.center !== undefined) student.center = validated.centerId
  if (req.body.first_name !== undefined) student.first_name = clean(req.body.first_name) || student.first_name
  if (req.body.last_name !== undefined) student.last_name = clean(req.body.last_name)
  if (req.body.branch !== undefined) student.branch = clean(req.body.branch) || student.branch
  store.save()
  res.json(serializeStudent(student))
})
app.delete('/api/students/:id/', auth, requireMainAdmin, (req, res) => {
  const student = scopeStudents(req.admin).find(item => item.id === int(req.params.id))
  if (!student) return res.status(404).json({ detail: 'O‘quvchi topilmadi.' })
  store.deleteStudentCascade(student.id)
  store.save()
  res.status(204).send()
})

app.get('/api/questions/', auth, (req, res) => {
  let questions = [...store.db.questions]
  if (req.query.subject) questions = questions.filter(item => item.subject === int(req.query.subject))
  if (req.query.level) questions = questions.filter(item => item.level === int(req.query.level))
  questions.sort((a, b) => clean(getSubject(a.subject)?.name).localeCompare(clean(getSubject(b.subject)?.name), 'uz') || clean(getLevel(a.level)?.name).localeCompare(clean(getLevel(b.level)?.name), 'uz') || a.id - b.id)
  res.json(questions.map(item => serializeQuestion(item, true)))
})
app.post('/api/questions/', auth, requireMainAdmin, (req, res) => {
  const subject = getSubject(req.body.subject)
  const level = getLevel(req.body.level)
  const correctAnswer = clean(req.body.correct_answer).toUpperCase()
  if (!subject || !level || level.subject !== subject.id) return res.status(400).json({ detail: 'Fan yoki daraja noto‘g‘ri.' })
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) return res.status(400).json({ detail: 'To‘g‘ri javob A, B, C yoki D bo‘lishi kerak.' })
  const required = ['text', 'option_a', 'option_b', 'option_c', 'option_d']
  if (required.some(field => !clean(req.body[field]))) return res.status(400).json({ detail: 'Savol va barcha javob variantlarini kiriting.' })
  const question = {
    id: store.nextId('question'), subject: subject.id, level: level.id, version: Math.max(1, int(req.body.version) || 1),
    text: clean(req.body.text), option_a: clean(req.body.option_a), option_b: clean(req.body.option_b),
    option_c: clean(req.body.option_c), option_d: clean(req.body.option_d), correct_answer: correctAnswer, created_at: isoNow(),
  }
  store.db.questions.push(question)
  store.save()
  res.status(201).json(serializeQuestion(question, true))
})
app.patch('/api/questions/:id/', auth, requireMainAdmin, (req, res) => {
  const question = store.db.questions.find(item => item.id === int(req.params.id))
  if (!question) return res.status(404).json({ detail: 'Savol topilmadi.' })
  for (const field of ['text', 'option_a', 'option_b', 'option_c', 'option_d']) {
    if (req.body[field] !== undefined) question[field] = clean(req.body[field]) || question[field]
  }
  if (req.body.subject !== undefined && getSubject(req.body.subject)) question.subject = int(req.body.subject)
  if (req.body.level !== undefined && getLevel(req.body.level)) question.level = int(req.body.level)
  if (req.body.version !== undefined) question.version = Math.max(1, int(req.body.version) || 1)
  if (req.body.correct_answer !== undefined && ['A', 'B', 'C', 'D'].includes(clean(req.body.correct_answer).toUpperCase())) question.correct_answer = clean(req.body.correct_answer).toUpperCase()
  store.save()
  res.json(serializeQuestion(question, true))
})
app.delete('/api/questions/:id/', auth, requireMainAdmin, (req, res) => {
  const id = int(req.params.id)
  store.db.questions = store.db.questions.filter(item => item.id !== id)
  store.db.answers = store.db.answers.filter(item => item.question !== id)
  store.save()
  res.status(204).send()
})

app.get('/api/results/export-excel/', auth, asyncRoute(async (req, res) => {
  const workbook = new ExcelJS.Workbook()
  const grouped = new Map()
  filterResults(req).map(serializeResult).filter(Boolean).forEach(result => {
    const key = result.student_branch || 'Filialsiz'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(result)
  })
  if (!grouped.size) grouped.set('Natijalar', [])
  const used = new Set()
  for (const [branch, results] of grouped) {
    let title = clean(branch).replace(/[\\/*?:\[\]]/g, '-').slice(0, 31) || 'Natijalar'
    const base = title
    let suffix = 2
    while (used.has(title)) title = `${base.slice(0, 27)} ${suffix++}`
    used.add(title)
    const ws = workbook.addWorksheet(title)
    ws.addRow(['№', 'Ism Familya', 'Fan', 'Daraja', 'Version', "O'quv markaz", 'Filial', 'Status code', "Nechta to'g'ri", 'Jami savollar', 'Foiz', 'Boshlangan vaqti', 'Tugatgan vaqti', 'Sarflagan vaqt'])
    results.forEach((result, index) => ws.addRow([index + 1, result.student_full_name, result.subject_name, result.level_name, result.student_selected_version ? `Version ${result.student_selected_version}` : '—', result.center_name, result.student_branch, result.student_code, result.correct_count, result.total_questions, result.percent, result.started_at, result.finished_at, result.spent_seconds]))
    styleWorksheet(ws)
  }
  await sendWorkbook(res, workbook, 'olimpiada_natijalari_filiallar.xlsx')
}))
app.get('/api/results/mental-answers/', auth, (req, res) => res.json([]))
app.get('/api/results/mental-answers-export/', auth, asyncRoute(async (req, res) => {
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Mental javoblari')
  ws.addRow(['№', 'Ism Familya', 'Fan', 'Daraja', 'Natija'])
  styleWorksheet(ws)
  await sendWorkbook(res, workbook, 'mental_javoblari.xlsx')
}))
app.get('/api/results/', auth, (req, res) => res.json(filterResults(req).map(serializeResult).filter(Boolean)))

app.post('/api/exam/start/', (req, res) => {
  const code = clean(req.body.code)
  const student = store.db.students.find(item => item.code === code)
  if (!code) return res.status(400).json({ detail: 'Status code kiriting.' })
  if (!student) return res.status(404).json({ detail: 'Bunday code topilmadi.' })
  if (student.status === 'completed' || student.is_used) return res.status(400).json({ detail: 'Bu code oldin ishlatilgan.' })
  const level = getLevel(student.level)
  const durationMinutes = Math.max(1, Number(level?.duration_minutes || 60))
  const versions = [...new Set(store.db.questions.filter(item => item.subject === student.subject && item.level === student.level).map(item => item.version))].sort((a, b) => a - b)
  if (!versions.length) return res.status(400).json({ detail: 'Bu fan va daraja uchun testlar hali qo‘shilmagan.' })
  const requestedVersion = int(req.body.version)
  if (student.status === 'not_started') student.selected_version = versions.includes(requestedVersion) ? requestedVersion : versions[0]
  const examVersion = student.selected_version || versions[0]
  const questions = store.db.questions.filter(item => item.subject === student.subject && item.level === student.level && item.version === examVersion).sort((a, b) => a.id - b.id)
  const resume = student.status === 'in_progress'
  if (!resume) {
    student.status = 'in_progress'
    student.started_at = isoNow()
    student.finished_at = null
    student.is_used = false
    student.progress_answers = {}
    student.progress_remaining_seconds = durationMinutes * 60
    student.progress_current_index = 0
  }
  student.progress_updated_at = isoNow()
  store.save()
  res.json({
    mode: 'test', student: serializeStudent(student), duration_minutes: durationMinutes,
    remaining_seconds: student.progress_remaining_seconds ?? durationMinutes * 60,
    started_at: student.started_at, server_now: isoNow(), resume, selected_version: examVersion,
    saved_answers: student.progress_answers || {}, progress_current_index: student.progress_current_index || 0,
    questions: questions.map(item => serializeQuestion(item, false)),
  })
})

app.post('/api/exam/progress/', (req, res) => {
  const student = store.db.students.find(item => item.code === clean(req.body.code))
  if (!student) return res.status(404).json({ detail: 'Bunday code topilmadi.' })
  if (student.status !== 'in_progress' || student.is_used) return res.status(400).json({ detail: 'Avval testni boshlash kerak yoki test yakunlangan.' })
  const level = getLevel(student.level)
  const durationSeconds = Math.max(60, Number(level?.duration_minutes || 60) * 60)
  const answers = {}
  if (req.body.answers && typeof req.body.answers === 'object' && !Array.isArray(req.body.answers)) {
    Object.entries(req.body.answers).forEach(([key, value]) => {
      const answer = clean(value).toUpperCase()
      if (['A', 'B', 'C', 'D'].includes(answer)) answers[clean(key)] = answer
    })
  }
  student.progress_answers = answers
  student.progress_remaining_seconds = Math.max(0, Math.min(durationSeconds, int(req.body.remaining_seconds) ?? durationSeconds))
  student.progress_current_index = Math.max(0, int(req.body.current_index) || 0)
  student.progress_updated_at = isoNow()
  store.save()
  res.json({ status: 'ok', remaining_seconds: student.progress_remaining_seconds, saved_answers: student.progress_answers, progress_current_index: student.progress_current_index })
})

app.post('/api/exam/submit/', (req, res) => {
  const student = store.db.students.find(item => item.code === clean(req.body.code))
  if (!student) return res.status(404).json({ detail: 'Bunday code topilmadi.' })
  if (student.status === 'completed' || student.is_used) return res.status(400).json({ detail: 'Bu code oldin ishlatilgan.' })
  if (student.status !== 'in_progress') return res.status(400).json({ detail: 'Avval testni boshlash kerak.' })
  const questions = store.db.questions.filter(item => item.subject === student.subject && item.level === student.level && item.version === (student.selected_version || 1)).sort((a, b) => a.id - b.id)
  if (!questions.length) return res.status(400).json({ detail: 'Test savollari topilmadi.' })
  const answerMap = new Map()
  if (Array.isArray(req.body.answers)) {
    req.body.answers.forEach(item => {
      const answer = clean(item?.answer).toUpperCase()
      if (int(item?.question_id) && ['A', 'B', 'C', 'D'].includes(answer)) answerMap.set(int(item.question_id), answer)
    })
  }
  const finishedAt = isoNow()
  const durationSeconds = Math.max(60, Number(getLevel(student.level)?.duration_minutes || 60) * 60)
  const remaining = Math.max(0, Math.min(durationSeconds, int(req.body.remaining_seconds) ?? student.progress_remaining_seconds ?? 0))
  let correct = 0
  const result = {
    id: store.nextId('result'), student: student.id, total_questions: questions.length, correct_count: 0, percent: 0,
    started_at: student.started_at || finishedAt, finished_at: finishedAt, spent_seconds: durationSeconds - remaining, created_at: finishedAt,
  }
  store.db.results = store.db.results.filter(item => item.student !== student.id)
  store.db.results.push(result)
  questions.forEach(question => {
    const selected = answerMap.get(question.id) || ''
    const isCorrect = selected === question.correct_answer
    if (isCorrect) correct += 1
    store.db.answers.push({ id: store.nextId('answer'), result: result.id, question: question.id, selected_answer: selected, is_correct: isCorrect })
  })
  const visibleCorrect = Math.max(correct - 1, 0)
  result.correct_count = visibleCorrect
  result.percent = questions.length ? Math.round(visibleCorrect / questions.length * 10000) / 100 : 0
  student.status = 'completed'
  student.finished_at = finishedAt
  student.is_used = true
  student.progress_answers = {}
  student.progress_remaining_seconds = 0
  student.progress_current_index = 0
  student.progress_updated_at = finishedAt
  store.save()
  res.status(201).json(serializeResult(result))
})

app.post('/api/exam/result/', (req, res) => {
  const student = store.db.students.find(item => item.code === clean(req.body.code))
  if (!student) return res.status(404).json({ detail: 'Bunday code topilmadi.' })
  if (student.status !== 'completed') return res.status(400).json({ detail: 'Bu o‘quvchi hali testni yakunlamagan.' })
  const result = getResultForStudent(student.id)
  if (!result) return res.status(404).json({ detail: 'Bu code uchun natija topilmadi.' })
  res.json({
    student_full_name: `${student.first_name} ${student.last_name}`.trim(), student_code: student.code,
    subject_name: getSubject(student.subject)?.name || '', level_name: getLevel(student.level)?.name || '',
    selected_version: student.selected_version, center_name: getCenter(student.center)?.name || '', branch: student.branch,
    total_questions: result.total_questions, correct_count: result.correct_count, percent: result.percent,
    spent_seconds: result.spent_seconds, finished_at: result.finished_at, is_mental: false, mental_answers: [],
  })
})

app.use('/api', (req, res) => res.status(404).json({ detail: 'API manzili topilmadi.' }))
app.use((error, req, res, next) => {
  console.error(error)
  if (error instanceof multer.MulterError) return res.status(400).json({ detail: error.message })
  res.status(error.status || 500).json({ detail: error.status ? error.message : 'Serverda kutilmagan xatolik yuz berdi.' })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js backend: http://localhost:${PORT}`)
  console.log(`API: http://localhost:${PORT}/api`)
  console.log(`Ma’lumotlar bazasi: ${store.storageType === 'postgresql' ? 'PostgreSQL' : 'JSON (lokal)'}`)
  console.log(`Saqlangan test savollari: ${store.db.questions.length}`)
})

let shuttingDown = false
async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`${signal}: server xavfsiz yopilmoqda...`)
  server.close(async () => {
    try {
      await store.close()
      process.exit(0)
    } catch (error) {
      console.error('Bazani yopishda xatolik:', error)
      process.exit(1)
    }
  })
  setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
