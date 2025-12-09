# GetKontento SEO Platform - Backend API

Node.js + Express + MySQL tabanlı RESTful API.

## Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Veritabanını oluştur
MySQL'de `sql/schema.sql` dosyasını çalıştır:
```bash
mysql -u getkontento_dbusr -p getkontento_db < sql/schema.sql
```

Veya phpMyAdmin'den import et.

### 3. Seed data ekle (opsiyonel)
Admin ve test kullanıcıları oluşturmak için:
```bash
node sql/seed.js
```

### 4. Sunucuyu başlat
```bash
# Development (hot reload)
npm run dev

# Production
npm start
```

## Test Credentials

| Rol | Email | Şifre |
|-----|-------|-------|
| Admin | admin@getkontento.com | Admin123! |
| Client Owner | admin@sistemglobal.com.tr | Client123! |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi
- `POST /api/auth/change-password` - Şifre değiştir

### Clients (Admin only)
- `GET /api/clients` - Tüm client'ları listele
- `POST /api/clients` - Yeni client oluştur
- `GET /api/clients/:id` - Client detayı
- `PUT /api/clients/:id` - Client güncelle
- `DELETE /api/clients/:id` - Client sil
- `GET /api/clients/:id/users` - Client kullanıcıları
- `POST /api/clients/:id/users` - Client için kullanıcı oluştur

### Contents
- `GET /api/contents` - İçerikleri listele
- `GET /api/contents/stats` - İçerik istatistikleri
- `POST /api/contents` - Yeni içerik
- `GET /api/contents/:id` - İçerik detayı
- `PUT /api/contents/:id` - İçerik güncelle
- `DELETE /api/contents/:id` - İçerik sil
- `POST /api/contents/sync` - WordPress'ten senkronize et

### SEO
- `POST /api/seo/suggest` - SEO önerisi oluştur
- `GET /api/seo/suggestions/:contentId` - İçerik önerileri
- `POST /api/seo/apply/:suggestionId` - Öneriyi uygula
- `DELETE /api/seo/suggestions/:id` - Öneri sil

### Tasks
- `GET /api/tasks` - Görevleri listele
- `GET /api/tasks/stats` - Görev istatistikleri
- `POST /api/tasks` - Yeni görev
- `GET /api/tasks/:id` - Görev detayı
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

## Environment Variables

```env
DB_HOST=localhost
DB_USER=getkontento_dbusr
DB_PASS=your_password
DB_NAME=getkontento_db
JWT_SECRET=your_jwt_secret
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

## Rol Yapısı

| Rol | Açıklama |
|-----|----------|
| `admin` | Tüm sistemin yöneticisi, tüm client'lara erişebilir |
| `client_owner` | Client sahibi, kendi client verilerini yönetebilir |
| `client_editor` | Client editörü, içerik düzenleyebilir |
| `client_viewer` | Client göstericisi, sadece görüntüleyebilir |
