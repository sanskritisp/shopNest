import mongoose from "mongoose";
import { Product } from "./product.model.js";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',

        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }

    }],
    shippingAdd: {
        fullName: String,
        contactNo: Number,
        address: String,
        pincode: Number
    },
    totalPrice: {
        type: Number,
        required: true
    },

}, { timestamps: true })

export const Order = mongoose.model('Order', orderSchema)