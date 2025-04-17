import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  deleteTimeline,
  getTimelines,
  postTimeline,
} from "../controllers/timelineController.js";
const timelineRouter = express.Router();

timelineRouter.post("/add", isAuthenticated, postTimeline);
timelineRouter.delete("/delete/:id", isAuthenticated, deleteTimeline);
timelineRouter.get("/getall", isAuthenticated, getTimelines);

export default timelineRouter;
