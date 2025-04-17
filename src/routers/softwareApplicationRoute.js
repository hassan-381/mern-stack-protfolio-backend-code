import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNewApplication,
  deleteApplication,
  getAllApplications,
} from "../controllers/softwareApplicationController.js";

const softwareRouter = express.Router();

softwareRouter.post("/add", isAuthenticated, addNewApplication);
softwareRouter.delete("/delete/:id", isAuthenticated, deleteApplication);
softwareRouter.get("/getall", isAuthenticated, getAllApplications);

export default softwareRouter;
