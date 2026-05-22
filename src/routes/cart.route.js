import { Router } from "express";
import jwtAuth from "../middleware/auth.middleware.js";
import { createCart, getUserCart, removeProducts } from "../controllers/cart.controller.js";



const router = Router();
router.post('/create-cart', jwtAuth, createCart)
router.post('/remove-product', jwtAuth, removeProducts)
router.get('/get-cart', jwtAuth, getUserCart)




export default router