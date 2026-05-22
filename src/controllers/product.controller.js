import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
// -----------------------------------------create a product--------------------------------------
const createProduct = AsyncHandler(async(req, res) => {
    console.log(req.body);
    const user = req.user
    if (!user) throw new ApiError(401, 'Unauthorized access')
    const { productName, price, description, productImage } = req.body;
    if (
        [productName, productImage].some((field) => !field || !field.trim()) ||
        !price
    ) {
        throw new ApiError(400, "Please fill the required fields");
    }
    const product = await Product.findOne({ productName });
    if (product) throw new ApiError(400, "PRODUCT EXISTED!");

    const newProduct = await Product.create({
        productName: productName,
        productImage: productImage,
        price: price,
        description: description,
    });

    res
        .status(200)
        .json(ApiResponse(200, newProduct, "Product created successfully"));
});
// -------------------------------------get all the products-----------------------------------
const getProducts = AsyncHandler(async(req, res) => {
        const user = req.user
        if (!user) throw new ApiError(400, 'Unauthorized Access')

        const products = await Product.find()
        if (!products.length) throw new ApiError(400, "No products to display")

        res.status(200).json(ApiResponse(200, products, 'Products fetched easily'))
    })
    // ----------------------------------delete product------------------------------

const deleteProduct = AsyncHandler(async(req, res) => {
    const user = req.user
    if (!user) throw new ApiError(401, 'UNAUTHORIZED ACCESS');

    const { productId } = req.body
    if (!productId) throw new ApiError(400, 'Product id is missing');

    const deleteProduct = await Product.findByIdAndDelete(productId)
    if (!deleteProduct) throw new ApiError(400, 'No product found')

    res.status(200).json(ApiResponse(200, 'Product deleted successfully!'))

})

export { createProduct, getProducts, deleteProduct };