import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import connectDB from "./db/db.js";
import wardRouter from "./routes/ward.js";
import roleRouter from "./routes/role.js";
import employeeRouter from "./routes/employee.js";
import medicationRouter from "./routes/medication.js";
import chronicRouter from "./routes/chronics.js";
import allergyRouter from "./routes/allergy.js";

const startServer = async () => {
  await connectDB();

  const app = express();

  // CORS configuration
  const allowedOrigins = [
    process.env.ALLOW_ORIGIN_LOCAL, // e.g., http://localhost:5173
    process.env.ALLOW_ORIGIN_PROD, // e.g., https://final-project-health-link.vercel.app
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true, // set to true if your frontend sends cookies or auth headers
    })
  );

  // Handle preflight requests for all routes
  app.options("*", cors());

  // Parse JSON
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/ward", wardRouter);
  app.use("/api/role", roleRouter);
  app.use("/api/employee", employeeRouter);
  app.use("/api/medication", medicationRouter);
  app.use("/api/chronic", chronicRouter);
  app.use("/api/allergy", allergyRouter);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
