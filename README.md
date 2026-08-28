# Al-Aziz test platformasi — Node.js versiya

Frontend Vue 3 + Vite, backend Node.js + Express bilan ishlaydi. Eski Django/Python backend to‘liq almashtirilgan.

## Muhim holat

- Eski test savollarining barchasi olib tashlangan.
- `Ingliz tili → Starter → Version 1` — 25 ta savol (variantlari aralashtirilgan).
- `Ingliz tili → Beginner → Version 1` — 25 ta savol (variantlari aralashtirilgan).
- `Ingliz tili → Elementary → Version 1` — 25 ta savol (variantlari aralashtirilgan).
- `Ingliz tili → Pre-Intermediate → Version 1` — 30 ta savol (variantlari aralashtirilgan, javoblari tekshirilgan).
- `Ingliz tili → Intermediate → Version 1` — 25 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Ingliz tili → Upper-Intermediate → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Ingliz tili → Advanced → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Koreys tili → Boshlang‘ich → Version 1` — 25 ta savol.
- `Koreys tili → O‘rta → Version 1` — 25 ta savol.
- `Hamshiralik → Hamshiralik → Version 1` — 30 ta savol.
- `Kampyuter → Word Excel → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Kampyuter → PowerPoint → Version 1` — 30 ta Word, Excel va PowerPoint savoli (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `IT → HTML CSS → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `IT → JavaScript → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `IT → VUE.JS → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `IT → React → Version 1` — 30 ta React, HTML, CSS va JavaScript savoli (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `IT → Python → Version 1` — 30 ta boshlang‘ich Python savoli (to‘g‘ri javoblari tekshirilgan va teng taqsimlangan).
- `Matematika → Boshlang‘ich → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Matematika → C+ → Version 1` — 30 ta chuqurlashtirilgan savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Matematika → B → Version 1` — 30 ta algebra savoli (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Matematika → B+ → Version 1` — 30 ta savol (variantlari aralashtirilgan, to‘g‘ri javoblar teng taqsimlangan va tekshirilgan).
- `Rus tili → A1 → Version 1` — 25 ta savol (variantlari aralashtirilgan, javoblari tekshirilgan).
- `Rus tili → A2 → Version 1` — 25 ta savol (variantlari aralashtirilgan, javoblari tekshirilgan).
- `Rus tili → B1 → Version 1` — 25 ta savol (variantlari aralashtirilgan, javoblari tekshirilgan).
- `Arab tili → Boshlang‘ich → Version 1` — 30 ta savol.
- `Arab tili → A1 → Version 1` — 30 ta savol.
- `Arab tili → A2 → Version 1` — 20 ta savol.
- Barcha testlar bir bosqichda ko‘rsatiladi.
- Barcha fan va darajalarda test vaqti 30 daqiqa.
- O‘quvchi yaratishda o‘quv markaz doim `Al-Aziz`; filial faqat belgilangan 15 ta ro‘yxatdan tanlanadi.
- Asosiy admin qo‘shimcha admin yaratadi. Qo‘shimcha admin o‘quvchi/code yaratadi, test va natijalarni ko‘radi; admin yoki test yarata olmaydi.
- Oddiy testlar bittadan swiper ko‘rinishida chiqadi; raqamli navigator, avtomatik keyingi savol va yashil ishlangan holati mavjud. Fullscreen majburiy emas, o‘quvchi testni tark etib shu code bilan qayta davom ettirishi mumkin.
- Faqat testi mavjud fan va darajalar qoldirilgan.
- Admin panelning `Testlar` bo‘limida yangi fan va yangi daraja/sinf ham qo‘shiladi.
- Railway’da PostgreSQL majburiy emas. `STORAGE_DRIVER=json` va `DATA_FILE=/app/backend/data/database.json` bilan ma’lumotlar backend Volume ichida doimiy saqlanadi; koddagi barcha fan, daraja va testlar yangi bazaga avtomatik qo‘shiladi.

## Windows’da ishga tushirish

Kompyuterda Node.js 20 yoki undan yangi versiya o‘rnatilgan bo‘lishi kerak.

```powershell
cd Dubai-NodeJS
npm install
npm run dev
```

Yoki `start_windows.bat` faylini ikki marta bosing.

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API tekshirish: http://localhost:8000/api/health/

Admin login:

```text
Login: ulugbek
Parol: 123456
```

Productionda maxfiy qiymatlarni `.env` faylga emas, Railway Variables bo‘limiga kiriting. Batafsil yo‘riqnoma: `DEPLOY-RAILWAY-NETLIFY.md`.

## Alohida ishga tushirish

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Railway backend

Railway Variables bo‘limiga quyidagilarni kiriting:

```text
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=uzun-va-maxfiy-kalit
ADMIN_LOGIN=ulugbek
ADMIN_PASSWORD=yangi-kuchli-parol
CORS_ALLOWED_ORIGINS=https://SIZNING-SAYTINGIZ.netlify.app
```

Railway Project Canvas ichidan `Create → Database → Add PostgreSQL` ni tanlang va backend service’ga `DATABASE_URL=${{Postgres.DATABASE_URL}}` reference variable’ni ulang. Backend uchun alohida Volume kerak emas.
`PORT` qiymatini qo‘lda yozmang; Railway uni avtomatik beradi.

## Netlify frontend

Netlify Environment variables bo‘limiga:

```text
VITE_API_BASE_URL=https://SIZNING-RAILWAY-BACKEND.up.railway.app/api
```

Keyin frontendni qayta deploy qiling.

## Testlarni keyin qo‘shish

Admin panelga kiring va `Testlar` bo‘limidan fan, daraja, savol, A/B/C/D variantlari va to‘g‘ri javobni kiriting.
