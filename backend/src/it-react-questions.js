export const itReactQuestions = [
  {
    text: "React'da state yaratish uchun qaysi Hook ishlatiladi?",
    options: ["useState()","useValue()","createState()","useData()"],
    answer: "A",
  },
  {
    text: "Quyidagi kodda 0 nimani bildiradi?\nconst [number, setNumber] = React.useState(0)",
    options: ["HTML ID'sini","State'ning boshlang‘ich qiymatini","Function qiymatini","Component raqamini"],
    answer: "B",
  },
  {
    text: "setNumber nima uchun ishlatiladi?",
    options: ["Componentni o‘chirish uchun","HTML element yaratish uchun","CSS yaratish uchun","number state'ini yangilash uchun"],
    answer: "D",
  },
  {
    text: "Quyidagi kod nima qiladi?\nsetNumber(number + 1)",
    options: ["State'ni o‘chiradi","State'ni 0 qiladi","State'ni 1 ga oshiradi","State'ni 1 ga kamaytiradi"],
    answer: "C",
  },
  {
    text: "React'da button bosilganda function ishga tushirish uchun nima ishlatiladi?",
    options: ["onClick","click","onButton","onPress"],
    answer: "A",
  },
  {
    text: "Quyidagi kod qachon minus funksiyasini ishga tushiradi?\n<button onClick={minus}>-</button>",
    options: ["Component yaratilganda","Input o‘zgarganda","Button bosilganda","Sahifa ochilganda"],
    answer: "C",
  },
  {
    text: "React'da input qiymati o‘zgarganda qaysi event ishlatiladi?",
    options: ["onUpdate","onText","onInputValue","onChange"],
    answer: "D",
  },
  {
    text: "e.target.value nimani bildiradi?",
    options: ["Component nomini","Inputning joriy qiymatini","Elementning ID'sini","Elementning classini"],
    answer: "B",
  },
  {
    text: "Quyidagi kod nima qiladi?\nconst [text, setText] = React.useState(\"\")",
    options: ["React componentni o‘chiradi","CSS class yaratadi","text state yaratadi va boshlang‘ich qiymatini bo‘sh string qiladi","HTML input yaratadi"],
    answer: "C",
  },
  {
    text: "Quyidagi JSX nima qiladi?\n<h2>{text}</h2>",
    options: ["text qiymatini ekranga chiqaradi","Input yaratadi","Yangi state yaratadi","text state'ini o‘chiradi"],
    answer: "A",
  },
  {
    text: "JSX'da JavaScript qiymatini chiqarish uchun qaysi belgi ishlatiladi?",
    options: ["<>","()","[]","{}"],
    answer: "D",
  },
  {
    text: "React component yaratishning to‘g‘ri ko‘rinishi qaysi?",
    options: ["function App() { return <h1>Hello</h1> }","React App() {}","create App() {}","component App() {}"],
    answer: "A",
  },
  {
    text: "React JSX'da class o‘rniga nima ishlatiladi?",
    options: ["styleClass","className","classname","cssClass"],
    answer: "B",
  },
  {
    text: "Quyidagi kodning vazifasi nima?\napp.render(<App />)",
    options: ["State yaratadi","Input yaratadi","App componentini ekranga chiqaradi","CSS fayl yaratadi"],
    answer: "C",
  },
  {
    text: "React'da state o‘zgarganda odatda nima sodir bo‘ladi?",
    options: ["HTML fayl o‘chadi","Component qayta render qilinadi","CSS o‘chadi","Browser yopiladi"],
    answer: "B",
  },
  {
    text: "HTML nimani yaratish uchun ishlatiladi?",
    options: ["Veb-sahifaning tuzilmasini","Operatsion tizimni","Ma'lumotlar bazasini","Faqat animatsiyani"],
    answer: "A",
  },
  {
    text: "Eng katta sarlavha qaysi teg bilan yoziladi?",
    options: ["<title>","<h1>","<h6>","<head>"],
    answer: "B",
  },
  {
    text: "Rasm joylashtirish uchun qaysi teg ishlatiladi?",
    options: ["<img>","<photo>","<picture-img>","<image>"],
    answer: "A",
  },
  {
    text: "Havola yaratish uchun qaysi teg ishlatiladi?",
    options: ["<url>","<a>","<href>","<link>"],
    answer: "B",
  },
  {
    text: "Quyidagi teg nima yaratadi?\n<input type=\"text\">",
    options: ["Jadval","Video","Rasm","Matn kiritish maydoni"],
    answer: "D",
  },
  {
    text: "<textarea> nima uchun ishlatiladi?",
    options: ["Sarlavha yozish uchun","Tugma yaratish uchun","Ko‘p qatorli matn kiritish uchun","Rasm chiqarish uchun"],
    answer: "C",
  },
  {
    text: "<form> ning asosiy vazifasi nima?",
    options: ["Foydalanuvchi ma'lumotlarini kiritish/yuborish qismini tashkil qilish","JavaScript ishga tushirish","Rasm chiqarish","CSS ulash"],
    answer: "A",
  },
  {
    text: "HTML'da class atributi nima uchun ishlatiladi?",
    options: ["Sahifani yopish uchun","Elementni CSS orqali tanlash/guruhlash uchun","JavaScriptni o‘chirish uchun","Faqat rasm qo‘yish uchun"],
    answer: "B",
  },
  {
    text: "CSS nima uchun ishlatiladi?",
    options: ["Veb-sahifaga dizayn berish uchun","Fayl yuklash uchun","Server yaratish uchun","Ma'lumotlar bazasi yaratish uchun"],
    answer: "A",
  },
  {
    text: "CSS'da class selector qanday yoziladi?",
    options: ["box#","@box","#box",".box"],
    answer: "D",
  },
  {
    text: "display: flex nima uchun ishlatiladi?",
    options: ["Matnni tarjima qilish uchun","Rasmni yuklash uchun","Elementlarni moslashuvchan joylashtirish uchun","Elementni o‘chirish uchun"],
    answer: "C",
  },
  {
    text: "padding nimani bildiradi?",
    options: ["Elementning tashqi soyasi","Elementning rangi","Element tashqarisidagi masofa","Element ichidagi bo‘sh joy"],
    answer: "D",
  },
  {
    text: "Quyidagi CSS nima qiladi?\nbutton:hover { background-color: black; }",
    options: ["Buttonni kattalashtiradi","Sichqoncha button ustiga kelganda fonini qora qiladi","Buttonni o‘chiradi","Buttonni doim qora qiladi"],
    answer: "B",
  },
  {
    text: "JavaScript'da o‘zgaruvchi e'lon qilishning zamonaviy usullaridan biri qaysi?",
    options: ["create","variable","make","let"],
    answer: "D",
  },
  {
    text: "Quyidagi kod nima qiladi?\nconsole.log(\"Hello\");",
    options: ["CSS'ni ishga tushiradi","HTML yaratadi","Konsolga \"Hello\" chiqaradi","Brauzer oynasini yopadi"],
    answer: "C",
  },
]
