<template>
  <div class="exam-page" :class="{ 'exam-page-layout': !isMental && !isVersionSelect }" v-if="payload">
    <header class="exam-header">
      <div>
        <h1>{{ payload.student.full_name }}</h1>
        <p>{{ payload.student.subject_name }} <span v-if="!isMental && !isVersionSelect">· {{ allQuestions.length }} ta savol</span></p>
      </div>
      <div v-if="!isMental && !isVersionSelect" class="timer" :class="{ danger: remainingSeconds < 300 }">{{ formattedTime }}</div>
      <div v-else-if="isMental" class="timer mental-timer" :class="{ danger: remainingSeconds < 60 }">
        {{ formattedTime }} · Mental {{ Math.min(currentMentalIndex + 1, mentalTasks.length) }}/{{ mentalTasks.length }}
      </div>
    </header>

    <main v-if="isVersionSelect" class="version-select-stage">
      <div class="version-select-card">
        <span class="entry-badge">Test versionini tanlang</span>
        <h2>Version tanlash</h2>
        <p>Qaysi versionni tanlasangiz, shu versiondagi barcha savollar bir bosqichda boshlanadi.</p>

        <div class="version-buttons">
          <button
            v-for="version in availableVersions"
            :key="version.value"
            type="button"
            class="version-choice-btn"
            :disabled="versionLoading"
            @click="chooseVersion(version.value)"
          >
            <b>{{ version.label }}</b>
            <span>{{ version.questions_count }} ta test</span>
          </button>
        </div>

        <p v-if="versionError" class="error-box">{{ versionError }}</p>
        <RouterLink to="/student" class="secondary-btn block-link">Boshqa code kiritish</RouterLink>
      </div>
    </main>

    <main v-else-if="isMental" class="mental-stage">
      <div v-if="mentalPhase === 'countdown'" class="countdown-card">
        <p>Tayyorlaning</p>
        <strong>{{ countdownValue }}</strong>
      </div>

      <div v-else-if="mentalPhase === 'showing'" class="mental-number-card">
        <p>{{ currentMentalIndex + 1 }}-misol</p>
        <strong>{{ shownValue }}</strong>
        <span>Misol 3 sekund ko‘rsatiladi. Javob modalida ham vaqt davom etadi.</span>
      </div>

      <div v-else-if="mentalPhase === 'finished'" class="countdown-card">
        <p>Natija yuborilmoqda...</p>
      </div>

      <div class="mental-progress">
        <span v-for="(task, index) in mentalTasks" :key="task.id" :class="{ active: index === currentMentalIndex, done: mentalAnswers[task.id] !== undefined }"></span>
      </div>

      <div v-if="mentalPhase === 'answer'" class="modal-backdrop">
        <div class="answer-modal">
          <h2>{{ currentMentalIndex + 1 }}-misol javobi</h2>
          <p>Hisoblagan natijangizni kiriting.</p>
          <form @submit.prevent="saveMentalAnswer">
            <input ref="answerInputRef" v-model="answerInput" type="number" inputmode="numeric" placeholder="Javob" required />
            <button class="primary-btn" type="submit">Javobni saqlash</button>
          </form>
        </div>
      </div>

    </main>

    <main v-else class="exam-body swiper-exam-body">
      <div class="exam-progress-head">
        <div>
          <b>{{ currentQuestionIndex + 1 }} / {{ allQuestions.length }}</b>
          <span>{{ answeredCount }} ta ishlangan</span>
        </div>
        <div class="exam-progress-track" aria-label="Test ishlanish foizi">
          <span :style="{ width: `${answeredPercent}%` }"></span>
        </div>
      </div>

      <div
        class="question-swiper"
        @touchstart.passive="handleSwipeStart"
        @touchend.passive="handleSwipeEnd"
        @pointerdown="handlePointerStart"
        @pointerup="handlePointerEnd"
      >
        <Transition :name="slideTransition" mode="out-in">
          <div v-if="currentQuestion" :key="currentQuestion.id" class="question-card swiper-question-card">
            <div class="question-card-head">
              <span class="question-position">{{ currentQuestionIndex + 1 }}-savol</span>
              <span v-if="answers[currentQuestion.id]" class="answered-badge">Javob belgilangan</span>
            </div>
            <h3><span dir="auto">{{ currentQuestion.text }}</span></h3>
            <div class="options-grid">
              <label
                v-for="opt in optionList(currentQuestion)"
                :key="opt.value"
                class="option-card"
                :class="{ selected: answers[currentQuestion.id] === opt.value }"
              >
                <input
                  type="radio"
                  :name="`question-${currentQuestion.id}`"
                  :value="opt.value"
                  :checked="answers[currentQuestion.id] === opt.value"
                  @change="selectAnswer(currentQuestion.id, opt.value)"
                />
                <span><b>{{ opt.value }})</b> {{ opt.text }}</span>
              </label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="question-navigation-panel">
        <div class="question-number-strip" aria-label="Savollar navigatori">
          <button
            v-for="(question, index) in allQuestions"
            :key="question.id"
            type="button"
            class="question-number-btn"
            :class="{ answered: Boolean(answers[question.id]), active: index === currentQuestionIndex }"
            :aria-label="`${index + 1}-savolga o‘tish`"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>

        <div class="swiper-actions">
          <button type="button" class="secondary-btn" :disabled="currentQuestionIndex === 0" @click="previousQuestion">‹ Oldingi</button>
          <button
            v-if="currentQuestionIndex < allQuestions.length - 1"
            type="button"
            class="primary-btn"
            @click="nextQuestion"
          >
            Keyingi ›
          </button>
          <button
            v-else
            type="button"
            class="primary-btn finish-btn"
            :disabled="submitting || finishModal.show"
            @click="submitExam()"
          >
            {{ submitting ? 'Yakunlanmoqda...' : 'Testni yakunlash' }}
          </button>
        </div>
      </div>
    </main>

    <div v-if="finishModal.show" class="modal-backdrop success-backdrop">
      <div class="finish-modal-card" :class="finishModal.type">
        <div class="finish-icon">{{ finishModal.type === 'success' ? '✓' : '!' }}</div>
        <h2>{{ finishModal.title }}</h2>
        <p>{{ finishModal.message }}</p>
        <button class="primary-btn" type="button" @click="finishModal.type === 'success' ? goToStudentLogin() : closeFinishModal()">{{ finishModal.type === 'success' ? 'Code kiritish sahifasiga qaytish' : 'Yopish' }}</button>
      </div>
    </div>
  </div>
  <div v-else class="student-entry-page">
    <div class="student-card">
      <h1>Test topilmadi</h1>
      <RouterLink to="/student" class="primary-btn block-link">Code kiritish sahifasiga qaytish</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()
