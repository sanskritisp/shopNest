import { Router } from "express";
import user from "./routes/user.route.js";
import product from "./routes/product.route.js"
import cart from "./routes/cart.route.js"

const router = Router();

router.use("/user", user);
router.use("/product", product)
router.use("/cart", cart)

export default router;