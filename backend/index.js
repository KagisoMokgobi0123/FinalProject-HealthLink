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

  app.use(cors());
  app.use(express.json());

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
