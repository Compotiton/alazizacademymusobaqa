<template>
  <div>
    <div class="page-head">
      <div>
        <h2>Filiallar</h2>
        <p>Mavjud filiallarni ko‘ring va yangi filial qo‘shing.</p>
      </div>
      <span class="branch-count-pill">{{ branches.length }} ta filial</span>
    </div>

    <div class="grid-2 branch-management-grid">
      <div class="panel">
        <h3>Yangi filial qo‘shish</h3>
        <form class="form-grid" @submit.prevent="createBranch">
          <label>
            Filial nomi
            <input
              v-model="newBranch"
              maxlength="80"
              placeholder="Masalan: Yangi filial"
              autocomplete="off"
              required
            />
          </label>
          <button class="primary-btn" type="submit" :disabled="saving">
            {{ saving ? 'Saqlanmoqda...' : '+ Filial qo‘shish' }}
          </button>
        </form>

        <div class="hint-box mt">
          Qo‘shilgan filial o‘quvchi yaratish, Excel yuklash, admin biriktirish va barcha filial filtrlarida avtomatik chiqadi.
        </div>
        <p v-if="message" class="success-box">{{ message }}</p>
        <p v-if="error" class="error-box">{{ error }}</p>
      </div>

      <div class="panel">
        <div class="branch-list-head">
          <h3>Filiallar ro‘yxati</h3>
          <button class="secondary-btn" type="button" @click="loadBranches" :disabled="loading">
            {{ loading ? 'Yangilanmoqda...' : 'Yangilash' }}
          </button>
        </div>

        <div v-if="branches.length" class="branch-management-list">
          <div v-for="(branch, index) in branches" :key="branch" class="branch-management-item">
            <span>{{ index + 1 }}</span>
            <b>{{ branch }}</b>
          </div>
        </div>
        <p v-else-if="!loading" class="muted-text">Filiallar topilmadi.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useBranches } from '../composables/useBranches'

const newBranch = ref('')
const saving = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref('')
const { branches, loadBranches: fetchBranches, addBranch } = useBranches()

function apiError(errorValue) {
  const data = errorValue?.response?.data
  return data?.name || data?.detail || errorValue?.message || 'Filialni saqlashda xatolik.'
}

async function loadBranches() {
  loading.value = true
  error.value = ''
  try {
    await fetchBranches()
  } catch (errorValue) {
    error.value = apiError(errorValue)
  } finally {
    loading.value = false
  }
}

async function createBranch() {
  message.value = ''
  error.value = ''
  saving.value = true
  try {
    const savedName = await addBranch(newBranch.value)
    newBranch.value = ''
    message.value = `${savedName} filiali saqlandi.`
    await loadBranches()
  } catch (errorValue) {
    error.value = apiError(errorValue)
  } finally {
    saving.value = false
  }
}

onMounted(loadBranches)
</script>
