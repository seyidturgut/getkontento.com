# GetKontento SEO Platform

**Production URL:** https://getkontento.com

Multi-tenant SEO management platform with React frontend and Node.js backend.

## 🚀 Quick Start

### Development
```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### Production Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete cPanel deployment guide.

## 📁 Project Structure

```
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & scope middleware
│   ├── routes/          # API routes
│   ├── sql/             # Database schema & seed
│   └── server.js        # Main server file
│
├── components/          # React components
├── pages/              # Page components
├── routes/             # Frontend routing
├── store/              # Zustand state management
└── layouts/            # Layout components

```

## 🔧 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Zustand (State)
- React Router v7
- Recharts

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- bcrypt

## 📚 Features

- ✅ Multi-tenant architecture
- ✅ Role-based access (admin, client_owner, client_editor, client_viewer)
- ✅ JWT authentication
- ✅ WordPress content sync
- ✅ AI-powered SEO suggestions
- ✅ Task management
- ✅ Dashboard analytics

## 🔐 Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://getkontento.com/api
```

### Backend (.env.production)
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=getkontento_db
JWT_SECRET=your_jwt_secret
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://getkontento.com
```

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - cPanel deployment instructions
- [Backend README](./backend/README.md) - API documentation
- [Database Schema](./backend/sql/schema.sql) - Database structure

## 🧪 Test Credentials

After running `node sql/seed.js`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@getkontento.com | Admin123! |
| Client Owner | admin@sistemglobal.com.tr | Client123! |

## 📦 Build

### Frontend
```bash
npm run build
# Output: dist/ directory
```

### Backend
```bash
cd backend
npm install --production
npm start
```

## 🔄 API Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info
- `GET /api/clients` - List clients (admin only)
- `GET /api/contents` - List contents
- `POST /api/seo/suggest` - Generate SEO suggestion
- `GET /api/tasks` - List tasks

See [backend/README.md](./backend/README.md) for complete API documentation.

## 📄 License

ISC

## 👨‍💻 Author

GetKontento Team
