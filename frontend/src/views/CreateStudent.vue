<template>
  <div>
    <div class="page-head">
      <div>
        <h2>O‘quvchi yaratish</h2>
        <p>O‘quvchiga fan, daraja/sinf va filial biriktiriladi. O‘quv markaz doim Al-Aziz bo‘ladi.</p>
      </div>
      <div v-if="canCreateStudents" class="page-actions">
        <RouterLink v-if="currentAdmin?.can_manage_branches" class="secondary-btn" to="/admin/branches">+ Filial qo‘shish</RouterLink>
        <RouterLink class="primary-btn" to="/admin/students/import">Excel orqali yuklash</RouterLink>
      </div>
    </div>

    <div v-if="!canCreateStudents" class="error-box">
      Sizga o‘quvchi yaratish ruxsati berilmagan.
    </div>

    <div v-else class="grid-2">
      <div class="panel">
        <h3>Yangi o‘quvchi</h3>
        <form @submit.prevent="createStudent" class="form-grid">
          <label>
            O‘quvchi Ism Familyasi
            <input v-model="form.full_name" placeholder="Masalan: Aliyev Vali" required />
          </label>

          <label>Fan
            <select v-model="form.subject" required @change="filterLevels">
              <option value="">Tanlang</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </label>

          <label>Daraja/Sinf/Sinf
            <select v-model="form.level" required>
              <option value="">Tanlang</option>
              <option v-for="l in filteredLevels" :key="l.id" :value="l.id">
                {{ l.name }} — {{ l.duration_minutes }} daqiqa
              </option>
            </select>
          </label>

          <div class="locked-center-box">
            <span>O‘quv markaz</span>
            <b>Al-Aziz</b>
          </div>


          <label>Filial
            <select v-model="form.branch" required :disabled="Boolean(currentAdmin?.branch)">
              <option value="">Filial tanlang</option>
              <option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
            </select>
          </label>

          <button class="primary-btn">Yaratish</button>
        </form>
        <p v-if="error" class="error-box">{{ error }}</p>
      </div>

      <div class="panel result-panel" v-if="createdStudent">
        <h3>O‘quvchi yaratildi</h3>
        <div class="success-code">{{ createdStudent.code }}</div>
        <p><b>{{ createdStudent.full_name }}</b></p>
        <p>{{ createdStudent.subject_name }} / {{ createdStudent.level_name }}</p>
        <p>{{ createdStudent.center_name }} / {{ createdStudent.branch }}</p>
        <button class="secondary-btn" @click="copyCode(createdStudent.code)">Code copy qilish</button>
        <RouterLink class="primary-btn block-link" to="/admin/students">Yaratilgan o‘quvchilarga o‘tish</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import api from '../api/axios'
import { useBranches } from '../composables/useBranches'
import { useCenters } from '../composables/useCenters'
import { fetchCurrentAdmin, getStoredAdminProfile } from '../utils/auth'

const subjects = ref([])
const levels = ref([])
const createdStudent = ref(null)
const error = ref('')
const currentAdmin = ref(getStoredAdminProfile())
const { branches, loadBranches } = useBranches()
const { centers, loadCenters } = useCenters()
const form = reactive({ full_name: '', subject: '', level: '', center: '', branch: '' })

const SUBJECT_ORDER = ['Ingliz tili', 'Koreys tili', 'Arab tili', 'Hamshiralik', 'Kampyuter', 'IT', 'Matematika', 'Rus tili']
const ENGLISH_LEVEL_ORDER = ['Starter', 'Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced']
const KOREYS_LEVEL_ORDER = ['Boshlang‘ich', 'O‘rta']
const ARAB_LEVEL_ORDER = ['Boshlang‘ich', 'A1', 'A2']
const COMPUTER_LEVEL_ORDER = ['Word Excel', 'PowerPoint']
const IT_LEVEL_ORDER = ['HTML CSS', 'JavaScript', 'VUE.JS', 'React', 'Python', 'Frontend 1', 'Frontend 2', 'Backend 1', 'Backend 2']
const MATHEMATICS_LEVEL_ORDER = ['Boshlang‘ich', 'C+', 'B', 'B+']
const RUSSIAN_LEVEL_ORDER = ['A1', 'A2', 'B1']

function sortByKnownOrder(items, order) {
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a.name)
    const bi = order.indexOf(b.name)
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

const canCreateStudents = computed(() => Boolean(currentAdmin.value?.can_create_students))
const alAzizCenter = computed(() => centers.value.find(center => center.name === 'Al-Aziz'))

const filteredLevels = computed(() => {
  const list = levels.value.filter(l => String(l.subject) === String(form.subject))
  const selectedSubject = subjects.value.find(s => String(s.id) === String(form.subject))
  if (selectedSubject?.name === 'IT') {
    return sortByKnownOrder(list, IT_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Ingliz tili') {
    return sortByKnownOrder(list, ENGLISH_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Koreys tili') {
    return sortByKnownOrder(list, KOREYS_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Arab tili') {
    return sortByKnownOrder(list, ARAB_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Kampyuter') {
    return sortByKnownOrder(list, COMPUTER_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Matematika') {
    return sortByKnownOrder(list, MATHEMATICS_LEVEL_ORDER)
  }
  if (selectedSubject?.name === 'Rus tili') {
    return sortByKnownOrder(list, RUSSIAN_LEVEL_ORDER)
  }

  return list
})

function filterLevels() {
  form.level = ''
}

function splitFullName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) {
    throw new Error('O‘quvchi ism va familyasini to‘liq kiriting.')
  }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
  }
}

function normalizeApiList(data) {
  return Array.isArray(data) ? data : (data?.results || [])
}

async function loadOptions() {
  const [subjectsRes, levelsRes] = await Promise.all([api.get('/subjects/'), api.get('/levels/')])
  subjects.value = sortByKnownOrder(normalizeApiList(subjectsRes.data), SUBJECT_ORDER)
  levels.value = normalizeApiList(levelsRes.data)
}

async function loadCurrentAdmin() {
  try {
    currentAdmin.value = await fetchCurrentAdmin()
    if (currentAdmin.value?.branch) form.branch = currentAdmin.value.branch
  } catch {
    currentAdmin.value = getStoredAdminProfile()
  }
}

async function createStudent() {
  error.value = ''
  try {
    if (!canCreateStudents.value) throw new Error('Sizga o‘quvchi yaratish ruxsati yo‘q.')
    const { first_name, last_name } = splitFullName(form.full_name)
    const centerId = alAzizCenter.value?.id
    if (!centerId) throw new Error('Al-Aziz o‘quv markazi topilmadi.')

    const payload = {
      first_name,
      last_name,
      subject: form.subject,
      level: form.level,
      center: centerId,
      branch: form.branch,
    }
    const res = await api.post('/students/', payload)
    createdStudent.value = res.data
    Object.assign(form, {
      full_name: '',
      subject: '',
      level: '',
      center: centerId,
      branch: currentAdmin.value?.branch || '',
    })
  } catch (e) {
    error.value = e.message || JSON.stringify(e.response?.data || 'Xatolik')
  }
}

async function copyCode(code) {
  await navigator.clipboard.writeText(code)
}

onMounted(async () => {
  await Promise.all([loadOptions(), loadCurrentAdmin(), loadBranches(), loadCenters()])
  form.center = alAzizCenter.value?.id || ''
})
</script>