const payload = ref(null)
const answers = reactive({})
const remainingSeconds = ref(0)
const submitting = ref(false)
const finishModal = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
  result: null,
})

const mentalPhase = ref('countdown')
const countdownValue = ref(3)
const currentMentalIndex = ref(0)
const shownValue = ref('')
const mentalAnswers = reactive({})
const answerInput = ref('')
const answerInputRef = ref(null)
const versionLoading = ref(false)
const versionError = ref('')
const currentQuestionIndex = ref(0)
const slideTransition = ref('slide-next')
const mentalTimers = []

let intervalId = null
let submitted = false
let progressSaveTimer = null
let autoAdvanceTimer = null
let lastServerProgressSave = 0
let timerTicksSinceServerSave = 0
let swipeStartX = null

const isVersionSelect = computed(() => payload.value?.mode === 'version_select')
const isMental = computed(() => payload.value?.mode === 'mental')
const mentalTasks = computed(() => payload.value?.mental_tasks || [])
const availableVersions = computed(() => payload.value?.available_versions || [])
const allQuestions = computed(() => payload.value?.questions || [])
const currentQuestion = computed(() => allQuestions.value[currentQuestionIndex.value] || null)
const answeredCount = computed(() => allQuestions.value.filter(question => Boolean(answers[question.id])).length)
const answeredPercent = computed(() => allQuestions.value.length
  ? Math.round((answeredCount.value / allQuestions.value.length) * 100)
  : 0)
const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60)
  const s = remainingSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function showFinishSuccess() {
  finishModal.show = true
  finishModal.type = 'success'
  finishModal.title = 'Test yakunlandi'
  finishModal.message = 'Javoblaringiz adminga yuborildi.'
  // O‘quvchiga nechta to‘g‘ri topgani va foiz ko‘rsatilmaydi.
  // Natijalar faqat admin panelda ko‘rinadi.
  finishModal.result = null
}

