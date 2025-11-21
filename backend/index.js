import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import connectDB from "./db/db.js";
import wardRouter from "./routes/ward.js";
import roleRouter from "./routes/role.js";
import employeeRouter from "./routes/employee.js";

const startServer = async () => {
  await connectDB(); // wait for DB connection

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRouter);
  app.use("/api/ward", wardRouter);
  app.use("/api/role", roleRouter);
  app.use("/api/employee", employeeRouter);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

startServer();
