import express from "express";
import cors from "cors";
import app from "./app.js";
import dbConnection from "./src/database/dbConnection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

dotenv.config();

const expApp = express();
expApp.use(express.json());
expApp.use(express.urlencoded({ extended: true }));
expApp.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

expApp.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
expApp.use(cookieParser());
expApp.use("/api", app);

const port = process.env.PORT;
expApp.use(errorMiddleware);
dbConnection().then(() => {
  expApp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
