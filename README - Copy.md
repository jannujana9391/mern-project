# NexStore - Multi-Vendor E-Commerce Web Application (MERN)

A modern, enterprise-grade Multi-Vendor E-Commerce Web Application built with MongoDB, Express.js, React.js, and Node.js.

---

## 🏗️ Architecture & Project Structure

```text
mern project/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, static graphics
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global React state (Auth, Cart, Wishlist)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layouts (Customer, Vendor, Admin)
│   │   ├── pages/              # Role-specific application views
│   │   ├── services/           # Axios API service callers
│   │   ├── App.jsx             # Main application component & routes
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # React root DOM entrypoint
│   ├── index.html              # HTML5 template
│   ├── package.json            # Client dependencies & scripts
│   ├── postcss.config.js       # PostCSS configuration for Tailwind
│   ├── tailwind.config.js      # Custom theme (Dark Navy, Purple, Cyan)
│   └── vite.config.js          # Vite config & API reverse proxy
│
├── server/                     # Backend (Node.js + Express.js REST API)
│   ├── config/                 # DB & payment configurations
│   ├── controllers/            # Controller business logic
│   ├── middleware/             # Auth JWT, Role validation, Error handlers
│   ├── models/                 # Mongoose schemas & data models
│   ├── routes/                 # Express API endpoints
│   ├── utils/                  # Helper utilities (token, mail, hashing)
│   ├── .env                    # Local environment variables
│   ├── .env.example            # Sample environment variables
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Express application entrypoint
│
├── package.json                # Root orchestration scripts
└── README.md                   # Documentation & Setup guide
```

---

## 🎨 Theme & Color Palette

- **Primary**: `#0F172A` (Dark Navy Blue)
- **Secondary**: `#7C3AED` (Purple)
- **Accent**: `#06B6D4` (Cyan)
- **Backgrounds**: `#FFFFFF` (White) and `#F8FAFC` (Light Gray / Slate)

---

## 🚀 How to Run the Project

### 1. Install Dependencies
In the root directory, or individually in `client` and `server`:
```bash
# In the server folder:
cd server
npm install

# In the client folder:
cd ../client
npm install
```

### 2. Run the Development Servers
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
Backend will start on `http://localhost:5000`. Health check endpoint: `http://localhost:5000/api/health`

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🧭 Development Roadmap (13 Phases)

- [x] **Phase 1**: Project Setup, Folder Architecture & Environment Verification
- [ ] **Phase 2**: Frontend Design, Layouts, Navigation Bar & Homepage
- [ ] **Phase 3**: MongoDB Database Connection & Schema Design
- [ ] **Phase 4**: User Registration, Login & Role-Based JWT Auth
- [ ] **Phase 5**: Customer Dashboard & Profile Management
- [ ] **Phase 6**: Vendor Dashboard, Analytics & Storefront
- [ ] **Phase 7**: Product & Category Management (CRUD & Images)
- [ ] **Phase 8**: Shopping Cart & Wishlist System
- [ ] **Phase 9**: Order Placement & Vendor-Specific Order Splitting
- [ ] **Phase 10**: Admin Dashboard, Revenue Analytics & Vendor Approval
- [ ] **Phase 11**: Payment Gateway Simulation / Razorpay Test Mode
- [ ] **Phase 12**: End-to-End System Testing & Bug Fixing
- [ ] **Phase 13**: Final Deployment Preparation & Production Build

