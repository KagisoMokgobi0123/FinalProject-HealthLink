import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
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

    // Allowed frontend URLs
    const allowedOrigins = [
      process.env.ALLOW_ORIGIN_LOCAL,
      process.env.ALLOW_ORIGIN_PROD,
    ].filter(Boolean);

    // CORS middleware
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true); // Postman, curl
          if (allowedOrigins.includes(origin)) return callback(null, true);
          console.warn("❌ Blocked by CORS:", origin);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );

    // Body parser
    app.use(express.json());

    // API routes (must come before React catch-all)
    app.use("/api/auth", authRouter);
    app.use("/api/ward", wardRouter);
    app.use("/api/role", roleRouter);
    app.use("/api/user", userRouter);
    app.use("/api/medication", medicationRouter);
    app.use("/api/chronic", chronicRouter);
    app.use("/api/allergy", allergyRouter);

    // Root health check
    app.get("/api", (req, res) => {
      res.json({ status: "OK", message: "HealthLink API is running..." });
    });

    // Serve React in production
    if (process.env.NODE_ENV === "production") {
      const __dirname = path.resolve();
      app.use(express.static(path.join(__dirname, "client/dist")));

      // React catch-all (for client-side routing)
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/dist", "index.html"));
      });
    }

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
