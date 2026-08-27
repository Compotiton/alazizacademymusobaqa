import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { arabA1Questions } from './arab-a1-questions.js'
import { arabA2Questions } from './arab-a2-questions.js'
import { arabBeginnerQuestions } from './arab-beginner-questions.js'
import { englishStarterQuestions } from './english-starter-questions.js'
import { englishBeginnerQuestions } from './english-beginner-questions.js'
import { englishElementaryQuestions } from './english-elementary-questions.js'
import { englishPreIntermediateQuestions } from './english-pre-intermediate-questions.js'
import { englishIntermediateQuestions } from './english-intermediate-questions.js'
import { englishUpperIntermediateQuestions } from './english-upper-intermediate-questions.js'
import { englishAdvancedQuestions } from './english-advanced-questions.js'
import { hamshiralikQuestions } from './hamshiralik-questions.js'
import { computerWordExcelQuestions } from './computer-word-excel-questions.js'
import { computerPowerPointQuestions } from './computer-powerpoint-questions.js'
import { itHtmlCssQuestions } from './it-html-css-questions.js'
import { itJavaScriptQuestions } from './it-javascript-questions.js'
import { itVueJsQuestions } from './it-vue-js-questions.js'
import { itReactQuestions } from './it-react-questions.js'
import { itPythonQuestions } from './it-python-questions.js'
import { mathematicsBeginnerQuestions } from './mathematics-beginner-questions.js'
import { mathematicsCPlusQuestions } from './mathematics-c-plus-questions.js'
import { mathematicsBQuestions } from './mathematics-b-questions.js'
import { mathematicsBPlusQuestions } from './mathematics-b-plus-questions.js'
import { russianA1Questions } from './russian-a1-questions.js'
import { russianA2Questions } from './russian-a2-questions.js'
import { russianB1Questions } from './russian-b1-questions.js'

const FIXED_CENTER_NAME = 'Al-Aziz'
const FIXED_BRANCH_NAMES = [
  'Niyozbosh',
  'Xalqabod',
  'Gulbahor',
  'Kasblar',
  'Kids1',
  'Kids2',
  'Do’stobod',
  'Olmazor',
  'Chinoz',
  'Krasin',
  'Pitiletka',
  'Qo’rg’oncha',
  'Kids 3',
  'Oqqo’rg’on',
  'Qo’shyog’och',
]

