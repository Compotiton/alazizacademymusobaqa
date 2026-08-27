# Railway backend + Netlify frontend

Loyiha ikkita alohida xizmat sifatida ishlaydi:

- `backend/` — Railway
- `frontend/` — Netlify

## 1. GitHub'ga joylash

ZIP ichidagi `Dubai-NodeJS` papkasini GitHub repository'ga yuklang. `node_modules`, `.env` va lokal `database.json` GitHub'ga yuklanmaydi.

## 2. Backendni Railway'ga joylash

1. Railway'da **New Project → Deploy from GitHub repo** ni tanlang.
2. Repository'ni tanlang. Root Directory'ni bo‘sh qoldiring.
3. Loyiha ichidagi `railway.json` va `nixpacks.toml` build/start komandalarini avtomatik beradi.
4. **Variables** bo‘limiga quyidagilarni kiriting:

```text
NODE_ENV=production
JWT_SECRET=kamida-32-belgidan-iborat-maxfiy-kalit
ADMIN_LOGIN=ulugbek
ADMIN_PASSWORD=ozingizning-kuchli-parolingiz
CORS_ALLOWED_ORIGINS=https://SIZNING-SAYTINGIZ.netlify.app
DATA_FILE=/app/data/database.json
```

`PORT` yozmang — Railway uni avtomatik beradi.

5. Ma’lumotlar redeploydan keyin o‘chib ketmasligi uchun Railway'da **Volume** yarating va mount path sifatida `/app/data` yozing.
6. **Settings → Networking → Generate Domain** orqali backend domenini oling.
7. Quyidagi manzilni ochib tekshiring:

```text
https://SIZNING-BACKEND.up.railway.app/api/health/
```

Javobda `status: ok` chiqishi kerak.

## 3. Frontendni Netlify'ga joylash

1. Netlify'da **Add new site → Import an existing project** ni tanlang.
2. Xuddi shu GitHub repository'ni tanlang.
3. Rootdagi `netlify.toml` quyidagilarni avtomatik sozlaydi:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Site configuration → Environment variables** bo‘limiga yozing:

```text
VITE_API_BASE_URL=https://SIZNING-BACKEND.up.railway.app
```

Frontend `/api` qismini avtomatik qo‘shadi. Domen oxiriga `/api` yozsangiz ham ishlaydi.

5. **Deploys → Trigger deploy → Clear cache and deploy site** ni bosing.
6. Netlify domeni chiqqach, uni Railway'dagi `CORS_ALLOWED_ORIGINS` qiymatiga aynan yozib, backendni qayta deploy qiling.

## 4. Lokal ishga tushirish

Node.js `20.20.0` yoki undan yangi mos versiya kerak.

```powershell
cd Dubai-NodeJS
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API: `http://localhost:8000/api/health/`

Eski yoki buzilgan `node_modules` papkasi mavjud bo‘lsa, uni o‘chirib, `npm install` ni qayta bajaring. Tayyor ZIP ichiga `node_modules` qo‘shilmagan.

## Muhim

- Maxfiy parol va JWT kalitini kod yoki GitHub'ga yozmang; faqat Railway Variables'da saqlang.
- Railway Volume bo‘lmasa, o‘quvchilar, kodlar va natijalar redeployda yo‘qolishi mumkin.
- Netlify'da `VITE_API_BASE_URL` o‘zgartirilgandan keyin frontendni qayta deploy qilish shart.
