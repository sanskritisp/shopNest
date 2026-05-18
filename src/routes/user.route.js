import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createUser } from "../controllers/user.controller.js";

const router = Router();

// temporary debug middleware
router.post('/create', (req, res, next) => {
    console.log('RAW content-type:', req.headers['content-type']);
    console.log('RAW body before multer:', req.body);
    next();
}, upload.single('image'), (req, res, next) => {
    console.log('body AFTER multer:', req.body);
    console.log('file AFTER multer:', req.file);
    next();
}, createUser);

export default router;