const normalizeOrganizationName = value => String(value || '')
  .toLocaleLowerCase('uz')
  .replace(/[‘’'`ʻʼ]/g, '')
  .replace(/\s+/g, '')

const now = () => new Date().toISOString()

const koreanBeginnerQuestions = [
  {
    text: '다음 중 문법적으로 맞는 문장을 고르세요.',
    options: ['저는 학생이에요.', '저는 학교를 가요.', '저는 한국어가 공부해요.', '저는 친구에 만나요.'],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 매일 아침 7시___ 일어나요.',
    options: ['를', '에', '에서', '와'],
    answer: 'B',
  },
  {
    text: '‘친구’의 뜻은 무엇입니까?',
    options: ['Ustoz', 'Do‘st', 'Ota', 'Qo‘shni'],
    answer: 'B',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 도서관___ 책을 읽어요.',
    options: ['에서', '을', '와', '이'],
    answer: 'A',
  },
  {
    text: '다음 중 ‘가다’의 반대말은 무엇입니까?',
    options: ['배우다', '오다', '만나다', '보다'],
    answer: 'B',
  },
  {
    text: '다음 중 과거형 문장은 무엇입니까?',
    options: ['저는 영화를 봐요.', '저는 영화를 볼 거예요.', '저는 영화를 봤어요.', '저는 영화를 보세요.'],
    answer: 'C',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 사과___ 좋아해요.',
    options: ['이', '에', '를', '에서'],
    answer: 'C',
  },
  {
    text: '‘어디’는 무엇을 물어볼 때 사용하는 말입니까?',
    options: ['Vaqtni', 'Joyni', 'Odamni', 'Narxni'],
    answer: 'B',
  },
  {
    text: '다음 중 자연스러운 대화를 고르세요.',
    options: [
      '가: 안녕하세요? / 나: 네, 안녕하세요.',
      '가: 이름이 뭐예요? / 나: 네, 안녕하세요.',
      '가: 몇 살이에요? / 나: 학생이에요.',
      '가: 어디에 가요? / 나: 스무 살이에요.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 우즈베키스탄___ 왔어요.',
    options: ['에', '에서', '을', '와'],
    answer: 'B',
  },
  {
    text: '다음 중 올바른 문장을 고르세요.',
    options: ['저는 밥을 먹어요.', '저는 밥에 먹어요.', '저는 밥이 먹어요.', '저는 밥을 먹어요요.'],
    answer: 'A',
  },
  {
    text: '‘어제’와 가장 관계가 있는 것은 무엇입니까?',
    options: ['내일', '오늘', '지난날', '지금'],
    answer: 'C',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n내일 친구___ 만날 거예요.',
    options: ['를', '에', '에서', '이'],
    answer: 'A',
  },
  {
    text: '다음 중 숫자를 바르게 연결한 것을 고르세요.',
    options: ['하나 — 1', '둘 — 4', '셋 — 5', '넷 — 2'],
    answer: 'A',
  },
  {
    text: '다음 중 ‘비싸다’의 반대말은 무엇입니까?',
    options: ['어렵다', '싸다', '작다', '느리다'],
    answer: 'B',
  },
  {
    text: '다음 문장의 의미로 가장 알맞은 것을 고르세요.\n저는 주말에 친구하고 영화를 봤어요.',
    options: [
      'Men dam olish kuni do‘stim bilan kino ko‘rdim.',
      'Men ish kuni do‘stim bilan kitob o‘qidim.',
      'Men dam olish kuni uyda ovqat pishirdim.',
      'Men kecha do‘stim bilan maktabga bordim.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n책상 위___ 책이 있어요.',
    options: ['를', '에', '와', '이'],
    answer: 'B',
  },
  {
    text: '다음 중 높임 표현으로 가장 알맞은 것은 무엇입니까?',
    options: ['먹어', '먹는다', '드세요', '먹자'],
    answer: 'C',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n날씨가 추우___ 따뜻한 옷을 입으세요.',
    options: ['지만', '니까', '고', '도'],
    answer: 'B',
  },
  {
    text: '다음 중 맞는 문장을 고르세요.',
    options: ['저는 한국어를 공부해요.', '저는 한국어에 공부해요.', '저는 한국어가 공부해요.', '저는 한국어를 공부예요.'],
    answer: 'A',
  },
  {
    text: '다음 대화를 읽고 알맞은 답을 고르세요.\n가: 이름이 뭐예요?\n나: __.',
    options: ['열여덟 살이에요.', '학생이에요.', '소윤이에요.', '우즈베키스탄에서 왔어요.'],
    answer: 'C',
  },
  {
    text: '다음 중 ‘맛있다’의 반대말은 무엇입니까?',
    options: ['재미있다', '맛없다', '멋있다', '어렵다'],
    answer: 'B',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 아침 8시___ 학교에 가요.',
    options: ['에', '를', '와', '에서'],
    answer: 'A',
  },
  {
    text: '다음 문장을 읽고 맞는 것을 고르세요.\n민수 씨는 매일 아침 7시에 일어나요. 그리고 8시에 학교에 가요.\n민수 씨는 몇 시에 학교에 갑니까?',
    options: ['오전 6시', '오전 7시', '오전 8시', '오후 8시'],
    answer: 'C',
  },
  {
    text: '다음 대화를 읽고 가장 알맞은 답을 고르세요.\n가: 주말에 뭐 했어요?\n나: 친구하고 쇼핑을 __.',
    options: ['가요', '갔어요', '갈 거예요', '가세요'],
    answer: 'B',
  },
]

const koreanIntermediateQuestions = [
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 어제 친구를 만나___ 같이 밥을 먹었어요.',
    options: ['고', '서', '지만', '으면'],
    answer: 'A',
  },
  {
    text: '다음 중 문법적으로 맞는 문장을 고르세요.',
    options: [
      '비가 오니까 우산을 가져가세요.',
      '비가 오지만 우산을 가져가세요서.',
      '비가 오고 우산을 가져가니까요.',
      '비가 오으면 우산을 가져가세요.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n한국어를 공부한___ 2년이 됐어요.',
    options: ['지', '때', '동안', '후에'],
    answer: 'A',
  },
  {
    text: '다음 문장과 의미가 가장 비슷한 것을 고르세요.\n시간이 없어서 택시를 탔어요.',
    options: [
      '시간이 많아서 택시를 탔어요.',
      '시간이 없었기 때문에 택시를 탔어요.',
      '시간이 없지만 버스를 탔어요.',
      '시간이 생겨서 택시를 타지 않았어요.',
    ],
    answer: 'B',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n한국에 가___ 한국어를 더 열심히 공부하고 싶어요.',
    options: ['고', '면', '지만', '서'],
    answer: 'B',
  },
  {
    text: '다음 중 ‘-(으)ㄹ 수 있다’를 올바르게 사용한 문장은 무엇입니까?',
    options: [
      '저는 한국어를 읽을 수 있어요.',
      '저는 한국어를 읽는 수 있어요.',
      '저는 한국어를 읽은 수 있어요.',
      '저는 한국어를 읽고 수 있어요.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n날씨가 좋___ 공원에 갈 거예요.',
    options: ['으면', '지만', '으니까서', '고 싶어서'],
    answer: 'A',
  },
  {
    text: '다음 중 자연스러운 문장을 고르세요.',
    options: [
      '저는 어제 숙제를 해야 했어요.',
      '저는 어제 숙제를 해야 해요였어요.',
      '저는 어제 숙제를 할 수 있어야 했어요.',
      '저는 어제 숙제를 하기로 해야 했어요.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n동생은 지금 공부___ 있어요.',
    options: ['하', '하고', '해서', '하면'],
    answer: 'B',
  },
  {
    text: '다음 중 ‘-아/어 본 적이 있다’를 올바르게 사용한 문장은 무엇입니까?',
    options: [
      '저는 제주도에 가 본 적이 있어요.',
      '저는 제주도에 간 본 적이 있어요.',
      '저는 제주도에 가는 본 적이 있어요.',
      '저는 제주도에 가고 본 적이 있어요.',
    ],
    answer: 'A',
  },
  {
    text: '다음 문장의 의미로 가장 알맞은 것을 고르세요.\n한국 음식은 맛있지만 조금 매워요.',
    options: [
      'Koreys taomlari mazali va umuman achchiq emas.',
      'Koreys taomlari mazali, lekin biroz achchiq.',
      'Koreys taomlari mazali emas, lekin shirin.',
      'Koreys taomlari juda achchiq bo‘lgani uchun mazali emas.',
    ],
    answer: 'B',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n수업이 끝난___ 친구와 카페에 갔어요.',
    options: ['후에', '동안', '전에', '때문에'],
    answer: 'A',
  },
  {
    text: '다음 중 문법적으로 맞는 문장을 고르세요.',
    options: [
      '한국에 가기 전에 한국어를 공부했어요.',
      '한국에 가는 전에 한국어를 공부했어요.',
      '한국에 간 전에 한국어를 공부했어요.',
      '한국에 가고 전에 한국어를 공부했어요.',
    ],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n저는 내년에 한국에서 공부___ 합니다.',
    options: ['하려고', '하기로', '해야', '하면서'],
    answer: 'A',
  },
  {
    text: '다음 중 ‘-아/어야 하다’의 의미가 가장 알맞은 문장은 무엇입니까?',
    options: [
      '오늘 숙제를 해야 해요.',
      '오늘 숙제를 할 수 있어요.',
      '오늘 숙제를 하고 싶어요.',
      '오늘 숙제를 해 본 적이 있어요.',
    ],
    answer: 'A',
  },
  {
    text: '다음 대화를 읽고 알맞은 답을 고르세요.\n가: 왜 늦었어요?\n나: __.',
    options: ['버스를 놓쳤기 때문이에요.', '버스를 타고 싶어요.', '버스를 탈 수 있어요.', '버스를 타 본 적이 있어요.'],
    answer: 'A',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n친구가 오___ 음식을 준비했어요.',
    options: ['기 전에', '는 동안', '면서', '기 때문에'],
    answer: 'A',
  },
  {
    text: '다음 중 ‘-(으)ㄴ/는 것 같다’를 올바르게 사용한 문장은 무엇입니까?',
    options: [
      '오늘 비가 오는 것 같아요.',
      '오늘 비가 오 것 같아요.',
      '오늘 비가 오는 것 같았어요요.',
      '오늘 비가 온는 것 같아요.',
    ],
    answer: 'A',
  },
  {
    text: '다음 문장과 의미가 같은 것을 고르세요.\n저는 운동을 좋아하지 않지만 건강을 위해 운동해요.',
    options: [
      '운동을 좋아해서 운동해요.',
      '운동을 좋아하지 않아도 건강을 위해 운동해요.',
      '운동을 좋아하니까 운동하지 않아요.',
      '건강하지 않아서 운동을 싫어해요.',
    ],
    answer: 'B',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n시험이 끝나___ 친구들과 여행을 가고 싶어요.',
    options: ['자마자', '는 동안', '기 전에', '던'],
    answer: 'A',
  },
  {
    text: '다음 글을 읽고 맞는 것을 고르세요.\n수진 씨는 평일에는 회사에서 일합니다. 일이 끝난 후에는 집에서 한국어를 공부합니다. 주말에는 친구들과 만나거나 운동을 합니다.\n수진 씨는 언제 한국어를 공부합니까?',
    options: ['평일에 회사에서', '평일에 집에서', '주말에 회사에서', '주말에 친구와 함께'],
    answer: 'B',
  },
  {
    text: '다음 글을 읽고 맞는 것을 고르세요.\n민수 씨는 아침에 늦게 일어났습니다. 그래서 아침을 먹지 못하고 바로 학교에 갔습니다.\n민수 씨가 아침을 먹지 못한 이유는 무엇입니까?',
    options: ['음식이 없었기 때문에', '학교가 멀었기 때문에', '늦게 일어났기 때문에', '아침을 먹기 싫었기 때문에'],
    answer: 'C',
  },
  {
    text: '빈칸에 가장 알맞은 것을 고르세요.\n한국어 실력을 높이___ 매일 새로운 단어를 외우고 있어요.',
    options: ['위해서', '때문에', '동안', '대신'],
    answer: 'A',
  },
  {
    text: '다음 중 가장 자연스러운 문장을 고르세요.',
    options: [
      '저는 한국에 가기 위해서 돈을 모으고 있어요.',
      '저는 한국에 가는 위해서 돈을 모으고 있어요.',
      '저는 한국에 간 위해서 돈을 모으고 있어요.',
      '저는 한국에 가면서 위해서 돈을 모으고 있어요.',
    ],
    answer: 'A',
  },
  {
    text: '다음 글을 읽고 가장 알맞은 것을 고르세요.\n지영 씨는 이번 주말에 친구와 부산에 가려고 했습니다. 하지만 갑자기 비가 많이 올 것 같아서 여행을 다음 주로 미뤘습니다.\n지영 씨는 왜 여행을 미뤘습니까?',
    options: ['친구가 바빠서', '부산에 가기 싫어서', '비가 많이 올 것 같아서', '다음 주에 시험이 있어서'],
    answer: 'C',
  },
]

const seedSubjects = [
  ['Ingliz tili', [['Starter', 30], ['Beginner', 30], ['Elementary', 30], ['Pre-Intermediate', 30], ['Intermediate', 30], ['Upper-Intermediate', 30], ['Advanced', 30]]],
  ['Koreys tili', [['Boshlang‘ich', 30], ['O‘rta', 30]]],
  ['Arab tili', [['Boshlang‘ich', 30], ['A1', 30], ['A2', 30]]],
  ['Hamshiralik', [['Hamshiralik', 30]]],
  ['Kampyuter', [['Word Excel', 30], ['PowerPoint', 30]]],
  ['IT', [['HTML CSS', 30], ['JavaScript', 30], ['VUE.JS', 30], ['React', 30], ['Python', 30]]],
  ['Matematika', [['Boshlang‘ich', 30], ['C+', 30], ['B', 30], ['B+', 30]]],
  ['Rus tili', [['A1', 30], ['A2', 30], ['B1', 30]]],
]

export function freshDatabase() {
  const subjects = []
  const levels = []
  let levelId = 1
  seedSubjects.forEach(([name, subjectLevels], subjectIndex) => {
    const subjectId = subjectIndex + 1
    subjects.push({ id: subjectId, name })
    subjectLevels.forEach(([levelName, duration]) => {
      levels.push({ id: levelId++, subject: subjectId, name: levelName, duration_minutes: duration })
    })
  })

  const koreanSubject = subjects.find(item => item.name === 'Koreys tili')
  const koreanBeginnerLevel = levels.find(item => item.subject === koreanSubject?.id && item.name === 'Boshlang‘ich')
  const koreanIntermediateLevel = levels.find(item => item.subject === koreanSubject?.id && item.name === 'O‘rta')
  const arabSubject = subjects.find(item => item.name === 'Arab tili')
  const arabBeginnerLevel = levels.find(item => item.subject === arabSubject?.id && item.name === 'Boshlang‘ich')
  const arabA1Level = levels.find(item => item.subject === arabSubject?.id && item.name === 'A1')
  const arabA2Level = levels.find(item => item.subject === arabSubject?.id && item.name === 'A2')
  const hamshiralikSubject = subjects.find(item => item.name === 'Hamshiralik')
  const hamshiralikLevel = levels.find(item => item.subject === hamshiralikSubject?.id && item.name === 'Hamshiralik')
  const computerSubject = subjects.find(item => item.name === 'Kampyuter')
  const computerWordExcelLevel = levels.find(item => item.subject === computerSubject?.id && item.name === 'Word Excel')
  const computerPowerPointLevel = levels.find(item => item.subject === computerSubject?.id && item.name === 'PowerPoint')
  const itSubject = subjects.find(item => item.name === 'IT')
  const itHtmlCssLevel = levels.find(item => item.subject === itSubject?.id && item.name === 'HTML CSS')
  const itJavaScriptLevel = levels.find(item => item.subject === itSubject?.id && item.name === 'JavaScript')
  const itVueJsLevel = levels.find(item => item.subject === itSubject?.id && item.name === 'VUE.JS')
  const itReactLevel = levels.find(item => item.subject === itSubject?.id && item.name === 'React')
  const itPythonLevel = levels.find(item => item.subject === itSubject?.id && item.name === 'Python')
  const mathematicsSubject = subjects.find(item => item.name === 'Matematika')
  const mathematicsBeginnerLevel = levels.find(item => item.subject === mathematicsSubject?.id && item.name === 'Boshlang‘ich')
  const mathematicsCPlusLevel = levels.find(item => item.subject === mathematicsSubject?.id && item.name === 'C+')
  const mathematicsBLevel = levels.find(item => item.subject === mathematicsSubject?.id && item.name === 'B')
  const mathematicsBPlusLevel = levels.find(item => item.subject === mathematicsSubject?.id && item.name === 'B+')
  const russianSubject = subjects.find(item => item.name === 'Rus tili')
  const russianA1Level = levels.find(item => item.subject === russianSubject?.id && item.name === 'A1')
  const russianA2Level = levels.find(item => item.subject === russianSubject?.id && item.name === 'A2')
  const russianB1Level = levels.find(item => item.subject === russianSubject?.id && item.name === 'B1')
  const englishSubject = subjects.find(item => item.name === 'Ingliz tili')
  const englishStarterLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Starter')
  const englishBeginnerLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Beginner')
  const englishElementaryLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Elementary')
  const englishPreIntermediateLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Pre-Intermediate')
  const englishIntermediateLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Intermediate')
  const englishUpperIntermediateLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Upper-Intermediate')
  const englishAdvancedLevel = levels.find(item => item.subject === englishSubject?.id && item.name === 'Advanced')
  const beginnerQuestions = koreanBeginnerQuestions.map((question, index) => ({
    id: index + 1,
    subject: koreanSubject.id,
    level: koreanBeginnerLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: question.answer,
    created_at: now(),
  }))
  const intermediateQuestions = koreanIntermediateQuestions.map((question, index) => ({
    id: beginnerQuestions.length + index + 1,
    subject: koreanSubject.id,
    level: koreanIntermediateLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: question.answer,
    created_at: now(),
  }))
  const nursingQuestions = hamshiralikQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + index + 1,
    subject: hamshiralikSubject.id,
    level: hamshiralikLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const arabQuestions = arabBeginnerQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + index + 1,
    subject: arabSubject.id,
    level: arabBeginnerLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: question.answer,
    created_at: now(),
  }))
  const arabA1SeedQuestions = arabA1Questions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + index + 1,
    subject: arabSubject.id,
    level: arabA1Level.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: question.answer,
    created_at: now(),
  }))
  const arabA2SeedQuestions = arabA2Questions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + index + 1,
    subject: arabSubject.id,
    level: arabA2Level.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3],
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishStarterSeedQuestions = englishStarterQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishStarterLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishBeginnerSeedQuestions = englishBeginnerQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishBeginnerLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishElementarySeedQuestions = englishElementaryQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishElementaryLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishPreIntermediateSeedQuestions = englishPreIntermediateQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishPreIntermediateLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishIntermediateSeedQuestions = englishIntermediateQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishIntermediateLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishUpperIntermediateSeedQuestions = englishUpperIntermediateQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishUpperIntermediateLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const englishAdvancedSeedQuestions = englishAdvancedQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + index + 1,
    subject: englishSubject.id,
    level: englishAdvancedLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const computerWordExcelSeedQuestions = computerWordExcelQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + index + 1,
    subject: computerSubject.id,
    level: computerWordExcelLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const computerPowerPointSeedQuestions = computerPowerPointQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + index + 1,
    subject: computerSubject.id,
    level: computerPowerPointLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const itHtmlCssSeedQuestions = itHtmlCssQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + index + 1,
    subject: itSubject.id,
    level: itHtmlCssLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const itJavaScriptSeedQuestions = itJavaScriptQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + itHtmlCssSeedQuestions.length + index + 1,
    subject: itSubject.id,
    level: itJavaScriptLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const itVueJsSeedQuestions = itVueJsQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + itHtmlCssSeedQuestions.length + itJavaScriptSeedQuestions.length + index + 1,
    subject: itSubject.id,
    level: itVueJsLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const itReactSeedQuestions = itReactQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + itHtmlCssSeedQuestions.length + itJavaScriptSeedQuestions.length + itVueJsSeedQuestions.length + index + 1,
    subject: itSubject.id,
    level: itReactLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const itPythonSeedQuestions = itPythonQuestions.map((question, index) => ({
    id: itReactSeedQuestions.at(-1).id + index + 1,
    subject: itSubject.id,
    level: itPythonLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const mathematicsBeginnerSeedQuestions = mathematicsBeginnerQuestions.map((question, index) => ({
    id: itPythonSeedQuestions.at(-1).id + index + 1,
    subject: mathematicsSubject.id,
    level: mathematicsBeginnerLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const mathematicsCPlusSeedQuestions = mathematicsCPlusQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + itHtmlCssSeedQuestions.length + itJavaScriptSeedQuestions.length + itVueJsSeedQuestions.length + itReactSeedQuestions.length + mathematicsBeginnerSeedQuestions.length + index + 1,
    subject: mathematicsSubject.id,
    level: mathematicsCPlusLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const mathematicsBSeedQuestions = mathematicsBQuestions.map((question, index) => ({
    id: beginnerQuestions.length + intermediateQuestions.length + nursingQuestions.length + arabQuestions.length + arabA1SeedQuestions.length + arabA2SeedQuestions.length + englishStarterSeedQuestions.length + englishBeginnerSeedQuestions.length + englishElementarySeedQuestions.length + englishPreIntermediateSeedQuestions.length + englishIntermediateSeedQuestions.length + englishUpperIntermediateSeedQuestions.length + englishAdvancedSeedQuestions.length + computerWordExcelSeedQuestions.length + computerPowerPointSeedQuestions.length + itHtmlCssSeedQuestions.length + itJavaScriptSeedQuestions.length + itVueJsSeedQuestions.length + itReactSeedQuestions.length + mathematicsBeginnerSeedQuestions.length + mathematicsCPlusSeedQuestions.length + index + 1,
    subject: mathematicsSubject.id,
    level: mathematicsBLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const mathematicsBPlusSeedQuestions = mathematicsBPlusQuestions.map((question, index) => ({
    id: mathematicsBSeedQuestions.at(-1).id + index + 1,
    subject: mathematicsSubject.id,
    level: mathematicsBPlusLevel.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const russianA1SeedQuestions = russianA1Questions.map((question, index) => ({
    id: mathematicsBPlusSeedQuestions.at(-1).id + index + 1,
    subject: russianSubject.id,
    level: russianA1Level.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const russianA2SeedQuestions = russianA2Questions.map((question, index) => ({
    id: russianA1SeedQuestions.at(-1).id + index + 1,
    subject: russianSubject.id,
    level: russianA2Level.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const russianB1SeedQuestions = russianB1Questions.map((question, index) => ({
    id: russianA2SeedQuestions.at(-1).id + index + 1,
    subject: russianSubject.id,
    level: russianB1Level.id,
    version: 1,
    text: question.text,
    option_a: question.options[0],
    option_b: question.options[1],
    option_c: question.options[2],
    option_d: question.options[3] || '',
    correct_answer: question.answer,
    created_at: now(),
  }))
  const questions = [...beginnerQuestions, ...intermediateQuestions, ...nursingQuestions, ...arabQuestions, ...arabA1SeedQuestions, ...arabA2SeedQuestions, ...englishStarterSeedQuestions, ...englishBeginnerSeedQuestions, ...englishElementarySeedQuestions, ...englishPreIntermediateSeedQuestions, ...englishIntermediateSeedQuestions, ...englishUpperIntermediateSeedQuestions, ...englishAdvancedSeedQuestions, ...computerWordExcelSeedQuestions, ...computerPowerPointSeedQuestions, ...itHtmlCssSeedQuestions, ...itJavaScriptSeedQuestions, ...itVueJsSeedQuestions, ...itReactSeedQuestions, ...itPythonSeedQuestions, ...mathematicsBeginnerSeedQuestions, ...mathematicsCPlusSeedQuestions, ...mathematicsBSeedQuestions, ...mathematicsBPlusSeedQuestions, ...russianA1SeedQuestions, ...russianA2SeedQuestions, ...russianB1SeedQuestions]

  return {
    meta: {
      nextIds: { admin: 2, center: 2, branch: 16, subject: subjects.length + 1, level: levelId, student: 1, question: questions.length + 1, result: 1, answer: 1 },
      createdAt: now(),
      schemaVersion: 1,
    },
    admins: [],
    centers: [{ id: 1, name: FIXED_CENTER_NAME }],
    branches: FIXED_BRANCH_NAMES.map((name, index) => ({ id: index + 1, name, created_at: now() })),
    subjects,
    levels,
    students: [],
    questions,
    results: [],
    answers: [],
    mentalTasks: [],
  }
}

export class JsonStore {
  constructor(filePath) {
    this.filePath = path.resolve(filePath)
    this.db = null
    this.storageType = 'json'
  }

  async init({ adminLogin, adminPassword }) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true })
    if (fs.existsSync(this.filePath)) {
      this.db = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
    } else {
      this.db = freshDatabase()
    }

    await this.prepareDatabase({ adminLogin, adminPassword })
    await this.save()
  }

  async prepareDatabase({ adminLogin, adminPassword }) {
    if (!this.db?.meta || typeof this.db.meta !== 'object') this.db.meta = freshDatabase().meta
    if (!this.db.meta.nextIds || typeof this.db.meta.nextIds !== 'object') this.db.meta.nextIds = freshDatabase().meta.nextIds
    if (!Array.isArray(this.db.questions)) this.db.questions = []
    if (!Array.isArray(this.db.answers)) this.db.answers = []
    if (!Array.isArray(this.db.results)) this.db.results = []
    if (!Array.isArray(this.db.admins)) this.db.admins = []
    if (!Array.isArray(this.db.students)) this.db.students = []
    if (!Array.isArray(this.db.centers)) this.db.centers = []
    if (!Array.isArray(this.db.branches)) this.db.branches = []
    if (!this.db.meta.builtInTestRevisions) this.db.meta.builtInTestRevisions = {}
    this.ensureOrganizationOptions()
    this.ensureBuiltInTests()
    this.pruneEmptyLevels()

    if (!this.db.admins.some(item => item.username.toLowerCase() === adminLogin.toLowerCase())) {
      const adminId = Math.max(1, ...this.db.admins.map(item => Number(item.id) || 0)) + (this.db.admins.length ? 1 : 0)
      this.db.meta.nextIds.admin = Math.max(Number(this.db.meta.nextIds.admin || 1), adminId + 1)
      this.db.admins.push({
        id: adminId,
        username: adminLogin,
        password_hash: await bcrypt.hash(adminPassword, 12),
        first_name: '',
        last_name: '',
        email: '',
        is_staff: true,
        is_superuser: true,
        center: null,
        branch: '',
        date_joined: now(),
      })
    }
  }

  ensureOrganizationOptions() {
    const preferredCenter = this.db.centers.find(item => (
      ['alaziz', 'alazizacademy'].includes(normalizeOrganizationName(item.name))
    )) || this.db.centers[0]
    const centerId = Number(preferredCenter?.id) || 1
    this.db.centers = [{ ...preferredCenter, id: centerId, name: FIXED_CENTER_NAME }]

    this.db.students.forEach(student => {
      student.center = centerId
      const branchName = FIXED_BRANCH_NAMES.find(name => (
        normalizeOrganizationName(name) === normalizeOrganizationName(student.branch)
      ))
      if (branchName) student.branch = branchName
    })
    this.db.admins.forEach(admin => {
      if (admin.center) admin.center = centerId
      const branchName = FIXED_BRANCH_NAMES.find(name => (
        normalizeOrganizationName(name) === normalizeOrganizationName(admin.branch)
      ))
      if (branchName) admin.branch = branchName
    })

    this.db.branches = FIXED_BRANCH_NAMES.map((name, index) => ({
      id: index + 1,
      name,
      created_at: this.db.branches.find(item => (
        normalizeOrganizationName(item.name) === normalizeOrganizationName(name)
      ))?.created_at || now(),
    }))
    this.db.meta.nextIds.center = Math.max(Number(this.db.meta.nextIds.center || 1), centerId + 1)
    this.db.meta.nextIds.branch = FIXED_BRANCH_NAMES.length + 1
  }

  ensureBuiltInTests() {
    const ensureLevelQuestions = (subjectName, levelName, durationMinutes, sourceQuestions, revision = null) => {
      let subject = this.db.subjects.find(item => item.name === subjectName)
      if (!subject) {
        subject = { id: this.nextId('subject'), name: subjectName }
        this.db.subjects.push(subject)
      }

      let level = this.db.levels.find(item => item.subject === subject.id && item.name === levelName)
      if (!level) {
        level = { id: this.nextId('level'), subject: subject.id, name: levelName, duration_minutes: durationMinutes }
        this.db.levels.push(level)
      }
      level.duration_minutes = durationMinutes

      const existingQuestions = this.db.questions
        .filter(item => item.subject === subject.id && item.level === level.id && item.version === 1)
        .sort((a, b) => a.id - b.id)
      const revisionKey = `${subjectName}::${levelName}`
      const currentRevision = Number(this.db.meta.builtInTestRevisions[revisionKey] || 0)

      if (existingQuestions.length) {
        if (!revision || currentRevision >= revision) return
        const testInProgress = this.db.students.some(item => item.level === level.id && item.status === 'in_progress')
        if (testInProgress) return
        if (existingQuestions.length !== sourceQuestions.length) {
          this.db.meta.builtInTestRevisions[revisionKey] = revision
          return
        }

        existingQuestions.forEach((item, index) => {
          const question = sourceQuestions[index]
          item.text = question.text
          item.option_a = question.options[0]
          item.option_b = question.options[1]
          item.option_c = question.options[2]
          item.option_d = question.options[3] || ''
          item.correct_answer = question.answer
        })
        level.duration_minutes = durationMinutes
        this.db.meta.builtInTestRevisions[revisionKey] = revision
        return
      }

      sourceQuestions.forEach(question => {
        this.db.questions.push({
          id: this.nextId('question'),
          subject: subject.id,
          level: level.id,
          version: 1,
          text: question.text,
          option_a: question.options[0],
          option_b: question.options[1],
          option_c: question.options[2],
          option_d: question.options[3] || '',
          correct_answer: question.answer,
          created_at: now(),
        })
      })
      if (revision) this.db.meta.builtInTestRevisions[revisionKey] = revision
    }

    ensureLevelQuestions('Koreys tili', 'Boshlang‘ich', 30, koreanBeginnerQuestions)
    ensureLevelQuestions('Koreys tili', 'O‘rta', 30, koreanIntermediateQuestions)
    ensureLevelQuestions('Hamshiralik', 'Hamshiralik', 30, hamshiralikQuestions)
    ensureLevelQuestions('Arab tili', 'Boshlang‘ich', 30, arabBeginnerQuestions)
    ensureLevelQuestions('Arab tili', 'A1', 30, arabA1Questions)
    ensureLevelQuestions('Arab tili', 'A2', 30, arabA2Questions)
    ensureLevelQuestions('Ingliz tili', 'Starter', 30, englishStarterQuestions)
    ensureLevelQuestions('Ingliz tili', 'Beginner', 30, englishBeginnerQuestions)
    ensureLevelQuestions('Ingliz tili', 'Elementary', 30, englishElementaryQuestions)
    ensureLevelQuestions('Ingliz tili', 'Pre-Intermediate', 30, englishPreIntermediateQuestions)
    ensureLevelQuestions('Ingliz tili', 'Intermediate', 30, englishIntermediateQuestions, 2)
    ensureLevelQuestions('Ingliz tili', 'Upper-Intermediate', 30, englishUpperIntermediateQuestions)
    ensureLevelQuestions('Ingliz tili', 'Advanced', 30, englishAdvancedQuestions)
    ensureLevelQuestions('Kampyuter', 'Word Excel', 30, computerWordExcelQuestions)
    ensureLevelQuestions('Kampyuter', 'PowerPoint', 30, computerPowerPointQuestions)
    ensureLevelQuestions('IT', 'HTML CSS', 30, itHtmlCssQuestions)
    ensureLevelQuestions('IT', 'JavaScript', 30, itJavaScriptQuestions)
    ensureLevelQuestions('IT', 'VUE.JS', 30, itVueJsQuestions)
    ensureLevelQuestions('IT', 'React', 30, itReactQuestions)
    ensureLevelQuestions('IT', 'Python', 30, itPythonQuestions)
    ensureLevelQuestions('Matematika', 'Boshlang‘ich', 30, mathematicsBeginnerQuestions)
    ensureLevelQuestions('Matematika', 'C+', 30, mathematicsCPlusQuestions)
    ensureLevelQuestions('Matematika', 'B', 30, mathematicsBQuestions)
    ensureLevelQuestions('Matematika', 'B+', 30, mathematicsBPlusQuestions)
    ensureLevelQuestions('Rus tili', 'A1', 30, russianA1Questions)
    ensureLevelQuestions('Rus tili', 'A2', 30, russianA2Questions)
    ensureLevelQuestions('Rus tili', 'B1', 30, russianB1Questions)
  }

  pruneEmptyLevels() {
    const questionLevelIds = new Set(this.db.questions.map(item => item.level))
    const studentLevelIds = new Set(this.db.students.map(item => item.level))

    this.db.levels = this.db.levels.filter(level => (
      questionLevelIds.has(level.id)
      || studentLevelIds.has(level.id)
    ))

    const activeSubjectIds = new Set(this.db.levels.map(item => item.subject))
    this.db.subjects = this.db.subjects.filter(subject => activeSubjectIds.has(subject.id))
  }

  nextId(collection) {
    const value = Number(this.db.meta.nextIds[collection] || 1)
    this.db.meta.nextIds[collection] = value + 1
    return value
  }

  save() {
    const temporary = `${this.filePath}.tmp`
    fs.writeFileSync(temporary, JSON.stringify(this.db, null, 2), 'utf8')
    fs.renameSync(temporary, this.filePath)
  }

  async flush() {}

  async close() {}

  deleteStudentCascade(studentId) {
    const resultIds = this.db.results.filter(item => item.student === studentId).map(item => item.id)
    this.db.answers = this.db.answers.filter(item => !resultIds.includes(item.result))
    this.db.mentalTasks = this.db.mentalTasks.filter(item => item.student !== studentId && !resultIds.includes(item.result))
    this.db.results = this.db.results.filter(item => item.student !== studentId)
    this.db.students = this.db.students.filter(item => item.id !== studentId)
  }
}

export const timestamps = { now }