function showFinishError(message) {
  finishModal.show = true
  finishModal.type = 'error'
  finishModal.title = 'Xatolik yuz berdi'
  finishModal.message = message || 'Javoblarni yuborishda xatolik yuz berdi.'
  finishModal.result = null
}

function goToStudentLogin() {
  router.push('/student')
}

function closeFinishModal() {
  finishModal.show = false
}

function optionList(q) {
  return [
    { value: 'A', text: q.option_a },
    { value: 'B', text: q.option_b },
    { value: 'C', text: q.option_c },
    { value: 'D', text: q.option_d },
  ].filter(option => option.text)
}

function goToQuestion(index) {
  const nextIndex = Math.max(0, Math.min(Number(index), allQuestions.value.length - 1))
  if (!Number.isFinite(nextIndex) || nextIndex === currentQuestionIndex.value) return
  slideTransition.value = nextIndex > currentQuestionIndex.value ? 'slide-next' : 'slide-prev'
  currentQuestionIndex.value = nextIndex
  persistTestProgress()
  nextTick(() => {
    document.querySelector('.question-number-btn.active')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  })
}

function previousQuestion() {
  goToQuestion(currentQuestionIndex.value - 1)
}

function nextQuestion() {
  goToQuestion(currentQuestionIndex.value + 1)
}

function selectAnswer(questionId, value) {
  answers[questionId] = value
  persistTestProgress()
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
  if (currentQuestionIndex.value < allQuestions.value.length - 1) {
    const answeredIndex = currentQuestionIndex.value
    autoAdvanceTimer = setTimeout(() => {
      autoAdvanceTimer = null
      if (currentQuestionIndex.value === answeredIndex) nextQuestion()
    }, 320)
  }
}

function handleSwipeStart(event) {
  swipeStartX = event.changedTouches?.[0]?.clientX ?? null
}

function handleSwipeEnd(event) {
  if (swipeStartX === null) return
  const endX = event.changedTouches?.[0]?.clientX
  if (!Number.isFinite(endX)) return
  const distance = endX - swipeStartX
  swipeStartX = null
  if (Math.abs(distance) < 55) return
  if (distance < 0) nextQuestion()
  else previousQuestion()
}

function handlePointerStart(event) {
  if (event.pointerType === 'touch') return
  swipeStartX = event.clientX
}

function handlePointerEnd(event) {
  if (event.pointerType === 'touch' || swipeStartX === null) return
  const distance = event.clientX - swipeStartX
  swipeStartX = null
  if (Math.abs(distance) < 70) return
  if (distance < 0) nextQuestion()
  else previousQuestion()
}

function payloadCode() {
  return payload.value?.code || payload.value?.student?.code || ''
}

function examProgressKey() {
  const code = payloadCode()
  return code ? `exam_progress_${code}` : ''
}

function buildProgressBody() {
  return {
    code: payloadCode(),
    remaining_seconds: Math.max(0, Number(remainingSeconds.value || 0)),
    current_index: isMental.value ? Number(currentMentalIndex.value || 0) : Number(currentQuestionIndex.value || 0),
    answers: isMental.value ? { ...mentalAnswers } : { ...answers },
  }
}

async function saveProgressToServer(force = false) {
  if (!payload.value || submitted || isVersionSelect.value || !payloadCode()) return
  const now = Date.now()
  if (!force && now - lastServerProgressSave < 12000) return
  lastServerProgressSave = now
  try {
    await api.post('/exam/progress/', buildProgressBody())
  } catch (_) {}
}

function scheduleProgressSave() {
  if (!payload.value || submitted) return
  if (progressSaveTimer) clearTimeout(progressSaveTimer)
  progressSaveTimer = setTimeout(() => {
    progressSaveTimer = null
    saveProgressToServer(true)
  }, 3000)
}

function persistTestProgress(sendRemote = true) {
  const key = examProgressKey()
  if (!key) return
  localStorage.setItem(key, JSON.stringify({
    answers: { ...answers },
    remaining_seconds: remainingSeconds.value,
    current_index: currentQuestionIndex.value,
  }))
  if (sendRemote !== false) scheduleProgressSave()
}

