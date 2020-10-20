const mongoose = require('mongoose');
const product = require('./product');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userDetails: {
        fName: {
            type: String,
            required: true
        },
        lName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    deliveryDetails: {
        method: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        houseNum: {
            type: Number,
            required: true
        },
        telephone: {
            type: String,
            required: true
        },
        remarks: String

    },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            product: { type: Object },
            quantity: { type: Number, required: true },
            size: { type: String || Number, required: true }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);
