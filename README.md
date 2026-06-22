# NEXUS – Premium E-Commerce Platform (MERN Stack)

A modern, full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). Features a beautiful responsive UI built with Tailwind CSS, secure JWT authentication, and Stripe payment integration.

## Features

- **Storefront**: Browse products, view details, search, and filter by categories.
- **Cart & Checkout**: Manage cart items, automatically calculate totals, and process payments via Stripe.
- **User Accounts**: Secure registration and login using JWT and bcrypt. View personal order history.
- **Admin Dashboard**: Dedicated admin area to view all orders and update fulfillment statuses.
- **Responsive Design**: Premium aesthetics inspired by glassmorphism, fully functional on mobile and desktop.
- **Security**: Password hashing, protected API routes, role-based access control.

## Tech Stack

- **Frontend**: React (Vite), React Router, Context API for state management, Tailwind CSS, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas, Mongoose.
- **Payments**: Stripe API.
- **Authentication**: JSON Web Tokens (JWT).

## Installation

### Prerequisites
- Node.js installed
- MongoDB Atlas account/cluster
- Stripe account (for test API keys)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mern-ecommerce
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory using the provided `.env.example` as a template:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

Seed the database with sample products and default users (Admin + Test User):
```bash
node seed.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend

Open a new terminal.

```bash
cd client
npm install
```

Start the React development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Default Demo Accounts

After running the seed script, you can log in with:
- **Admin User**: `admin@nexus.com` / `admin123`
- **Standard User**: `user@example.com` / `user123`

## Screenshots

*(Add screenshots of your Home, Products, Cart, and Dashboard pages here)*

## Architecture

This project follows a standard MVC-inspired architecture on the backend, and feature-based components on the frontend. The data flows from the React Context API to the Axios service, hitting the Express guarded routes, which query the MongoDB cluster via Mongoose models.

## License
MIT
