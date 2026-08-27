export const itPythonQuestions = [
  {
    text: "Ekranga ma’lumot chiqarish uchun qaysi funksiya ishlatiladi?",
    options: ["input()", "type()", "print()", "str()"],
    answer: "C",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nx = 8\ny = 3\nprint(x + y)",
    options: ["11", "83", "24", "5"],
    answer: "A",
  },
  {
    text: "Foydalanuvchidan ma’lumot olish uchun qaysi funksiya ishlatiladi?",
    options: ["print()", "range()", "type()", "input()"],
    answer: "D",
  },
  {
    text: "Qaysi biri to‘g‘ri o‘zgaruvchi nomi?",
    options: ["2son", "son_1", "son-1", "son 1"],
    answer: "B",
  },
  {
    text: "input() funksiyasi ma’lumotni qaysi turda qaytaradi?",
    options: ["float", "int", "str", "bool"],
    answer: "C",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nx = \"5\"\ny = \"4\"\nprint(x + y)",
    options: ["9", "20", "1", "54"],
    answer: "D",
  },
  {
    text: "Matnni butun songa aylantirish uchun nima ishlatiladi?",
    options: ["int()", "str()", "float()", "list()"],
    answer: "A",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nprint(17 // 5)",
    options: ["3.4", "3", "2", "4"],
    answer: "B",
  },
  {
    text: "Bo‘lishdan qolgan qoldiqni qaysi operator qaytaradi?",
    options: ["//", "**", "/", "%"],
    answer: "D",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nprint(2 ** 4)",
    options: ["8", "6", "16", "24"],
    answer: "C",
  },
  {
    text: "Ikki qiymat tengligini tekshiruvchi operator qaysi?",
    options: ["==", "=", "!=", ">="],
    answer: "A",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nx = 7\nprint(x > 5)",
    options: ["7", "False", "5", "True"],
    answer: "D",
  },
  {
    text: "Shartlardan kamida bittasi rost bo‘lsa, True qaytaradigan operator qaysi?",
    options: ["and", "or", "not", "in"],
    answer: "B",
  },
  {
    text: "Quyidagi kod nima chiqaradi?\n\nx = 10\n\nif x < 5:\n    print(\"A\")\nelse:\n    print(\"B\")",
    options: ["10", "A", "B", "Xatolik"],
    answer: "C",
  },
  {
    text: "Qo‘shimcha shart yozish uchun qaysi kalit so‘z ishlatiladi?",
    options: ["elif", "elseif", "other", "else if"],
    answer: "A",
  },
  {
    text: "Quyidagi kod nima chiqaradi?\n\nx = 6\n\nif x % 2 == 0:\n    print(\"Juft\")\nelse:\n    print(\"Toq\")",
    options: ["Toq", "Juft", "False", "6"],
    answer: "B",
  },
  {
    text: "range(1, 5) qanday sonlarni hosil qiladi?",
    options: ["0, 1, 2, 3", "1, 2, 3, 4, 5", "2, 3, 4, 5", "1, 2, 3, 4"],
    answer: "D",
  },
  {
    text: "Quyidagi sikl necha marta ishlaydi?\n\nfor i in range(4):\n    print(i)",
    options: ["4 marta", "3 marta", "5 marta", "1 marta"],
    answer: "A",
  },
  {
    text: "Quyidagi kodning oxirgi chiqargan qiymati qaysi?\n\nfor i in range(1, 6):\n    print(i)",
    options: ["4", "6", "5", "1"],
    answer: "C",
  },
  {
    text: "Siklni darhol to‘xtatish uchun nima ishlatiladi?",
    options: ["stop", "break", "continue", "pass"],
    answer: "B",
  },
  {
    text: "Siklning joriy qadamini tashlab, keyingisiga o‘tish uchun nima ishlatiladi?",
    options: ["break", "pass", "stop", "continue"],
    answer: "D",
  },
  {
    text: "Quyidagi ro‘yxatning uzunligi nechaga teng?\n\nsonlar = [4, 7, 2, 9]",
    options: ["3", "5", "4", "9"],
    answer: "C",
  },
  {
    text: "Ro‘yxatning birinchi elementi qaysi indeksda joylashadi?",
    options: ["0", "1", "-1", "2"],
    answer: "A",
  },
  {
    text: "Quyidagi kod nima chiqaradi?\n\nranglar = [\"oq\", \"qora\", \"ko‘k\"]\nprint(ranglar[1])",
    options: ["oq", "qora", "ko‘k", "1"],
    answer: "B",
  },
  {
    text: "Ro‘yxat oxiriga yangi element qo‘shish uchun qaysi metod ishlatiladi?",
    options: ["add()", "push()", "extend_one()", "append()"],
    answer: "D",
  },
  {
    text: "Kod bajarilgach, sonlar qanday bo‘ladi?\n\nsonlar = [1, 2]\nsonlar.append(3)",
    options: ["[1, 3]", "[3, 1, 2]", "[1, 2, 3]", "[1, 2]"],
    answer: "C",
  },
  {
    text: "Matndagi belgilar sonini aniqlash uchun nima ishlatiladi?",
    options: ["size()", "len()", "count()", "length()"],
    answer: "B",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\nmatn = \"Python\"\nprint(matn[0])",
    options: ["P", "y", "n", "Python"],
    answer: "A",
  },
  {
    text: "Python’da funksiya yaratish uchun qaysi kalit so‘z ishlatiladi?",
    options: ["function", "func", "def", "create"],
    answer: "C",
  },
  {
    text: "Quyidagi kod natijasi qanday?\n\ndef hisobla(a, b):\n    return a * b\n\nprint(hisobla(3, 4))",
    options: ["7", "34", "1", "12"],
    answer: "D",
  },
]
