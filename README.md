# RANGMAHAL - Eastern Pakistani Luxury Fashion

> "Where Tradition Meets Elegance"

A modern, high-performance, and culturally rich e-commerce web application for **RANGMAHAL**, a luxury Pakistani women’s Eastern clothing brand. The platform features an artisanal customer storefront, dynamic catalog filtering, shopping cart, Cash on Delivery (COD) checkout, customer feedback system, and a comprehensive Admin Management Dashboard.

---

## ✨ Features

### 🛍️ Customer Storefront
* **Eastern Fashion Collections**: Shalwar Qameez, 3-Piece & 2-Piece Suits, Luxury Lawn, Chiffon Formals, Pure Silk, Handwoven Khaddar, and Micro-Velvet.
* **Culturally Grounded Aesthetic**: Deep Maroon, Antique Gold, Emerald Green, Royal Blue, and Warm Ivory with bespoke typography (`Cinzel` & `Playfair Display`).
* **Real-Time Search & Multi-Filters**: Filter by Category, Fabric, Occasion (*Eid, Wedding, Festive, Casual, Formal*), Pakistani Fit Size (*XS, S, M, L, XL*), and Color Shade.
* **Product Detail Pages (PDP)**: High-resolution image galleries, Eastern fabric specifications, size selectors, quantity steppers, and verified customer reviews.
* **Shopping Bag Drawer**: Quantity adjustments, coupon promo codes (`RANG10`, `EID20`), and free delivery threshold indicator (> PKR 5,000).
* **Pakistani Checkout System**: Address collection across 250+ Pakistani cities (*Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan, Quetta, etc.*), supporting **Cash on Delivery (COD)**, Direct Bank Transfer, and Card payments.
* **Customer Feedback & Reviews**: 1–5 star rating reviews with instant confirmation.
* **Atelier Concierge**: Gulberg III, Lahore flagship address, helpline phone, email, and direct WhatsApp concierge integration.

### 🛡️ Admin Management Dashboard
Accessible at `/` via the Admin icon using credentials:
* **Email**: `admin@rangmahal.pk`
* **Password**: `rangmahal2026`

* **KPI Overview**: Real-time stats on Total Revenue in PKR, Total Orders, Active Catalog Items, and Customer Satisfaction.
* **Product CRUD**: Add new garments with full Eastern attributes (*Fabric, Dress Type, Work, Occasion, Color, Sizes, Stock, Price*), edit information, or delete discontinued designs with a confirmation modal.
* **Order Pipeline Management**: Real-time tracking and status updates (*Pending → Confirmed → Processing → Shipped via TCS/Leopard → Delivered → Cancelled*).
* **Customer Records**: Directory of registered shoppers with contact details, order count, and lifetime PKR spend.
* **Feedback Moderation**: View all client submissions and remove unwanted entries.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
* **Backend**: Express.js running with Vite middlewares (`server.ts`)
* **Database**: Persistent file-backed JSON database (`data/database.json`) with optimistic client-side synchronization (`localStorage`)
* **Tooling**: Node.js, `tsx`, Vite 8

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/azharabeera8-cpu/personal-repository786.git
cd personal-repository786
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Admin Credentials
* **Username / Email**: `admin@rangmahal.pk`
* **Password**: `rangmahal2026`

---

## 📄 License
© 2026 RANGMAHAL. All Rights Reserved.
