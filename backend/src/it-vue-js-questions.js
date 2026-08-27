export const itVueJsQuestions = [
  {
    text: "Vue 3 da ref() nima uchun ishlatiladi?",
    options: ["Komponentni o‘chirish uchun","API yaratish uchun","CSS yozish uchun","Reaktiv qiymat yaratish uchun"],
    answer: "D",
  },
  {
    text: "Quyidagi kod natijasi nima bo‘ladi?\nconst count = ref(0)\ncount.value++",
    options: ["count.value 1 bo‘ladi","count 0 bo‘lib qoladi","Xatolik beradi","count 2 bo‘ladi"],
    answer: "A",
  },
  {
    text: "computed() ning asosiy vazifasi nima?",
    options: ["Komponentni qayta yuklash","API server yaratish","Eventlarni bloklash","Hosilaviy qiymatni hisoblash va cache qilish"],
    answer: "D",
  },
  {
    text: "Vue'da v-if nima qiladi?",
    options: ["Shart asosida elementni DOMga qo‘shadi yoki olib tashlaydi","Input qiymatini bog‘laydi","Elementga class qo‘shadi","Array yaratadi"],
    answer: "A",
  },
  {
    text: "v-for ishlatilganda :key nima uchun kerak?",
    options: ["Element rangini o‘zgartirish uchun","Vue'ga elementlarni samarali kuzatishga yordam berish uchun","Event yaratish uchun","API yuborish uchun"],
    answer: "B",
  },
  {
    text: "v-model asosan nima uchun ishlatiladi?",
    options: ["Komponentni import qilish","Lifecycle boshqarish","CSS animatsiya","Ikki tomonlama data binding"],
    answer: "D",
  },
  {
    text: "Vue 3 Composition API'da onMounted() qachon ishlaydi?",
    options: ["Komponent yaratishdan oldin","Komponent DOMga mount qilingandan keyin","Komponent o‘chirilganda","Faqat button bosilganda"],
    answer: "B",
  },
  {
    text: "props nima uchun ishlatiladi?",
    options: ["Child komponentdan parentga ma’lumot yuborish uchun","CSS ulash uchun","Parent komponentdan child komponentga ma’lumot uzatish uchun","Router yaratish uchun"],
    answer: "C",
  },
  {
    text: "Child komponent parentga hodisa yuborish uchun odatda nimadan foydalanadi?",
    options: ["computed","emit","provide","watch"],
    answer: "B",
  },
  {
    text: "Quyidagi kodda count ning qiymatini olish uchun nima yoziladi?\nconst count = ref(10)",
    options: ["count.value","count.ref","count.data","count.get()"],
    answer: "A",
  },
  {
    text: "reactive() qaysi maqsadda ishlatiladi?",
    options: ["Oddiy string yaratish uchun","Componentni import qilish uchun","Ob'ektni reaktiv qilish uchun","Route yaratish uchun"],
    answer: "C",
  },
  {
    text: "watch() ning vazifasi nima?",
    options: ["Componentni import qilish","CSS o‘zgartirish","Template yaratish","Reactive qiymatdagi o‘zgarishlarni kuzatish"],
    answer: "D",
  },
  {
    text: "Quyidagilardan qaysi biri Vue template ichida to‘g‘ri yozilgan?",
    options: ["<button onclick=\"add()\">Add</button>","<button event-click=\"add\">Add</button>","<button @click=\"add\">Add</button>","<button click=\"@add\">Add</button>"],
    answer: "C",
  },
  {
    text: "v-bind ning qisqa yozilishi qaysi?",
    options: ["#",":","@","$"],
    answer: "B",
  },
  {
    text: "v-on:click ning qisqa ko‘rinishi qaysi?",
    options: [":click","$click","#click","@click"],
    answer: "D",
  },
  {
    text: "Quyidagi computed qanday ishlaydi?\nconst total = computed(() => price.value * quantity.value)",
    options: ["price yoki quantity o‘zgarsa, total qayta hisoblanadi","total faqat bir marta hisoblanadi","total hech qachon o‘zgarmaydi","Kod xato"],
    answer: "A",
  },
  {
    text: "Vue komponentida template nima uchun ishlatiladi?",
    options: ["JavaScript modulini eksport qilish uchun","HTML interfeysini tasvirlash uchun","Server yaratish uchun","Ma'lumotlar bazasini ulash uchun"],
    answer: "B",
  },
  {
    text: "Vue 3 Composition API'da setup() ning vazifasi nima?",
    options: ["Componentning Composition API logikasini tashkil qilish","Browserni ochish","Routerni avtomatik o‘rnatish","CSS fayl yaratish"],
    answer: "A",
  },
  {
    text: "Quyidagilardan qaysi biri v-for uchun to‘g‘ri?\n<li v-for=\"item in items\" :key=\"item.id\">{{ item.name }}</li>",
    options: ["Faqat bitta element chiqaradi","Xatolik beradi","items ichidagi elementlarni chiqaradi","items ni o‘chiradi"],
    answer: "C",
  },
  {
    text: "v-show va v-if orasidagi asosiy farq nima?",
    options: ["v-show elementni DOMdan olib tashlaydi","v-show CSS orqali ko‘rsatish/yashirishni boshqaradi","v-if faqat CSS bilan ishlaydi","Ular orasida farq yo‘q"],
    answer: "B",
  },
  {
    text: "defineProps() Vue 3 <script setup> ichida nima uchun ishlatiladi?",
    options: ["Event yaratish uchun","Router yaratish uchun","State'ni o‘chirish uchun","Propslarni e'lon qilish uchun"],
    answer: "D",
  },
  {
    text: "defineEmits() nima uchun ishlatiladi?",
    options: ["Propslarni o‘qish uchun","API chaqirish uchun","Component emit qiladigan eventlarni e'lon qilish uchun","CSS ulash uchun"],
    answer: "C",
  },
  {
    text: "Quyidagi kodda qaysi holatda watch ishga tushadi?\nwatch(count, () => { console.log('changed') })",
    options: ["count o‘zgarganda","Sahifa ochilganda har doim","Component o‘chirilganda","Faqat console.log chaqirilganda"],
    answer: "A",
  },
  {
    text: "Vue'da nextTick() nima uchun ishlatiladi?",
    options: ["Keyingi JavaScript faylini yuklash uchun","API'ni qayta ishga tushirish uchun","DOM yangilanishi tugagandan keyin kod bajarilishini kutish uchun","Componentni o‘chirish uchun"],
    answer: "C",
  },
  {
    text: "Quyidagi kod nima qiladi?\n<input v-model=\"name\">\n<p>{{ name }}</p>",
    options: ["Input ishlamaydi","Inputdagi qiymat name bilan bog‘lanadi","Faqat <p> ishlaydi","name avtomatik o‘chadi"],
    answer: "B",
  },
  {
    text: "Parent komponentdan child komponentga title yuborishning to‘g‘ri usuli qaysi?",
    options: ["<Child :send=\"title\" />","<Child props.title=\"Hello\" />","<Child title=\"Hello\" />","<Child emit=\"title\" />"],
    answer: "C",
  },
  {
    text: "Vue'da ref bilan primitive qiymat ishlatilganda qaysi xususiyat muhim?",
    options: ["Qiymat .value orqali olinadi/o‘zgartiriladi","ref reaktiv emas","Qiymat .data orqali olinadi","ref faqat object bilan ishlaydi"],
    answer: "A",
  },
  {
    text: "onUnmounted() qachon chaqiriladi?",
    options: ["Har bir click eventida","Component DOMdan olib tashlangandan keyin","Component yaratilishidan oldin","Faqat API javob berganda"],
    answer: "B",
  },
  {
    text: "Quyidagi kodda isLoggedIn true bo‘lsa nima chiqadi?\n<div v-if=\"isLoggedIn\">Welcome</div>\n<div v-else>Login</div>",
    options: ["Welcome","Hech narsa","Login","Ikkalasi ham"],
    answer: "A",
  },
  {
    text: "Quyidagi variantlardan qaysi biri Vue 3 Composition API uchun eng to‘g‘ri?\nconst price = ref(10)\nconst count = ref(2)\nconst total = computed(() => price.value * count.value)",
    options: ["total hech qachon yangilanmaydi","ref qiymatlari reaktiv emas","computed faqat template tashqarisida ishlaydi","total qiymati price yoki count o‘zgarganda avtomatik yangilanadi"],
    answer: "D",
  },
]
