# ShoeStore - E-Commerce Web Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce web application for an online shoe store.

## 📋 Features

### User Features
- **User Authentication** - Register, Login with JWT tokens
- **Product Browsing** - Search, filter by category/brand/gender, sort, pagination
- **Product Details** - Size & color selection, stock availability
- **Shopping Cart** - Add/remove items, update quantities
- **Wishlist** - Save favorite products
- **Checkout** - Shipping address, payment method (COD/Online)
- **Order Tracking** - View order history and status
- **Profile Management** - Update personal info and address

### Admin Features
- **Dashboard** - Stats overview (products, orders, users, revenue)
- **Product Management** - Add, edit, delete products
- **Order Management** - Update order and payment status
- **User Management** - View all registered users

## 🛠 Tech Stack

- **Frontend:** React.js (Vite), React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Styling:** Vanilla CSS (no frameworks)

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Clone/Setup
```bash
cd "AWT ESE Project"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shoestore
JWT_SECRET=shoestore_jwt_secret_key_2024
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Backend Server
```bash
npm run dev
```

### 6. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 7. Open in Browser
Visit: http://localhost:3000

## 👤 Demo Accounts

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@shoestore.com | admin123 |
| User  | user@shoestore.com  | user123  |

## 📁 Project Structure

```
AWT ESE Project/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth & admin middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── css/         # Stylesheets
│   │   ├── pages/       # Page components
│   │   │   └── admin/   # Admin pages
│   │   ├── App.jsx      # Main app with routes
│   │   └── main.jsx     # Entry point
│   └── index.html
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes (frontend + backend)
- Admin-only route middleware
- Input validation

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Product details

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Toggle wishlist

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - My orders
- `GET /api/orders/:id` - Order details

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - All users

---

**AWT ESE Project** | Built with MERN Stack
