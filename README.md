# 🏠 Nestify - Property Rental & Booking Platform

A full-stack web application with user authentication, property listings, reviews, and booking system (coming soon).



## ✨ Key Features Implemented

- **Secure Authentication** - Passport.js with bcrypt + session management
- **Listings Management** - Full CRUD operations with authorization
- **Review System** - 5-star ratings with ownership-based controls
- **File Uploads** - Cloudinary integration with validation
- **Error Handling** - Custom middleware & async error wrapper
- **Responsive Design** - Mobile-first Bootstrap 5 UI

## 🛠️ Tech Stack

**Backend:** Node.js (v18+), Express.js | **Frontend:** EJS, Bootstrap 5, Vanilla JS  
**Database:** MongoDB Atlas, Mongoose ODM | **Auth:** Passport.js, bcrypt  
**File Upload:** Multer, Cloudinary | **Validation:** Joi, express-validator  
**Security:** Helmet.js, CSRF protection, bcrypt hashing

## 📁 Project Structure

```
├── models/          # Mongoose schemas (User, Listing, Review, Booking)
├── routes/          # Express route handlers
├── controllers/     # Business logic & request handling
├── views/           # EJS templates (forms, listings, reviews)
├── public/          # Static assets (CSS, JS, images)
├── middleware.js    # Auth middleware, validation, error handling
├── cloudConfig.js   # Cloudinary file upload config
├── schema.js        # Joi validation schemas
├── app.js           # Express app setup & middleware initialization
└── package.json     # Dependencies
```

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js v18+, npm
- MongoDB Atlas account
- Cloudinary account

### Setup

```bash
git clone https://github.com/jaswanthmajeti/Nestify.git
cd Nestify
npm install
```

### Environment Variables (.env)

```env
PORT=8080
ATLASDB_URL=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SESSION_SECRET=your_strong_secret_key
NODE_ENV=development
```

### Run

```bash
npm start          # Production mode
npm run dev        # Development with nodemon
```

Visit `http://localhost:8080`

## 🏗️ Architecture Highlights

- **MVC Pattern** - Separated models, controllers, routes for maintainability
- **Custom Middleware** - Auth validation, error handling, request wrapping
- **Async/Await** - Modern async patterns throughout application
- **Error Handling** - Centralized error management with custom middleware
- **Security First** - Password hashing, CSRF tokens, input validation, authorization checks

## 🔐 Security Implementations

✅ **Password Security** - Bcrypt hashing via Passport.js  
✅ **Access Control** - Owner verification & role-based routes  
✅ **Input Validation** - Joi schemas on server-side  
✅ **CSRF Protection** - CSRF tokens on all state-changing requests  
✅ **File Upload Safety** - Format & size validation + secure storage  
✅ **Session Security** - httpOnly cookies & MongoDB session store  
✅ **Security Headers** - Helmet.js for HTTP security

## 📡 API Endpoints

| Method | Endpoint                          | Auth     | Purpose            |
| ------ | --------------------------------- | -------- | ------------------ |
| GET    | `/listings`                       | -        | View all listings  |
| POST   | `/listings`                       | ✅       | Create new listing |
| PUT    | `/listings/:id`                   | ✅ Owner | Update listing     |
| DELETE | `/listings/:id`                   | ✅ Owner | Delete listing     |
| POST   | `/listings/:id/reviews`           | ✅       | Add review         |
| DELETE | `/listings/:id/reviews/:reviewId` | ✅ Owner | Delete review      |
| POST   | `/signup`                         | -        | Register user      |
| POST   | `/login`                          | -        | Authenticate       |
| GET    | `/logout`                         | ✅       | End session        |

## 📊 Database Design

**User:** `{ username, email, password(hashed) }`  
**Listing:** `{ title, description, price, location, country, image, owner(ref), reviews(array), createdAt }`  
**Review:** `{ comment, rating(1-5), author(ref), listing(ref), createdAt }`  
**Booking:** `{ listing(ref), guest(ref), checkIn, checkOut, totalPrice, status, createdAt }` (coming soon)



## 📈 Future Roadmap

- [ ] Booking System - Date selection, availability calendar
- [ ] Payment Gateway - Stripe integration
- [ ] Advanced Search - Filters, sorting, pagination
- [ ] User Ratings - Host profiles, review history
- [ ] Email Notifications - Booking confirmations
- [ ] Unit Tests - Jest test suite
- [ ] Admin Dashboard - User & listing management



