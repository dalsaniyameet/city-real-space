# City Real Space — Backend API

## Setup & Run

### 1. Install Dependencies
```
cd backend
npm install
```

### 2. MongoDB Start karo
- MongoDB install hona chahiye
- Ya MongoDB Atlas use karo (free cloud DB)
- `.env` file mein `MONGO_URI` set karo

### 3. .env file update karo
```
MONGO_URI=mongodb://localhost:27017/cityrealspace
JWT_SECRET=cityrealspace_jwt_secret_key_2025
PORT=5000
```

### 4. Sample Data Insert karo (optional)
```
node seed.js
```
Admin login: admin@cityrealspace.com / admin123

### 5. Server Start karo
```
npm run dev     # development (nodemon)
npm start       # production
```

Server: http://localhost:5000

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user (token required) |
| PUT  | /api/auth/profile | Update profile (token required) |
| PUT  | /api/auth/change-password | Change password (token required) |

### Properties
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/properties | Get all (with filters) |
| GET | /api/properties/trending | Featured properties |
| GET | /api/properties/residential | Residential only |
| GET | /api/properties/commercial | Commercial only |
| GET | /api/properties/:id | Single property |
| POST | /api/properties | Add property (admin) |
| PUT | /api/properties/:id | Update (admin) |
| DELETE | /api/properties/:id | Delete (admin) |
| POST | /api/properties/:id/save | Save to favorites |

### Inquiry
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/inquiry | Submit inquiry |
| GET  | /api/inquiry | Get all (admin) |
| PUT  | /api/inquiry/:id/status | Update status (admin) |

### Contact
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/contact | Send message |
| GET  | /api/contact | Get all (admin) |

---

## Filter Examples
```
GET /api/properties?category=residential&city=Ahmedabad&status=for-sale
GET /api/properties?minPrice=5000000&maxPrice=15000000&beds=3
GET /api/properties?search=bopal villa&page=1&limit=6
```
