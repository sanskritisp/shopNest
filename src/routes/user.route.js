import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createUser, getUsers, login, logout } from "../controllers/user.controller.js";
import jwtAuth from "../middleware/auth.middleware.js";

const router = Router();

// temporary debug middleware
router.post("/create", upload.single("image"), createUser);
router.get("/getAllusers", getUsers)
router.post("/login", login)
router.post("/logout", jwtAuth, logout)

export default router;