# RUN a project
# ---------------------------
1. Clone repo

  1. Frontend: React (or any other framework)
1.1. Setting up the React App

Navigate to your frontend directory (if you're in a monorepo, this will typically be inside a client or frontend folder):

cd frontend


Install dependencies:
If you haven’t installed the dependencies yet, use npm (or yarn) to install them:

npm install


This will install the necessary dependencies in the package.json file.

Set up Proxy (Optional but recommended for local development):
In React, you can set up a proxy to forward API requests to the backend while running both servers locally. In your frontend/package.json file, add a proxy field like this:

"proxy": "http://localhost:5000"


This assumes that your backend is running on port 5000 (you can adjust this to whatever port your backend uses). This allows you to make API requests to the backend without dealing with CORS issues during development.

Run the React App:
Now, you can start the frontend server. Run this command inside the frontend directory:

npm start


This will start the React development server, and you should be able to access your app in the browser at http://localhost:3000.

The React development server will automatically reload the page when you make changes to your code.
2. Backend: Express (or any other Node.js backend framework)
2.1. Setting up the Backend

Navigate to your backend directory (if separate from frontend):

cd backend


Install dependencies:
If you haven’t installed the backend dependencies yet, run:

npm install


This will install all the dependencies listed in the backend/package.json file (e.g., Express, Mongoose, JWT, etc.).

Run the Backend Server:
Typically, your backend will be set to listen on a different port (e.g., 5000 for the backend). Run the backend server using:

npm start


Make sure your backend/package.json includes a start script that runs your server. For example:

"scripts": {
  "start": "node server.js"
}


If you're using nodemon (recommended for development), use:

npm run dev


This will start your backend server with auto-reload for changes.

Access the Backend API:
After running the backend, you can access your backend API at http://localhost:5000 (or whichever port your backend is configured to run on).

3. Running Both Frontend and Backend Together (Development Environment)
Option 1: Running Servers in Separate Terminals

Frontend: In one terminal, navigate to the frontend folder and run:

npm start


Backend: In another terminal, navigate to the backend folder and run:

npm start


This will start both the frontend and backend servers simultaneously, and they will run independently. Your frontend will be available at http://localhost:3000 (or whatever port React uses), and your backend API will be available at http://localhost:5000.


Options to install manually.
2. Install packages
first:
both frontend and backend
>npm init -y
>npm install
# Packages to install
backend folder:

> npm i axios
> npm i bcrypt
> npm i cors
> npm i dotenv
> npm i express
> npm i jsonwebtoken
> npm i mongoose
> npm i multer
> npm i path
> npm i react-router-dom
frontend folder:
>npm install
>npm
> npm i @tailwindcss/vite
> npm i autoprefixer
> npm i axios
> npm i bcrypt
> npm i jsonwebtoken
> npm i postcss
> npm i react
> npm i react-data-table-component
> npm i react-dom
> npm i react-icons
> npm i react-router-dom
> npm i react-toastify
> npm i styled-components


3.Run
  At gitbash:
  -backend folder:
  *node index.js
  -frontend folder:
  *npm run dev
