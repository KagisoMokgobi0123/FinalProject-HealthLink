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

  // Allowed origins for CORS
  const allowedOrigins = [
    process.env.ALLOW_ORIGIN_LOCAL,
    process.env.ALLOW_ORIGIN_PROD,
  ];

  // CORS middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow requests like Postman
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true, // allow cookies/auth headers if needed
    })
  );

  // Parse JSON requests
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/ward", wardRouter);
  app.use("/api/role", roleRouter);
  app.use("/api/employee", employeeRouter);
  app.use("/api/medication", medicationRouter);
  app.use("/api/chronic", chronicRouter);
  app.use("/api/allergy", allergyRouter);

  // // Catch-all route for undefined API endpoints
  // app.all("/api/:path(*)", (req, res) => {
  //   res.status(404).json({ error: "API endpoint not found" });
  // });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
