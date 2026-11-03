# NexStore - Multi-Vendor E-Commerce Web Application (MERN)

A modern, enterprise-grade Multi-Vendor E-Commerce Web Application built with **MongoDB**, **Express.js**, **React.js (Vite)**, and **Node.js**.

---

## 🧭 Development Roadmap (All 13 Phases Completed)

- [x] **Phase 1**: Project Setup, Folder Architecture & Environment Verification
- [x] **Phase 2**: Professional Homepage (Hero slider, category grid, flash deals, testimonials)
- [x] **Phase 3**: MongoDB Database Connection & Schema Design (Users, Vendors, Products, Orders, Categories)
- [x] **Phase 4**: User Registration, Login & Role-Based JWT Authentication (Customer, Vendor, Admin)
- [x] **Phase 5**: Shopping Cart, Checkout, Multi-Vendor Splitting & Customer Dashboard
- [x] **Phase 6**: Vendor Dashboard, Analytics & Incoming Orders Management
- [x] **Phase 7**: Product Management (Mongoose Schema, Vendor Product CRUD, Product Details Page)
- [x] **Phase 8**: Wishlist System & Cart Enhancements (Persistent storage, counter badges, move-to-cart)
- [x] **Phase 9**: Order Management & Live Order Tracking Stepper (Timeline, Invoice generation, Cancellation)
- [x] **Phase 10**: Admin Dashboard & Platform Controls (Platform stats, vendor approval, user blocking, commission settings)
- [x] **Phase 11**: Payment Gateway Integration (Razorpay Test Mode, Simulated Test Cards, Cash on Delivery)
- [x] **Phase 12**: End-to-End API Testing & Production Build Verification
- [x] **Phase 13**: Deployment Readiness, Clean Environment Templates & Documentation

---

## 🏗️ Architecture & Project Structure

```text
mern project/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/            # Global React state (AuthContext, CartContext, WishlistContext)
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Role-specific application views:
│   │   │   ├── Home.jsx             # Homepage with live products & flash deals
│   │   │   ├── Products.jsx         # Catalog with live search, category filter, sorting
│   │   │   ├── ProductDetails.jsx   # Product gallery, stock alerts, vendor info
│   │   │   ├── Cart.jsx             # Cart breakdown, coupon codes, vendor splitting
│   │   │   ├── Wishlist.jsx         # Saved items, move to cart
│   │   │   ├── Checkout.jsx         # Shipping address, Razorpay test mode, COD
│   │   │   ├── OrderDetails.jsx     # Visual 4-step delivery progress tracker, receipt
│   │   │   ├── CustomerDashboard.jsx# Order history & profile
│   │   │   ├── VendorDashboard.jsx  # Vendor store metrics, products CRUD, order status
│   │   │   ├── AdminDashboard.jsx   # Platform stats, vendor approval, user moderation
│   │   │   ├── Login.jsx            # 1-click demo login buttons
│   │   │   └── Register.jsx         # Customer & Vendor registration
│   │   ├── services/           # Axios instance with JWT interceptor
│   │   └── App.jsx             # Route definitions & Global Providers
│   └── package.json
│
├── server/                     # Backend (Node.js + Express.js REST API)
│   ├── config/db.js            # Mongoose MongoDB connection
│   ├── controllers/            # Controller business logic
│   │   ├── authController.js   # JWT Auth & Demo seeder
│   │   ├── productController.js# Product CRUD & public catalog
│   │   ├── categoryController.js# Category management
│   │   ├── orderController.js  # Multi-vendor order splitting & tracking
│   │   ├── vendorController.js # Vendor store profiles & admin approval
│   │   └── adminController.js  # Platform analytics & moderation
│   ├── middleware/             # JWT auth & role authorization
│   ├── models/                 # Mongoose schemas (User, Vendor, Product, Category, Order)
│   ├── routes/                 # Express API endpoints (/api/auth, /api/products, etc.)
│   └── server.js               # Express application entrypoint
│
└── README.md                   # Documentation & Setup guide
```

---

## 🎨 Theme & Color Palette

- **Primary**: `#0F172A` (Dark Navy Blue)
- **Secondary**: `#7C3AED` (Purple)
- **Accent**: `#06B6D4` (Cyan)
- **Backgrounds**: `#FFFFFF` (White) and `#F8FAFC` (Light Gray / Slate)

---

## 🔑 Pre-Configured Demo Accounts

For fast local testing, click the **1-Click Demo Buttons** on the Login page (`/login`) or use these credentials:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Customer** | `customer@demo.com` | `Customer@123` | Browsing, Cart, Wishlist, Checkout, Tracking |
| **Vendor** | `vendor@demo.com` | `Vendor@123` | Store Products CRUD, Order Fulfillment, Earnings |
| **Admin** | `admin@demo.com` | `Admin@123` | Platform Analytics, Vendor Approval, User Moderation |

---

## 🚀 How to Run the Project

### 1. Start MongoDB
Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017` or configure `MONGO_URI` in `server/.env`.

### 2. Start Backend API Server
```bash
cd server
npm run dev
```
- API Server runs on: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

### 3. Start Frontend Client
```bash
cd client
npm run dev
```
- App runs on: `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server & Database connectivity health check |
| `POST` | `/api/auth/register` | Public | Register customer or vendor |
| `POST` | `/api/auth/login` | Public | Sign in & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current user session |
| `GET` | `/api/products` | Public | Query catalog (search, category, sort) |
| `GET` | `/api/products/:id` | Public | Single product details |
| `GET` | `/api/products/vendor/my-products` | Vendor | Logged-in vendor's inventory |
| `POST` | `/api/products` | Vendor/Admin | Create new product listing |
| `PUT` | `/api/products/:id` | Vendor/Admin | Update product listing |
| `DELETE` | `/api/products/:id` | Vendor/Admin | Delete product listing |
| `GET` | `/api/categories` | Public | List all product departments |
| `POST` | `/api/orders` | Customer | Checkout with multi-vendor split |
| `GET` | `/api/orders/my-orders` | Customer | Logged-in customer orders |
| `GET` | `/api/orders/vendor-orders` | Vendor | Logged-in vendor incoming orders |
| `GET` | `/api/orders/:id` | Private | Order tracking details & invoice |
| `PUT` | `/api/orders/:id/status` | Vendor/Admin | Update delivery status |
| `PUT` | `/api/orders/:id/cancel` | Customer/Admin| Cancel order |
| `GET` | `/api/admin/stats` | Admin | Aggregated platform revenue & counts |
| `GET` | `/api/admin/users` | Admin | Platform user registry |
| `PUT` | `/api/admin/users/:id/block` | Admin | Block / unblock users |
| `GET` | `/api/admin/orders` | Admin | Master order ledger |
| `PUT` | `/api/admin/vendors/:id/commission` | Admin | Set vendor commission % |
