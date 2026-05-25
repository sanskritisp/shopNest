import { Router } from "express";
import jwtAuth from "../middleware/auth.middleware.js";
import { createOrder, deleteOrder, getOrder } from "../controllers/order.controller.js";


const router = Router();

router.post('/place-order', jwtAuth, createOrder)
router.get('/get-order', jwtAuth, getOrder)
router.delete('/delete-order', jwtAuth, deleteOrder)



export default router