import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";


const createOrder = AsyncHandler(async(req, res) => {
        const user = req.user
        if (!user) throw new ApiError(401, 'User not found')

        const { shippingAdd } = req.body
        if (!shippingAdd) throw new ApiError(400, 'Shipping address not found');

        const cart = await Cart.findOne({ user: user.id }).populate({ path: 'products.product' })
        if (!cart) throw new ApiError(400, 'Cart does not exist');

        const items = cart.products.map(p => ({
            product: p.product._id,
            quantity: p.quantity,
            price: p.product.price
        }))
        if (!items) throw new ApiError(401, 'Cart is empty');
        const totalPrice = items.reduce((sum, curr) => sum = sum + (curr.quantity * curr.price), 0)

        const order = await Order.create({
            user: user.id,
            items: items,
            shippingAdd: shippingAdd,
            totalPrice: totalPrice
        })

        if (!order) throw new ApiError(401, 'Error while creating on order')
        cart.products = []
        cart.save()



        res.status(200).json(ApiResponse(200, order, 'order placed successfully'))


    })
    // ----------------------------get order by user---------------------------

const getOrder = AsyncHandler(async(req, res) => {

        const user = req.user
        if (!user) throw new ApiError(401, 'User not found')

        const order = await Order.findOne({ user: user.id })

        if (!order) throw new ApiError(400, 'No order found')

        res.status(200).json(ApiResponse(200, order, 'Order fetched successfully'))


    })
    // -------------------------------delete order---------------------
const deleteOrder = AsyncHandler(async(req, res) => {
    const user = req.user
    if (!user) throw new ApiError(401, 'User not found');

    const { orderId } = req.body

    if (!orderId) throw new ApiError(400, 'Order id is missing')

    const deleteOrder = await Order.findByIdAndDelete(orderId);

    if (!deleteOrder) throw new ApiError(400, 'Error while deleting the order')

    res.status(200).json(ApiResponse(200, deleteOrder, 'Order deleted successfully'))
})
export { createOrder, getOrder, deleteOrder };