export const itHtmlCssQuestions = [
  {
    text: "HTML'da tashqi CSS faylni ulashning to‘g‘ri usuli qaysi?",
    options: ["<script src=\"style.css\">","<link rel=\"stylesheet\" href=\"style.css\">","<style href=\"style.css\">","<css src=\"style.css\">"],
    answer: "B",
  },
  {
    text: "Quyidagi CSS qaysi elementlarni tanlaydi?\n.menu li { color: red; }",
    options: [".menu ichidagi li elementlarini","Faqat menu nomli tegni","Barcha li elementlarini","Faqat .menu elementini"],
    answer: "A",
  },
  {
    text: "CSS'da class selector qaysi ko‘rinishda yoziladi?",
    options: ["box#","@box","#box",".box"],
    answer: "D",
  },
  {
    text: "Quyidagi HTML kodda alt atributining vazifasi nima?\n<img src=\"shoe.jpg\" alt=\"Nike shoe\">",
    options: ["Rasmga CSS beradi","Rasm manzilini belgilaydi","Rasm yuklanmasa, muqobil matn beradi","Rasm kengligini belgilaydi"],
    answer: "C",
  },
  {
    text: "padding va margin o‘rtasidagi asosiy farq qaysi?",
    options: ["Ikkalasi faqat matn bilan ishlaydi","padding tashqi, margin ichki bo‘shliq","Ikkalasi bir xil","padding ichki, margin tashqi bo‘shliq"],
    answer: "D",
  },
  {
    text: "Quyidagi kodda box-sizing qanday ishlaydi?\n.box { width: 300px; padding: 20px; box-sizing: border-box; }",
    options: ["width ishlamaydi","Element kengligi 340px bo‘ladi","padding va border umumiy width ichida hisoblanadi","padding width hisobiga kirmaydi"],
    answer: "C",
  },
  {
    text: "display: flex berilgan element nima bo‘ladi?",
    options: ["Hidden element","Inline element","Grid container","Flex container"],
    answer: "D",
  },
  {
    text: "Quyidagi kod elementlarni qaysi yo‘nalishda joylashtiradi?\n.container { display: flex; flex-direction: column; }",
    options: ["Yuqoridan pastga","O‘ngdan chapga","Chapdan o‘ngga","Diagonal"],
    answer: "A",
  },
  {
    text: "justify-content: center Flexbox'da nima qiladi?",
    options: ["Elementlar orasiga border qo‘yadi","Elementlarni yashiradi","Elementlarning rangini o‘zgartiradi","Elementlarni asosiy o‘q bo‘yicha markazlashtiradi"],
    answer: "D",
  },
  {
    text: "align-items: center odatda nima qiladi?",
    options: ["Elementlar orasini ochadi","Elementlarni kesishuvchi o‘q bo‘yicha markazlashtiradi","Elementlarni yashiradi","Elementlarni kengaytiradi"],
    answer: "B",
  },
  {
    text: "Quyidagi kod qanday natija beradi?\n.container { display: flex; justify-content: space-between; }",
    options: ["Birinchi va oxirgi element chetlarda, bo‘sh joy esa ular orasida taqsimlanadi","Elementlar vertikal joylashadi","Elementlar yashiriladi","Barcha elementlar bir joyga yig‘iladi"],
    answer: "A",
  },
  {
    text: "gap: 25px nima uchun ishlatiladi?",
    options: ["Paddingni 25px qiladi","Border qalinligini 25px qiladi","Flex/Grid elementlari orasiga 25px masofa beradi","Element balandligini 25px qiladi"],
    answer: "C",
  },
  {
    text: "Quyidagi selector qaysi p elementni tanlaydi?\n.box > p { color: blue; }",
    options: ["Faqat ID'si p bo‘lgan elementni","Barcha sahifadagi p'larni",".box ichidagi barcha avlod p'larni","Faqat .boxning bevosita farzandi bo‘lgan p'ni"],
    answer: "D",
  },
  {
    text: ":hover pseudo-class qachon faollashadi?",
    options: ["Sichqoncha element ustiga olib borilganda","Kompyuter qayta yoqilganda","Element o‘chirilganda","Sahifa ochilganda"],
    answer: "A",
  },
  {
    text: "Quyidagi CSS nima qiladi?\nbutton:hover { background-color: black; }",
    options: ["Tugma o‘lchamini o‘zgartiradi","Sichqoncha tugma ustida turganda fonini qora qiladi","Tugmani yashiradi","Tugmani doim qora qiladi"],
    answer: "B",
  },
  {
    text: "font-size xususiyati nima uchun ishlatiladi?",
    options: ["Elementni yashirish uchun","Element kengligini o‘zgartirish uchun","Matn o‘lchamini o‘zgartirish uchun","Matn rangini o‘zgartirish uchun"],
    answer: "C",
  },
  {
    text: "font-weight: bold; nima qiladi?",
    options: ["Matnni qalinlashtiradi","Matn rangini o‘zgartiradi","Matnni markazlashtiradi","Matnni kursiv qiladi"],
    answer: "A",
  },
  {
    text: "text-align: center; nima qiladi?",
    options: ["Matnni qalinlashtiradi","Matnni gorizontal markazga tekislaydi","Elementni yashiradi","Elementni vertikal markazlashtiradi"],
    answer: "B",
  },
  {
    text: "background-image nima uchun ishlatiladi?\n.hero { background-image: url(\"./images/bg.jpg\"); }",
    options: ["Rasmni matnga aylantirish uchun","Rasmni o‘chirish uchun","HTML ichiga yangi <img> qo‘shish uchun","Elementga fon rasmi berish uchun"],
    answer: "D",
  },
  {
    text: "background-size: cover; qanday vazifa bajaradi?",
    options: ["Fon rasmini faqat asl o‘lchamida qoldiradi","Fon rasmini konteynerni qoplashga moslashtiradi","Fon rasmini kichraytirib qo‘yadi","Fon rasmini yashiradi"],
    answer: "B",
  },
  {
    text: "border-radius: 50%; ko‘pincha nima hosil qiladi?",
    options: ["Doira shakli, agar element kvadrat bo‘lsa","Elementni yashiruvchi qatlam","Uchburchak","To‘g‘ri chiziq"],
    answer: "A",
  },
  {
    text: "Quyidagi HTML nima yaratadi?\n<a href=\"https://example.com\">Visit</a>",
    options: ["Jadval","Tugma","Rasm","Havola"],
    answer: "D",
  },
  {
    text: "<input type=\"email\"> ning asosiy vazifasi nima?",
    options: ["Ko‘p qatorli matn yozish","Email kiritish uchun maydon yaratish","Video qo‘yish","Rasm yuklash"],
    answer: "B",
  },
  {
    text: "<textarea> nimaga mo‘ljallangan?",
    options: ["Tugma yaratishga","Rasm joylashtirishga","Ko‘p qatorli matn kiritishga","Faqat parol kiritishga"],
    answer: "C",
  },
  {
    text: "placeholder atributi nima qiladi?\n<input placeholder=\"Enter your name\">",
    options: ["Input ichida ko‘rsatma matnini ko‘rsatadi","Inputni o‘chiradi","Inputga doimiy qiymat yozadi","Inputni bloklaydi"],
    answer: "A",
  },
  {
    text: "Quyidagi CSS nimani anglatadi?\n* { margin: 0; padding: 0; }",
    options: ["Barcha elementlarni Flexbox qiladi","Barcha elementlarning margin va paddingini 0 qiladi","Barcha elementlarni yashiradi","Faqat bodyga ta'sir qiladi"],
    answer: "B",
  },
  {
    text: "overflow: hidden; qanday ishlaydi?",
    options: ["Rasmni almashtiradi","Elementni markazlashtiradi","Tashqariga chiqib ketgan kontentni yashiradi","Elementni kattalashtiradi"],
    answer: "C",
  },
  {
    text: "Quyidagi CSS nima qiladi?\nimg { width: 100%; height: 100%; object-fit: cover; }",
    options: ["Rasmni konteyner o‘lchamiga moslab, uni qoplashga harakat qiladi","Rasmni faqat kengaytiradi","Rasmni original o‘lchamiga qaytaradi","Rasmni yashiradi"],
    answer: "A",
  },
  {
    text: "transform: translateY(-20px); nima qiladi?",
    options: ["Elementni 20px kattalashtiradi","Elementni 20px pastga siljitadi","Elementni vertikal bo‘yicha 20px yuqoriga siljitadi","Elementni 20px o‘ngga siljitadi"],
    answer: "C",
  },
  {
    text: "Quyidagi CSS/HTML'da matn qaysi rangda bo‘ladi?\np { color: blue; } .title { color: green; } #main-title { color: red; }\n<p class=\"title\" id=\"main-title\">Hello</p>",
    options: ["Qora","Qizil","Yashil","Ko‘k"],
    answer: "B",
  },
]
