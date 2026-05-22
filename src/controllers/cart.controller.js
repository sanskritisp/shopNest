import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

//creating a user cart
const createCart = AsyncHandler(async(req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "User not found");

    const { productsId } = req.body;

    let cart = await Cart.findOne({ user: user.id });

    if (!cart) {
        cart = await Cart.create({ user: user.id, products: [] });
    }

    const cartProducts = cart.products.find(
        (item) => item.product && item.product.equals(productsId)
    );

    if (cartProducts) {
        cartProducts.quantity += 1;
    } else {
        cart.products.push({ product: productsId, quantity: 1 });
    }
    await cart.save();

    res.status(200).json(ApiResponse(200, cart, "cart created successfully"));
});
// ----------------remove products from the cart--------------------

const removeProducts = AsyncHandler(async(req, res) => {

    const user = req.user
    if (!user) throw new ApiError(401, 'User not found')

    const { productId, action } = req.body;

    // Check if missing
    if (!productId || !action) throw new ApiError(400, "Fill in all the required fields");

    // Check if empty string
    if (!productId.trim() || !action.trim()) throw new ApiError(400, "Fill in all the required fields");

    const cart = await Cart.findOne({ user: user.id })
    if (!cart) throw new ApiError(400, 'Cart not found');

    const productExist = cart.products.find(p => p && p.product.toString() === productId)
    if (!productExist) throw new ApiError(400, 'Product do not exist');

    if (action === 'decrease') {
        if (productExist.quantity > 1) productExist.quantity -= 1
        else {
            const updatedProductList = cart.products.filter(p => p && p.product.toString() != productId)
            cart.products = updatedProductList
        }
    }
    if (action === 'remove') {
        const updatedProductList = cart.products.filter(p => p && p.product.toString() != productId)
        cart.products = updatedProductList
    }
    await cart.save()

    res.status(200).json(ApiResponse(200, cart, 'Item quantity updated/removed succesfully '))
})

// ------------------getting user cart--------------
const getUserCart = AsyncHandler(async(req, res) => {
    const user = req.user
    if (!user) throw new ApiError(401, 'User not found')

    const cart = await Cart.findOne({ user: user.id }).populate({ path: "products.product" })

    if (!cart) throw new ApiError(400, 'CART NOT FOUND')

    res.status(200).json(ApiResponse(200, cart, 'Cart fetched successfully '))
})
export { createCart, removeProducts, getUserCart };