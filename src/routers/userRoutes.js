import express from "express";
import {
  forgetPassword,
  getUser,
  getUserForPortfolio,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateUser,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/me", isAuthenticated, getUser);
userRouter.put("/update/me", isAuthenticated, updateUser);
userRouter.put("/update/password", isAuthenticated, updatePassword);
userRouter.get("/me/portfolio", getUserForPortfolio);
userRouter.post("/password/forget", forgetPassword);
userRouter.put("/password/reset/:token", resetPassword);

export default userRouter;
