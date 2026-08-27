<template>
  <div>
    <div class="page-head">
      <div>
        <h2>Adminlar</h2>
        <p>Qo‘shimcha admin yarating va kerak bo‘lsa unga filial biriktiring.</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h3>Admin yaratish</h3>
        <form @submit.prevent="createAdmin" class="form-grid">
          <label>Login <input v-model="form.username" required /></label>
          <label>Parol <input v-model="form.password" type="password" required minlength="6" /></label>
          <div class="locked-center-box">
            <span>O‘quv markaz</span>
            <b>Al-Aziz</b>
          </div>
          <label>Filial <small class="muted-text">ixtiyoriy</small>
            <select v-model="form.branch">
              <option value="">Filial tanlanmagan</option>
              <option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
            </select>
          </label>
          <button class="primary-btn">Yaratish</button>
        </form>
        <div class="hint-box mt">
          <b>Qo‘shimcha admin ruxsatlari:</b>
          o‘quvchi yaratish va code berish, testlarni ko‘rish, natijalarni ko‘rish.
        </div>
        <p v-if="message" class="success-box">{{ message }}</p>
        <p v-if="error" class="error-box">{{ error }}</p>
      </div>

      <div class="panel">
        <h3>Adminlar ro‘yxati</h3>
        <div class="list-cards">
          <div v-for="admin in admins" :key="admin.id" class="mini-card">
            <b>{{ admin.username }}</b>
            <small><b>O‘quv markaz:</b> {{ admin.center_name || 'Bosh admin' }}</small>
            <small v-if="admin.branch"><b>Filial:</b> {{ admin.branch }}</small>
            <small v-if="!admin.is_main_admin"><b>Ruxsat:</b> O‘quvchi, code, testlar, natijalar</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import api from '../api/axios'
import { useBranches } from '../composables/useBranches'
import { useCenters } from '../composables/useCenters'

const admins = ref([])
const message = ref('')
const error = ref('')
const { branches, loadBranches } = useBranches()
const { centers, loadCenters } = useCenters()
const form = reactive({ username: '', password: '', center: '', branch: '' })
const alAzizCenter = computed(() => centers.value.find(center => center.name === 'Al-Aziz'))

async function loadAdmins() {
  const res = await api.get('/accounts/admins/')
  admins.value = res.data
}

async function createAdmin() {
  message.value = ''
  error.value = ''
  try {
    await api.post('/accounts/admins/', form)
    Object.assign(form, { username: '', password: '', center: alAzizCenter.value?.id || '', branch: '' })
    message.value = 'Admin yaratildi.'
    await loadAdmins()
  } catch (e) {
    error.value = JSON.stringify(e.response?.data || 'Xatolik')
  }
}

onMounted(async () => {
  await Promise.all([loadAdmins(), loadBranches(), loadCenters()])
  form.center = alAzizCenter.value?.id || ''
})
</script>
