import { Router } from "express";
import jwtAuth from "../middleware/auth.middleware.js";
import { createProduct, deleteProduct, getProducts } from "../controllers/product.controller.js";


const router = Router();

router.post('/create-product', jwtAuth, createProduct)
router.get('/get-products', jwtAuth, getProducts)
router.delete('/delete-product', jwtAuth, deleteProduct)




export default router;