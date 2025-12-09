# GetKontento SEO Platform - cPanel Deployment Guide

Bu döküman, GetKontento projesini cPanel'de deploy etmek için adım adım rehberdir.

## 📋 Gereksinimler

- cPanel erişimi (getkontento.com)
- Node.js support (cPanel'de Node.js app özelliği)
- MySQL veritabanı
- SSH erişimi (opsiyonel ama önerilen)

---

## 🚀 Deployment Adımları

### 1. GitHub'dan Kod Çekme

#### Yöntem A: cPanel Git Version Control (Önerilen)
1. cPanel → **Git™ Version Control**
2. **Create** butonuna tıklayın
3. Bilgileri girin:
   - **Clone URL:** `https://github.com/seyidturgut/getkontento.com.git`
   - **Repository Path:** `/home/username/repositories/getkontento`
   - **Repository Name:** `getkontento`
4. **Create** ile repository'yi clone edin

#### Yöntem B: SSH ile Manuel Clone
```bash
cd ~/repositories
git clone https://github.com/seyidturgut/getkontento.com.git getkontento
cd getkontento
```

---

### 2. Frontend Deployment

#### A. Production Build Oluştur

**Local bilgisayarınızda:**
```bash
cd /path/to/getkontento-seo-platform
npm run build
```

Bu komut `dist/` klasörü oluşturacak.

#### B. Build Dosyalarını cPanel'e Yükle

1. cPanel → **File Manager**
2. `public_html/` klasörüne gidin
3. `dist/` klasöründeki TÜM dosyaları `public_html/` içine yükleyin
4. `.htaccess` dosyasının da yüklendiğinden emin olun

**Alternatif - FTP ile:**
```bash
# FileZilla veya diğer FTP client ile
# dist/* içeriğini public_html/ içine kopyalayın
```

#### C. Environment Variables Ayarla

`public_html/` içinde `.env` dosyası oluşturun (veya mevcut olanı düzenleyin):
```env
VITE_API_URL=https://getkontento.com/api
```

> ⚠️ **Not:** Vite build sırasında env variable'ları embed eder, bu yüzden build'i local'de yapmadan önce `.env.production` dosyasını kontrol edin.

---

### 3. Backend API Deployment

#### A. Node.js Uygulaması Oluştur

1. cPanel → **Setup Node.js App**
2. **Create Application** butonuna tıklayın
3. Bilgileri girin:
   - **Node.js version:** v18.x veya üzeri
   - **Application mode:** Production
   - **Application root:** `repositories/getkontento/backend`
   - **Application URL:** `getkontento.com/api` veya `api.getkontento.com`
   - **Application startup file:** `server.js`

#### B. Environment Variables Ekle

Node.js App ayarlarında **Environment Variables** bölümünden ekleyin:

```env
DB_HOST=localhost
DB_USER=cpanel_database_username
DB_PASS=cpanel_database_password
DB_NAME=cpanel_database_name
JWT_SECRET=GetKontento_Pr0d_JWT_S3cr3t_2024_V3ry_L0ng_And_S3cur3_K3y!@#$%^&*()
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://getkontento.com
```

> 🔐 **Güvenlik:** JWT_SECRET'ı mutlaka değiştirin!

#### C. Dependencies Yükle

SSH veya cPanel Terminal'den:
```bash
cd ~/repositories/getkontento/backend
npm install --production
```

#### D. Uygulamayı Başlat

cPanel → **Setup Node.js App** → **Actions** → **Restart**

veya SSH'den:
```bash
cd ~/repositories/getkontento/backend
npm start
```

---

### 4. MySQL Veritabanı Kurulumu

#### A. Veritabanı Oluştur

1. cPanel → **MySQL® Databases**
2. **Create New Database**
   - İsim: `getkontento_db` (veya benzeri)
3. **Create New User**
   - Username: `getkontento_dbusr`
   - Password: Güçlü bir şifre seçin
4. **Add User to Database**
   - User'ı database'e ekleyin
   - **ALL PRIVILEGES** verin

#### B. Schema İmport Et

1. cPanel → **phpMyAdmin**
2. `getkontento_db` veritabanını seçin
3. **Import** sekmesine gidin
4. `backend/sql/schema.sql` dosyasını yükleyin
5. **Go** butonuna tıklayın

#### C. Seed Data Ekle (Opsiyonel)

SSH'den:
```bash
cd ~/repositories/getkontento/backend
node sql/seed.js
```

Bu komut şu kullanıcıları oluşturacak:
- **Admin:** `admin@getkontento.com` / `Admin123!`
- **Client Owner:** `admin@sistemglobal.com.tr` / `Client123!`

---

### 5. .htaccess Yapılandırması (API Routing)

Eğer API'yi subdomain yerine `/api` altında serve edecekseniz:

**public_html/.htaccess** dosyasına ekleyin:

```apache
# API Proxy to Node.js
RewriteEngine On

# API isteklerini Node.js'e yönlendir
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:4000/api/$1 [P,L]

# Frontend için (mevcut .htaccess kuralları devam eder)
```

> **Not:** Port numarasını (4000) Node.js App'inizin çalıştığı port ile eşleştirin.

---

### 6. SSL Sertifikası (HTTPS)

1. cPanel → **SSL/TLS Status**
2. `getkontento.com` için **AutoSSL** çalıştırın
3. Veya **Let's Encrypt** kullanın

SSL aktif olduktan sonra `.htaccess`'e HTTP → HTTPS yönlendirmesi ekleyin:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

### 7. Test ve Doğrulama

#### Frontend Test:
- https://getkontento.com → Ana sayfa açılmalı
- Sayfalar arası routing çalışmalı (refresh yapınca 404 vermemeli)

#### Backend Test:
- https://getkontento.com/api/health → JSON response dönmeli

```json
{
  "success": true,
  "message": "GetKontento API is running",
  "database": "connected"
}
```

#### Login Test:
1. https://getkontento.com adresini açın
2. Login sayfasına gidin
3. Test credentials ile giriş yapın:
   - Email: `admin@getkontento.com`
   - Password: `Admin123!`

---

## 🔄 Güncelleme (Update) Prosedürü

### Frontend Güncellemesi:
```bash
# Local'de
git pull origin main
npm run build
# FTP ile dist/* dosyalarını public_html/'e yükle
```

### Backend Güncellemesi:
```bash
# SSH'de
cd ~/repositories/getkontento
git pull origin main
cd backend
npm install --production
# cPanel'den Node.js App'i restart et
```

---

## 🐛 Sorun Giderme

### Backend çalışmıyor:
1. cPanel → Setup Node.js App → Log dosyalarını kontrol edin
2. Environment variables doğru mu?
3. Database bağlantısı test edin:
   ```bash
   cd ~/repositories/getkontento/backend
   node -e "require('./config/db').testConnection()"
   ```

### Frontend 404 veriyor:
- `.htaccess` dosyası `public_html/` içinde olmalı
- Mod_rewrite enabled olmalı

### CORS Hatası:
- Backend `.env` dosyasında `CORS_ORIGIN` doğru domain'e ayarlı mı?
- HTTPS kullanıyorsanız https:// ile başlamalı

---

## 📞 Destek

Sorun yaşarsanız:
1. cPanel error_log dosyalarını kontrol edin
2. Node.js App log dosyalarını inceleyin
3. phpMyAdmin'de database bağlantısını test edin

---

## ✅ Deployment Checklist

- [ ] GitHub'dan kod çekildi
- [ ] Frontend build oluşturuldu (`npm run build`)
- [ ] Frontend dosyları `public_html/` içine yüklendi
- [ ] `.htaccess` dosyası mevcut
- [ ] MySQL veritabanı oluşturuldu
- [ ] Database kullanıcısı oluşturuldu ve yetkilendirildi
- [ ] `schema.sql` import edildi
- [ ] `seed.js` çalıştırıldı (opsiyonel)
- [ ] Node.js App oluşturuldu
- [ ] Backend environment variables ayarlandı
- [ ] Backend dependencies yüklendi (`npm install --production`)
- [ ] Backend başlatıldı
- [ ] SSL sertifikası kuruldu
- [ ] API health endpoint test edildi
- [ ] Frontend login test edildi

---

**🎉 Deployment tamamlandı! GetKontento artık getkontento.com'da yayında!**
