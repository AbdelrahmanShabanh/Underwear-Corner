# Underwear Corner Backend & Admin Dashboard Documentation

This document provides a comprehensive overview of the backend architecture, database schema, API routes, and the Admin Dashboard for the Underwear Corner project. It is intended to be shared with developers or AI chatbots to quickly understand how the backend and administration panel work.

---

## 🏗️ 1. Project Architecture & Stack

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing
- **Frontend Stack:** React, React Router, Vite

---

## 🗄️ 2. Database Models (Mongoose Schemas)

The database consists of three primary collections:

### A. User Model
Handles authentication and authorization.
- `name`: String (Full name of the user)
- `email`: String (Unique, lowercase, for login)
- `passwordHash`: String (Bcrypt hashed password)
- `role`: String (Enum: `["user", "admin"]`, default: `"user"`)
- `createdAt`: Date

### B. Product Model
Stores all inventory items.
- `name`: Object (English and Arabic names)
- `description`: Object (English and Arabic descriptions)
- `price`: Number
- `category`: String (Enum: `["men", "women", "kids"]`)
- `image`: String (Base64 or URL)
- `stock`: Number
- `hasSizeNumbers`: Boolean
- `sizes`: Array (Objects containing `name`, `sizeNumber`, and `stock`)
- `isOffer`: Boolean
- `oldPrice`: Number
- `createdAt`: Date

### C. Order Model
Tracks customer purchases and their status.
- `customer`: Object (Contains `fullName`, `email`, `phone`, `governorate`, `address`)
- `items`: Array (Products ordered, including `productId`, `name`, `size`, `quantity`, `price`, `image`)
- `total`: Number
- `paymentMethod`: String (Enum: `["cash", "instapay"]`)
- `status`: String (Enum: `["pending", "confirmed", "delivered", "cancelled", "draft"]`)
- `userId`: ObjectId (Reference to `User`, optional)
- `createdAt`: Date

---

## 🔗 3. API Routes Overview

The Express backend is defined in `api/index.js` and splits features into dedicated routes:

- **Auth Routes (`/api/auth`)**: Contains endpoints for login, signup, context fetching (`/me`).
- **Products Routes (`/api/products`)**: CRUD operations for products. Uses `requireAdmin` middleware for POST, PUT, DELETE operations.
- **Orders Routes (`/api/orders`)**: Endpoints to create orders (accessible to users) and manage orders (admin can update status, fetch all).
- **Users Routes (`/api/users`)**: Endpoints for admins to fetch users, update roles, or delete users.
- **Stats Routes (`/api/stats`)**: An admin-only endpoint returning aggregated statistics (revenue, order counts, weekly/monthly breakdowns).

---

## 💻 4. Admin Dashboard Overview (Frontend)

The Admin Dashboard is built with React and serves as the primary interface for managing the store. It is protected and requires an authenticated user with an `"admin"` role.

The dashboard consists of a localized sidebar and four main pages (tabs):

### 1. Dashboard Page (Stats)
**Component:** `AdminStats.jsx`
- **Purpose:** Gives the admin a bird's-eye view of store performance.
- **Features:** 
  - Retrieves data from the `/api/stats` endpoint.
  - Displays Total Orders, Total Revenue, and breakdowns by Week, Month, and Year.
  - Shows a pie chart/breakdown of order statuses (Pending, Confirmed, Delivered, Cancelled).
  - Lists the 5 most recent orders for quick access.

### 2. Products Page
**Component:** `AdminProducts.jsx`
- **Purpose:** Full CRUD (Create, Read, Update, Delete) management for store inventory.
- **Features:**
  - Displays a data table of all products with images, prices, categories, and stock limits.
  - Includes an "Add Product" form/modal that supports bilingual inputs (English & Arabic).
  - Handles size variations and stock management per size.
  - Allows marking items as "Offers" and setting old/new prices.

### 3. Orders Page
**Component:** `AdminOrders.jsx`
- **Purpose:** Order management and fulfillment tracking.
- **Features:**
  - Lists all orders sorted by date.
  - Allows filtering by order status (`pending`, `confirmed`, `delivered`, `cancelled`).
  - View detailed order information (customer details, items ordered, total price, payment method).
  - Update order statuses (e.g., changing from `pending` to `confirmed`).
  - Contains print/PDF generation functionality for invoices.

### 4. Users Page
**Component:** `AdminUsers.jsx`
- **Purpose:** Customer and Staff management.
- **Features:**
  - Lists all registered users.
  - Displays user email, name, role, and joined date.
  - Allows the Admin to promote a standard `user` to an `admin`.
  - Delete/ban users if necessary.

---

## 🔐 5. Security & Authorization

- **JWT Authentication:** Upon login, an `accessToken` is issued. It is passed via the `Authorization: Bearer <token>` header in subsequent requests.
- **Admin Middleware:** Critical routes (e.g., updating products, fetching all users, viewing stats) are protected by a `requireAdmin` middleware in the Express app, which verifies the JWT and ensures `user.role === 'admin'`.
- **Frontend Route Protection:** The `AdminDashboard.jsx` checks the user context (`useAuth`) and automatically redirects to the login screen if the user is not an Admin.

---

*This document can be parsed by any developer or AI assistant to immediately understand the Mongoose collections, the Express REST API endpoints, and the React UI components responsible for the Admin Dashboard in the Underwear Corner project.*
