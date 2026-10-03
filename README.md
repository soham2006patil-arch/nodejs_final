# Restaurant Table Reservation System

A beginner-friendly full-stack academic project for reserving restaurant tables by date and time. Customers can find and reserve tables; administrators manage tables and review a day's reservations.

## Features

- Customer registration and login with bcrypt password hashing.
- JWT authentication and admin-only authorization middleware.
- Table CRUD with capacity and location.
- Available-table search by date, time range, and party size.
- Reservation references to customer and table documents.
- Strict overlap prevention: `existing.startTime < new.endTime && existing.endTime > new.startTime`.
- Back-to-back bookings are allowed because an end time can equal the next start time.
- Customers can cancel their own reservations; admins can cancel any reservation.
- Responsive React UI for customers and admins.
- Importable Postman collection in `postman/`.

## Technology Stack

Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, dotenv, Helmet, CORS, React, Vite, Axios, and Postman.

## Folder Structure

```text
backend/
  config/db.js
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  seedAdmin.js
frontend/
  src/App.jsx
  src/services/api.js
  src/main.jsx
  src/styles.css
postman/Restaurant-Reservation.postman_collection.json
README.md
```

## Installation

Prerequisite: Node.js 18+ and a MongoDB Atlas database.

```bash
cd backend
npm install
cp .env.example .env
```

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

## MongoDB Atlas and Environment Variables

Create a free Atlas cluster, create a database user, allow your development IP address under Network Access, and copy the connection string. Put it in `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurantDB
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Put this in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files.

## Create an Admin

From the backend directory, optionally set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run:

```bash
npm run seed
```

Defaults are `admin@restaurant.com` and `Admin@123` when those variables are not set. Change the password for real deployment.

## Run Locally

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## API Endpoints

All JSON responses use `{ success, message, data }` where applicable.

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/tables` | Public |
| GET | `/api/tables/:id` | Public |
| GET | `/api/tables/available?date=YYYY-MM-DD&startTime=HH:mm&endTime=HH:mm&partySize=4` | Public |
| POST | `/api/tables` | Admin JWT |
| PUT | `/api/tables/:id` | Admin JWT |
| DELETE | `/api/tables/:id` | Admin JWT |
| POST | `/api/reservations` | Customer or admin JWT |
| GET | `/api/reservations/my` | Customer or admin JWT |
| GET | `/api/reservations?date=YYYY-MM-DD` | Admin JWT |
| DELETE | `/api/reservations/:id` | Owner or admin JWT |

Protected requests use the header `Authorization: Bearer YOUR_JWT_TOKEN`.

## Reservation Rules

Dates must use `YYYY-MM-DD`, times use `HH:mm`, dates in the past are rejected, and `partySize` must be positive and no larger than table capacity. Cancelled reservations are ignored by availability and conflict queries.

For a reservation on the same table and date, the server rejects only when:

```text
existing.startTime < new.endTime AND existing.endTime > new.startTime
```

This returns HTTP 409 for an overlap and allows `19:00-21:00` followed by `21:00-23:00`.

## Postman Testing

1. Import `postman/Restaurant-Reservation.postman_collection.json`.
2. Register a customer and copy the returned token into the collection `token` variable.
3. Run `Get Tables`, or log in as the seeded admin for table CRUD.
4. Copy a table `_id` into `tableId`.
5. Create a reservation for a future date, then try an overlapping time on the same table and confirm HTTP 409.
6. Try a party size larger than capacity and confirm HTTP 400.
7. Try an adjacent time slot and confirm HTTP 201.
8. Cancel a reservation, then confirm that its time is available again.
9. Send a customer token to an admin endpoint and confirm HTTP 403; omit the token and confirm HTTP 401.

## Deployment

Deploy `backend` to Render or Railway with `npm install` as the build/install command and `npm start` as the start command. Add `MONGODB_URI`, `JWT_SECRET`, `PORT`, and the deployed frontend URL as `CLIENT_URL` environment variables.

Deploy `frontend` to Vercel or Netlify with `npm run build` and set `VITE_API_URL` to the deployed backend's `/api` URL. Update backend `CLIENT_URL` to the frontend domain.

## Screenshots

<img width="425" height="244" alt="image" src="https://github.com/user-attachments/assets/9e23d0f5-eee2-4008-bb5c-faafb05c954e" />
<img width="425" height="245" alt="image" src="https://github.com/user-attachments/assets/82add6ec-8335-4a2a-849c-4e1bccdf94ef" />
<img width="425" height="244" alt="image" src="https://github.com/user-attachments/assets/5ddb82c1-e78d-442b-9f7f-40b0a0b31fb9" />
<img width="439" height="157" alt="image" src="https://github.com/user-attachments/assets/eb87f42d-35f7-4bcc-9832-a1e3b34cf575" />
<img width="439" height="233" alt="image" src="https://github.com/user-attachments/assets/782c26ca-6282-45b1-a8aa-a927f1484ecb" />
<img width="439" height="137" alt="image" src="https://github.com/user-attachments/assets/b05d7bc1-961a-4efe-963e-70844eb0e11d" />
<img width="439" height="221" alt="image" src="https://github.com/user-attachments/assets/798b6a57-2f1c-45bd-953d-e592ab2eb9b9" />
<img width="439" height="281" alt="image" src="https://github.com/user-attachments/assets/2b28bb30-820f-4bc9-bff5-67b8a543e0dc" />
<img width="439" height="78" alt="image" src="https://github.com/user-attachments/assets/e9330687-2dc1-42e6-ae75-0a82b2c0bc5d" />
<img width="439" height="137" alt="image" src="https://github.com/user-attachments/assets/f09a1f5a-1822-4a9e-9dd6-4c06255708e1" />


## Academic Concepts Demonstrated

REST APIs, Express routing, middleware, MongoDB/Mongoose CRUD, references and population, JWT, bcrypt, role-based authorization, environment variables, query parameters, validation, centralized error handling, HTTP status codes, and Postman testing.