function loadTestProgress() {
  const serverAnswers = payload.value?.saved_answers
  if (serverAnswers && typeof serverAnswers === 'object') {
    Object.assign(answers, serverAnswers)
  }

  let savedIndex = Number(payload.value?.progress_current_index)
  const key = examProgressKey()
  if (!key) {
    currentQuestionIndex.value = Number.isFinite(savedIndex)
      ? Math.max(0, Math.min(savedIndex, allQuestions.value.length - 1))
      : 0
    return
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}')
    if (saved.answers && typeof saved.answers === 'object') {
      Object.assign(answers, saved.answers)
    }
    if (Number.isFinite(Number(saved.current_index))) savedIndex = Number(saved.current_index)
  } catch (_) {}
  const firstUnansweredIndex = allQuestions.value.findIndex(question => !answers[question.id])
  const fallbackIndex = firstUnansweredIndex === -1 ? allQuestions.value.length - 1 : firstUnansweredIndex
  currentQuestionIndex.value = Number.isFinite(savedIndex)
    ? Math.max(0, Math.min(savedIndex, allQuestions.value.length - 1))
    : Math.max(0, fallbackIndex)
}

function safeDurationMinutes(defaultMinutes) {
  if (isMental.value) return 5
  const value = Number(defaultMinutes)
  return Number.isFinite(value) && value > 0 ? value : 60
}

