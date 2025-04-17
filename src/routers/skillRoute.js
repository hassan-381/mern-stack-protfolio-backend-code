import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNewSkill,
  deleteSkill,
  getAllSkills,
  updateSkills,
} from "../controllers/skillController.js";

const skillRouter = express.Router();

skillRouter.post("/add", isAuthenticated, addNewSkill);
skillRouter.delete("/delete/:id", isAuthenticated, deleteSkill);
skillRouter.put("/update/:id", isAuthenticated, updateSkills);
skillRouter.get("/getall", isAuthenticated, getAllSkills);

export default skillRouter;
