import { Router } from "express";
import user from "./routes/user.route.js";
import product from "./routes/product.route.js"
import cart from "./routes/cart.route.js"
import order from "./routes/order.route.js"

const router = Router();

router.use("/user", user);
router.use("/product", product)
router.use("/cart", cart)
router.use("/order", order)

export default router;