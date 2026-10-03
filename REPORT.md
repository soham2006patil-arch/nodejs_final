# Project Report: Restaurant Table Reservation System

## 1. Project Overview

The Restaurant Table Reservation System is a full-stack web application designed for a restaurant to manage table bookings efficiently. Customers can browse tables, check availability, and reserve a table for a specific date and time. Administrators can add, update, and delete tables and monitor all reservations.

This project demonstrates the use of:
- Node.js and Express.js for backend APIs
- MongoDB Atlas / MongoDB for database storage
- Mongoose for schema modeling and database interaction
- React + Vite for the frontend interface
- JWT-based authentication for users and admins
- Role-based access control (customer vs admin)
- REST API design and CRUD operations

The application is useful for a restaurant management system where reservations must be tracked correctly and avoid time conflicts.

---

## 2. Objectives of the Project

The main goals of the project are:

1. Allow users to register and log in.
2. Let customers view available tables by date, time, and party size.
3. Prevent overlapping bookings for the same table.
4. Allow admins to manage restaurant tables.
5. Provide a reservation history for customers and admin users.
6. Ensure secure and controlled access using JWT and admin middleware.

---

## 3. Technology Stack

### Frontend
- React
- Vite
- Axios
- HTML / CSS

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- CORS
- Helmet
- dotenv

### Database
- MongoDB Atlas (recommended for production)
- Mongoose ODM

---

## 4. Project Structure

```text
nodejs_project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── seedAdmin.js
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── postman/
│   └── Restaurant-Reservation.postman_collection.json
├── README.md
├── REPORT.md
└── .gitignore
```

---

## 5. Functional Modules

### 5.1 User Authentication
Users can register and log in through the backend APIs.

- Register: POST /api/auth/register
- Login: POST /api/auth/login

The login response contains a JWT token which is used for protected requests.

### 5.2 Table Management
Admins can add, update, and delete tables.

- GET /api/tables
- GET /api/tables/:id
- POST /api/tables
- PUT /api/tables/:id
- DELETE /api/tables/:id

### 5.3 Availability Search
Customers can search for available tables based on:
- date
- start time
- end time
- party size

Endpoint:
- GET /api/tables/available

### 5.4 Reservation Management
Customers can book a table for a date and time. The app prevents conflicting reservations using time overlap logic.

- POST /api/reservations
- GET /api/reservations/my
- GET /api/reservations?date=YYYY-MM-DD
- DELETE /api/reservations/:id

---

## 6. How to Use the Frontend

### Step 1: Open the frontend folder
```bash
cd frontend
npm install
```

### Step 2: Start the frontend server
```bash
npm run dev -- --host 0.0.0.0
```

### Step 3: Open in browser
The Vite dev server usually opens on:
```text
http://localhost:5173
```

### Frontend Features
- User registration and login
- Booking table reservation
- Searching available tables
- Admin table handling
- Reservation management

### Screenshot Required
[Screenshot Required] Frontend login page showing the login/register form.

### Screenshot Required
[Screenshot Required] Customer reservation flow showing table selection and reservation booking.

### Screenshot Required
[Screenshot Required] Admin dashboard showing table and reservation management.

---

## 7. How to Use the Backend

### Step 1: Open the backend folder
```bash
cd backend
npm install
```

### Step 2: Configure environment variables
Create a .env file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurantDB
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Step 3: Start the backend server
```bash
npm run dev
```

### Step 4: Seed the admin account (optional but recommended)
```bash
npm run seed
```

Default admin credentials:
- Email: admin@restaurant.com
- Password: Admin@123

### API Access
The backend runs on:
```text
http://localhost:5000
```

Example API endpoints:
- http://localhost:5000/api/auth/register
- http://localhost:5000/api/auth/login
- http://localhost:5000/api/tables
- http://localhost:5000/api/reservations

---

## 8. Where to See the Data in MongoDB Atlas

The project stores records in MongoDB. The database collections correspond to the models used in the backend.

### Data Collections
The MongoDB database will contain these collections:
- users
- tables
- reservations

These names are created automatically by Mongoose based on the model names:
- User model -> users collection
- Table model -> tables collection
- Reservation model -> reservations collection

### How to view data in Atlas

1. Log in to MongoDB Atlas.
2. Open your cluster.
3. Click Browse Collections.
4. Open the database name used in MONGODB_URI.
5. Select the collection you want to inspect.

For example:
- users: contains customer/admin records
- tables: contains restaurant tables
- reservations: contains booked time slots and reservation status

### In this project, the expected database name is:
```text
restaurantDB
```

### Screenshot Required
[Screenshot Required] MongoDB Atlas Browse Collections view showing the database and collections.

### Example of what to look for
- users collection: user email, password hash, role
- tables collection: table number, capacity, location, availability
- reservations collection: customer reference, table reference, date, time, status

---

## 9. How to Connect to Atlas

Use the MongoDB Atlas connection string in the backend .env file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Important:
- Whitelist your IP in Atlas Network Access.
- Create a database user in Atlas.
- Use the database name you want to store the app data in.

If the connection string is wrong or IP is not whitelisted, the backend will fail to connect to MongoDB.

---

## 10. Reservation Rules and Business Logic

The app enforces business rules such as:

- Reservation date cannot be in the past.
- Start time must be less than end time.
- Party size must be positive.
- Table capacity must be enough for the party size.
- Overlapping bookings are rejected.
- Back-to-back bookings are allowed.
- Cancelled reservations do not appear as active bookings.

The basic overlap logic is:

```text
existing.startTime < new.endTime && existing.endTime > new.startTime
```

This prevents conflicts on the same table and date.

---

## 11. Testing and Validation

The project can be validated using:
- Postman for API testing
- Browser for frontend UI checks
- MongoDB Atlas for data verification

A Postman collection is included at:
- postman/Restaurant-Reservation.postman_collection.json

### Recommended testing flow
1. Register a customer.
2. Log in and copy the JWT token.
3. Create an admin user or use the seeded admin.
4. Add tables as admin.
5. Create a reservation for a future date.
6. Try overlapping times to confirm rejection.
7. View the reservation in MongoDB Atlas.

---

## 12. Important Screenshot Requirements for Submission

To complete the academic/project submission, the following screenshots are recommended and should be included:

1. Login page of the frontend
2. Customer reservation form or reservation flow
3. Admin dashboard or admin table management page
4. MongoDB Atlas collections page showing the database and tables

### Submission Checklist
- [ ] Login page screenshot
- [ ] Customer reservation screenshot
- [ ] Admin dashboard screenshot
- [ ] MongoDB Atlas screenshot
- [ ] Optional: Postman request screenshot for API testing

---

## 13. Conclusion

This Restaurant Table Reservation System is a practical project that combines frontend, backend, authentication, database design, and business logic. It teaches how to build a real-world application with user roles, API endpoints, database connections, and reservation validation.

The project is beginner-friendly but covers important concepts used in real web development, especially in full-stack applications.

---

## 14. Final Notes for the User

- Frontend should be run from the frontend folder.
- Backend should be run from the backend folder.
- MongoDB Atlas data can be viewed in the Atlas cluster under Browse Collections.
- Use the admin credentials to access admin features.
- Include all required screenshots before final submission.