function remainingFromStartedAt(defaultMinutes) {
  const minutes = safeDurationMinutes(defaultMinutes)
  const durationSeconds = Math.max(1, minutes * 60)
  const savedRemaining = Number(payload.value?.remaining_seconds)
  if (Number.isFinite(savedRemaining) && savedRemaining >= 0) {
    return Math.max(0, Math.min(durationSeconds, Math.floor(savedRemaining)))
  }

  // Backend yangi test boshlanganda resume=false yuboradi.
  // Shunda yangi yaratilgan o‘quvchi 00:00 bo‘lib qolmaydi, 30:00 dan boshlaydi.
  if (payload.value?.resume === false) {
    return durationSeconds
  }

  const startedAt = Date.parse(payload.value?.started_at || '')
  if (!Number.isFinite(startedAt)) {
    return durationSeconds
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  return Math.max(0, durationSeconds - elapsedSeconds)
}

function clearMentalTimers() {
  while (mentalTimers.length) clearTimeout(mentalTimers.pop())
}

function mentalProgressKey() {
  const code = payloadCode()
  return code ? `mental_progress_${code}` : ''
}

function persistMentalProgress(sendRemote = true) {
  const key = mentalProgressKey()
  if (!key) return
  localStorage.setItem(key, JSON.stringify({
    answers: { ...mentalAnswers },
    remaining_seconds: remainingSeconds.value,
    current_index: currentMentalIndex.value,
  }))
  if (sendRemote !== false) scheduleProgressSave()
}

function loadMentalProgress() {
  const serverAnswers = payload.value?.saved_answers
  if (serverAnswers && typeof serverAnswers === 'object') {
    Object.assign(mentalAnswers, serverAnswers)
  }

  const key = mentalProgressKey()
  try {
    if (key) {
      const saved = JSON.parse(localStorage.getItem(key) || '{}')
      if (saved.answers && typeof saved.answers === 'object') {
        Object.assign(mentalAnswers, saved.answers)
      }
    }
    const firstUnansweredIndex = mentalTasks.value.findIndex(task => mentalAnswers[task.id] === undefined)
    const serverIndex = Number(payload.value?.progress_current_index || 0)
    currentMentalIndex.value = firstUnansweredIndex === -1
      ? mentalTasks.value.length
      : Math.max(0, Math.min(firstUnansweredIndex, Number.isFinite(serverIndex) ? serverIndex : firstUnansweredIndex))
  } catch (_) {
    currentMentalIndex.value = 0
  }
}

function startMentalCountdown(startIndex = 0) {
  mentalPhase.value = 'countdown'
  countdownValue.value = 3
  const tick = () => {
    if (countdownValue.value <= 1) {
      playMentalTask(startIndex)
      return
    }
    countdownValue.value -= 1
    mentalTimers.push(setTimeout(tick, 1000))
  }
  mentalTimers.push(setTimeout(tick, 1000))
}

function playMentalTask(index) {
  clearMentalTimers()
  const task = mentalTasks.value[index]
  if (!task) {
    submitMentalExam()
    return
  }

  currentMentalIndex.value = index
  mentalPhase.value = 'showing'
  shownValue.value = ''
  answerInput.value = ''

  const flashes = task.flashes || []
  const taskDisplayMs = Number(task.task_display_ms || 3000)
  const perFlashMs = flashes.length ? Math.max(250, Math.floor(taskDisplayMs / flashes.length)) : taskDisplayMs

  flashes.forEach((value, flashIndex) => {
    mentalTimers.push(setTimeout(() => {
      shownValue.value = value
    }, flashIndex * perFlashMs))
  })

  mentalTimers.push(setTimeout(async () => {
    mentalPhase.value = 'answer'
    shownValue.value = ''
    await nextTick()
    answerInputRef.value?.focus()
  }, taskDisplayMs))
}

function saveMentalAnswer() {
  const task = mentalTasks.value[currentMentalIndex.value]
  if (!task) return

  mentalAnswers[task.id] = answerInput.value
  persistMentalProgress()

  const nextIndex = currentMentalIndex.value + 1
  if (remainingSeconds.value <= 0 || nextIndex >= mentalTasks.value.length) {
    submitMentalExam()
  } else {
    playMentalTask(nextIndex)
  }
}

async function submitMentalExam() {
  if (submitted || !payload.value) return
  submitted = true
  submitting.value = true
  mentalPhase.value = 'finished'
  clearMentalTimers()
  if (progressSaveTimer) {
    clearTimeout(progressSaveTimer)
    progressSaveTimer = null
  }

  const lastAttemptedIndex = Math.min(currentMentalIndex.value, mentalTasks.value.length - 1)
  const answerList = mentalTasks.value
    .filter((task, index) => index <= lastAttemptedIndex || mentalAnswers[task.id] !== undefined)
    .map(task => ({
      task_id: task.id,
      answer: mentalAnswers[task.id] ?? '',
    }))

  try {
    const response = await api.post('/exam/submit/', {
      code: payloadCode(),
      answers: answerList,
      remaining_seconds: Math.max(0, Number(remainingSeconds.value || 0)),
    })
    sessionStorage.removeItem('exam_payload')
    localStorage.removeItem(mentalProgressKey())
    localStorage.removeItem(examProgressKey())
    showFinishSuccess(response.data)
  } catch (e) {
    const completed = await recoverCompletedSubmission()
    if (!completed) {
      submitted = false
      showFinishError(e.response?.data?.detail || 'Mental javoblarni yuborishda xatolik.')
    }
  } finally {
    submitting.value = false
  }
}


async function submitExam(force = false) {
  if (submitted || !payload.value) return
  if (!force) {
    const firstUnansweredIndex = allQuestions.value.findIndex(question => !answers[question.id])
    if (firstUnansweredIndex !== -1) {
      goToQuestion(firstUnansweredIndex)
      showFinishError(`Testni yakunlashdan oldin barcha savollarni ishlang. ${allQuestions.value.length - answeredCount.value} ta savol javobsiz qolgan.`)
      return
    }
  }
  submitted = true
  submitting.value = true
  clearInterval(intervalId)
  if (progressSaveTimer) {
    clearTimeout(progressSaveTimer)
    progressSaveTimer = null
  }
  const answerList = payload.value.questions.map(q => ({ question_id: q.id, answer: answers[q.id] || '' }))
  try {
    const response = await api.post('/exam/submit/', {
      code: payloadCode(),
      answers: answerList,
      remaining_seconds: Math.max(0, Number(remainingSeconds.value || 0)),
    })
    sessionStorage.removeItem('exam_payload')
    localStorage.removeItem(examProgressKey())
    localStorage.removeItem(mentalProgressKey())
    showFinishSuccess(response.data)
  } catch (e) {
    const completed = await recoverCompletedSubmission()
    if (!completed) {
      submitted = false
      showFinishError(e.response?.data?.detail || 'Testni yakunlashda xatolik.')
      if (remainingSeconds.value > 0) startTimer()
    }
  } finally {
    submitting.value = false
  }
}

async function recoverCompletedSubmission() {
  try {
    const response = await api.post('/exam/result/', { code: payloadCode() })
    sessionStorage.removeItem('exam_payload')
    localStorage.removeItem(examProgressKey())
    localStorage.removeItem(mentalProgressKey())
    submitted = true
    showFinishSuccess(response.data)
    return true
  } catch (_) {
    return false
  }
}


async function chooseVersion(version) {
  if (!payload.value || versionLoading.value) return
  versionLoading.value = true
  versionError.value = ''
  try {
    const res = await api.post('/exam/start/', { code: payloadCode(), version })
    const nextPayload = { ...res.data, code: payloadCode() }
    payload.value = nextPayload
    sessionStorage.setItem('exam_payload', JSON.stringify(nextPayload))
    bootExamPayload()
  } catch (e) {
    versionError.value = e.response?.data?.detail || 'Versionni boshlashda xatolik yuz berdi.'
  } finally {
    versionLoading.value = false
  }
}

function clearObject(target) {
  Object.keys(target).forEach(key => delete target[key])
}

function bootExamPayload() {
  clearInterval(intervalId)
  clearMentalTimers()
  clearObject(answers)
  clearObject(mentalAnswers)
  submitted = false
  submitting.value = false
  versionError.value = ''
  finishModal.show = false
  currentMentalIndex.value = 0
  currentQuestionIndex.value = 0
  mentalPhase.value = 'countdown'
  countdownValue.value = 3

  if (!payload.value || isVersionSelect.value) return

  if (isMental.value) {
    // Mentalda code qayta kiritilganda vaqt yangidan boshlanmaydi.
    // Backend bergan started_at bo‘yicha qolgan vaqt hisoblanadi.
    const durationMinutes = safeDurationMinutes(payload.value.duration_minutes || 5)
    remainingSeconds.value = remainingFromStartedAt(durationMinutes)

    loadMentalProgress()
    if (remainingSeconds.value <= 0 || currentMentalIndex.value >= mentalTasks.value.length) {
      submitMentalExam()
    } else {
      startTimer()
      startMentalCountdown(currentMentalIndex.value)
    }
    return
  }

  // Oddiy English testda 60 minut vaqt beriladi. Code qayta kiritilganda avvalgi javoblar va qolgan vaqt saqlanadi.
  const durationMinutes = safeDurationMinutes(payload.value.duration_minutes || 60)
  remainingSeconds.value = remainingFromStartedAt(durationMinutes)
  loadTestProgress()

  if (remainingSeconds.value <= 0) {
    submitExam(true)
  } else {
    startTimer()
  }
}

function startTimer() {
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (submitted) {
      clearInterval(intervalId)
      return
    }

    // Vaqt backenddagi started_at bo‘yicha hisoblanadi; bu yerda faqat ekrandagi timer yuradi.
    // Javoblar localStorage’da saqlanadi, code qayta kiritilganda boshidan boshlanmaydi.
    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
    if (isMental.value) persistMentalProgress(false)
    else persistTestProgress(false)

    timerTicksSinceServerSave += 1
    if (timerTicksSinceServerSave >= 15) {
      timerTicksSinceServerSave = 0
      saveProgressToServer(false)
    }

    if (remainingSeconds.value <= 0) {
      remainingSeconds.value = 0
      clearInterval(intervalId)
      clearMentalTimers()
      if (isMental.value) submitMentalExam()
      else submitExam(true)
    }
  }, 1000)
}

