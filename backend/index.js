import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

import authRouter from "./routes/auth.js";
import wardRouter from "./routes/ward.js";
import roleRouter from "./routes/role.js";
import userRouter from "./routes/user.js";
import medicationRouter from "./routes/medication.js";
import chronicRouter from "./routes/chronics.js";
import allergyRouter from "./routes/allergy.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    const allowedOrigins = [
      process.env.ALLOW_ORIGIN_LOCAL, // localhost
      process.env.ALLOW_ORIGIN_PROD, //  production
    ];

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);

          // Allow any Vercel deployment of your project
          const vercelPattern =
            /^https:\/\/final-project-health-link(-\w+)?\.vercel\.app$/;

          if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
            return callback(null, true);
          }

          console.warn("❌ Blocked by CORS:", origin);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );

    // JSON body parser
    app.use(express.json());

    // API routes
    app.use("/api/auth", authRouter);
    app.use("/api/ward", wardRouter);
    app.use("/api/role", roleRouter);
    app.use("/api/user", userRouter);
    app.use("/api/medication", medicationRouter);
    app.use("/api/chronic", chronicRouter);
    app.use("/api/allergy", allergyRouter);

    // Health check
    app.get("/", (req, res) => {
      res.send("HealthLink Backend API is running...");
    });

    // ❗ REMOVE React serving — Vercel hosts frontend
    // (This part removed completely)

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("🔥 Global Error:", err.stack || err.message);
      res.status(500).json({
        success: false,
        error: err.message || "Server Error",
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();
