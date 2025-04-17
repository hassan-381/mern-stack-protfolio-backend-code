import express from "express";
import cloudinary from "cloudinary";
import messageRouter from "./src/routers/messageRoute.js";
import userRouter from "./src/routers/userRoutes.js";
import timelineRouter from "./src/routers/timelineRoutes.js";
import dotenv from "dotenv";
import softwareRouter from "./src/routers/softwareApplicationRoute.js";
import skillRouter from "./src/routers/skillRoute.js";
import projectRouter from "./src/routers/projectRoute.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/timeline", timelineRouter);
app.use("/softwareApplication", softwareRouter);
app.use("/skill", skillRouter);
app.use("/project", projectRouter);

export default app;
