# NEXUS - MERN Stack E-Commerce Platform

## Project Overview
NEXUS is a modern, portfolio-ready full-stack e-commerce application built to demonstrate professional software engineering skills. It features a complete shopping lifecycle, including browsing, cart management, secure checkout, and an admin dashboard.

---

## 1. Technology Stack

### Backend (Node.js & Express)
- **Node.js**: Server runtime
- **Express.js**: Web framework for building RESTful APIs
- **MongoDB Atlas**: NoSQL cloud database
- **Mongoose**: Object Data Modeling (ODM) library
- **JSON Web Tokens (JWT)**: Secure user authentication
- **Bcrypt.js**: Password hashing for security
- **Stripe**: Payment gateway integration

### Frontend (React & Vite)
- **React 18**: UI Library
- **Vite**: Ultra-fast frontend build tool
- **React Router DOM**: Client-side routing for Single Page Application (SPA) functionality
- **Context API**: Global state management for authentication and shopping cart
- **Tailwind CSS**: Utility-first CSS framework for rapid UI styling
- **Axios**: HTTP client for API requests

---

## 2. Core Features

### Customer-Facing Features
- **User Authentication**: Secure Login/Register with JWT, password hashing, and token persistence in localStorage.
- **Dynamic Product Catalog**: Browse products, view detailed descriptions, images, and track live inventory stock.
- **Shopping Cart**: Add/remove products, adjust quantities, calculate subtotal, taxes, and shipping dynamically.
- **Checkout Process**: Multi-step checkout including shipping address capture and secure Stripe credit card processing.
- **Order History**: Authenticated users can view their past orders, total amounts, and delivery statuses.
- **Responsive UI**: "Glassmorphism" aesthetic with fully responsive designs for mobile, tablet, and desktop viewing.

### Admin Features
- **Role-Based Access Control**: Protected routes ensuring only users with the `admin` role can access management tools.
- **Admin Dashboard**: View all system orders globally.
- **Order Management**: Update fulfillment status (Processing ➔ Shipped ➔ Delivered) for user orders.

---

## 3. Database Architecture (MongoDB Schemas)

The database consists of three primary collections:

### User Model
Tracks customer and admin accounts.
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: "user", "admin")

### Product Model
Tracks store inventory and categorization.
- `name`, `description`, `brand` (String)
- `price`, `originalPrice` (Number)
- `category` (Enum: electronics, fashion, accessories, home)
- `images` (Array of Strings/URLs)
- `stock` (Number)
- `rating`, `numReviews` (Number)

### Order Model
Tracks completed purchases and payment status.
- `user` (ObjectId referencing User)
- `items` (Array of objects recording price, quantity, and product ID at the time of purchase)
- `shippingAddress` (Object containing street, city, postal code, etc.)
- `paymentMethod`, `paymentStatus` (Strings)
- `totalAmount` (Number)
- `orderStatus` (Enum: processing, shipped, delivered)

---

## 4. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /register`: Create a new user and return a JWT.
- `POST /login`: Authenticate existing user and return a JWT.
- `GET /profile`: Get current user profile (Protected).

### Products (`/api/products`)
- `GET /`: Retrieve all products (Supports filtering/sorting).
- `GET /featured`: Retrieve top featured products for homepage.
- `GET /:id`: Retrieve a single product by ID.
- `POST /`: Create new product (Admin Only).
- `PUT /:id`: Update existing product (Admin Only).
- `DELETE /:id`: Delete product (Admin Only).

### Orders (`/api/orders`)
- `POST /`: Create a new order after successful Stripe payment.
- `GET /my-orders`: Retrieve logged-in user's order history.
- `GET /`: Retrieve all system orders (Admin Only).
- `PATCH /:id/status`: Update shipping status of an order (Admin Only).

### Payments (`/api/payment`)
- `POST /create-intent`: Validates cart prices server-side and requests a Stripe `client_secret` to initialize secure checkout.

---

## 5. Development Setup & Commands

### Backend Initialization
1. Navigate to the `server` directory.
2. Ensure you have your `MONGO_URI` (from MongoDB Atlas) and `STRIPE_SECRET_KEY` correctly set in the `.env` file.
3. Run `npm install` to install Node dependencies.
4. Run `node seed.js` to populate the database with mock products and default Admin accounts.
5. Run `npm run dev` to start the Express server using Nodemon on port 5000.

### Frontend Initialization
1. Navigate to the `client` directory.
2. Run `npm install` to install React and Tailwind dependencies.
3. Run `npm run dev` to start the Vite development server on port 5173.
