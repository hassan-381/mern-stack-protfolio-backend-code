import express from "express";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/add", addProject);
projectRouter.get("/getall", getAllProjects);
projectRouter.put("/update/:id", updateProject);
projectRouter.delete("/delete/:id", deleteProject);
projectRouter.get("/get/:id", getSingleProject);

export default projectRouter;