function saveProgressBeforeExit() {
  if (!payload.value || submitted || isVersionSelect.value) return
  if (isMental.value) persistMentalProgress(false)
  else persistTestProgress(false)

  try {
    const body = JSON.stringify(buildProgressBody())
    fetch(`${api.defaults.baseURL}/exam/progress/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch (_) {}
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') saveProgressBeforeExit()
}

onMounted(() => {
  window.addEventListener('pagehide', saveProgressBeforeExit)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  const saved = sessionStorage.getItem('exam_payload')
  if (!saved) return
  payload.value = JSON.parse(saved)
  bootExamPayload()
})

onBeforeUnmount(() => {
  saveProgressBeforeExit()
  window.removeEventListener('pagehide', saveProgressBeforeExit)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearInterval(intervalId)
  if (progressSaveTimer) clearTimeout(progressSaveTimer)
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer)
  clearMentalTimers()
})
</script>


<style scoped>

.exam-page-layout {
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.exam-page-layout .exam-header {
  position: relative;
  flex: 0 0 auto;
}

.swiper-exam-body {
  flex: 1 1 auto;
  min-height: 0;
  width: min(1040px, 100%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 24px;
  overflow: hidden;
}

.exam-progress-head {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: auto minmax(180px, 1fr);
  align-items: center;
  gap: 18px;
  padding: 12px 16px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.exam-progress-head > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 12px;
  white-space: nowrap;
}

.exam-progress-head b {
  color: #0f172a;
  font-size: 18px;
}

.exam-progress-head span {
  color: #64748b;
  font-weight: 800;
}

.exam-progress-track {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
}

.exam-progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transition: width 0.25s ease;
}

.question-swiper {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  touch-action: pan-y;
  position: relative;
}

.swiper-question-card {
  height: 100%;
  min-height: 0;
  margin: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(18px, 3vw, 30px);
}

.question-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.question-position,
.answered-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
}

.question-position {
  color: #1d4ed8;
  background: #dbeafe;
}

.answered-badge {
  color: #166534;
  background: #dcfce7;
}

.swiper-question-card h3 {
  margin: 0 0 22px;
  font-size: clamp(19px, 2.3vw, 27px);
  line-height: 1.45;
}

.question-navigation-panel {
  flex: 0 0 auto;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 -8px 30px rgba(15, 23, 42, 0.08);
}

.question-number-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 3px 3px 10px;
  scrollbar-width: thin;
}

.question-number-btn {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #334155;
  font-weight: 900;
  cursor: pointer;
  transition: 0.18s ease;
}

.question-number-btn:hover {
  border-color: #60a5fa;
}

.question-number-btn.answered {
  border-color: #16a34a;
  background: #22c55e;
  color: #fff;
}

.question-number-btn.active {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.24);
}

.question-number-btn.active:not(.answered) {
  background: #2563eb;
  color: #fff;
}

.swiper-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.swiper-actions button {
  min-width: 132px;
}

.swiper-actions .finish-btn {
  width: auto;
  margin: 0;
  font-size: inherit;
  padding: 12px 18px;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.slide-next-enter-from,
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(42px);
}

.slide-next-leave-to,
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-42px);
}

@media (max-width: 640px) {
  .swiper-exam-body {
    width: 100%;
    padding: 10px;
    gap: 9px;
  }

  .exam-progress-head {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 9px 12px;
  }

  .swiper-question-card {
    padding: 16px;
  }

  .swiper-question-card h3 {
    margin-bottom: 14px;
  }

  .question-navigation-panel {
    padding: 9px;
    border-radius: 16px;
  }

  .question-number-btn {
    flex-basis: 36px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .swiper-actions button {
    width: auto;
    min-width: 0;
    flex: 1 1 0;
  }
}

.question-card h3 {
  white-space: pre-line;
}

.stage-info-card {
  margin-bottom: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.28);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #0f172a;
}

.stage-info-card span, .stage-hint {
  color: #64748b;
}

.stage-hint {
  text-align: center;
  margin-top: 10px;
}

.version-select-stage {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.version-select-card {
  width: min(720px, 100%);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
  text-align: center;
}

.version-select-card h2 {
  margin: 12px 0 8px;
  color: #0f172a;
}

.version-select-card p {
  color: #64748b;
}

.version-buttons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 24px 0;
}

.version-choice-btn {
  border: 1px solid rgba(79, 70, 229, 0.28);
  border-radius: 22px;
  padding: 20px 14px;
  background: linear-gradient(180deg, #ffffff, #eef2ff);
  cursor: pointer;
  display: grid;
  gap: 8px;
  color: #1e1b4b;
  transition: 0.2s ease;
}

.version-choice-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: rgba(79, 70, 229, 0.65);
  box-shadow: 0 16px 34px rgba(79, 70, 229, 0.18);
}

.version-choice-btn b {
  font-size: 20px;
}

.version-choice-btn span {
  color: #64748b;
  font-weight: 800;
}

@media (max-width: 720px) {
  .version-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
