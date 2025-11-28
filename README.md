# Run the project locally

1️⃣ Seed the database

Run the roles seed (empRole.js) first. This creates initial roles like admin, doctor, nurse, etc.

Run the user seed (userSeed.js) next and open the collection to update status to active. This creates an admin user linked to the admin role.

Make sure your backend .env file is set up before running the seeds.

2️⃣ Backend setup

Go to your backend folder:

cd backend

Install dependencies:

npm install

Create a .env file in the backend folder with the following variables:

PORT=5000
MONGODB_URI=<your MongoDB connection string> # e.g., mongodb://127.0.0.1:27017/healthlink
JWT_SECRET=<your secret key> # e.g., supersecretkey
ALLOW_ORIGIN_LOCAL=http://localhost:5173
ALLOW_ORIGIN_PROD=http://localhost:5173 # for local testing, use frontend dev URL
SMTP_HOST=<your SMTP host>
SMTP_PORT=<your SMTP port>
SMTP_USER=<your email username>
SMTP_PASS=<your email password>
SMTP_SECURE=<true or false>

Run the seed scripts in order:

node seeds/empRole.js
node seeds/userSeed.js

Start the backend server:

npm run dev

API will be available at http://localhost:5000/api.

3️⃣ Frontend setup

Go to your frontend folder:

cd frontend

Install dependencies:

npm install

Create a .env file in the frontend folder with:

VITE_API_URL=http://localhost:5000

Start the frontend:

npm run dev

Frontend will be available at http://localhost:5173.

4️⃣ Test login

Use the seeded admin user credentials:

Email: admin@example.com
Password: Admin123!

Ensure the login hits the backend successfully.
