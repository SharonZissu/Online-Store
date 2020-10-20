const mongoose = require('mongoose');
const product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                product: { type: Object },
                quantity: { type: Number, required: true },
                size: { type: String || Number, required: true }
            }]
    }
});

userSchema.methods.addToCart = function (product, size) {

    const cartProducts = this.cart.items.filter(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    const cartProductIndex = this.cart.items.findIndex(cp => {
        return ((cp.productId.toString() === product._id.toString()) && (cp.size === size))

    });


    // console.log(cartProductIndex);



    // console.log('CartProducts:', cartProducts);
    // console.log('CartProductsIndex:', cartProductIndex);
    // console.log('Product:', product);


    let flag = false;
    let newQuantity = 1;
    const updateCartItems = [...this.cart.items];

    if (cartProducts) {
        cartProducts.forEach((cartProduct, index) => {
            if (cartProduct.size === size) {
                newQuantity = cartProducts[index].quantity + 1;
                // cartProductIndex = this.cart.items.findIndex(cp => {
                //     return cartProduct.productId.toString() ===
                // })
                updateCartItems[cartProductIndex].quantity = newQuantity;
                flag = true;
            }
        });
    }



    if (!flag) {

        updateCartItems.push({
            productId: product._id,
            product: {
                category: product.category,
                department: product.department,
                title: product.title,
                brand: product.brand,
                price: product.price,
                description: product.description,
                image: product.image,
            },
            quantity: newQuantity,
            size: size
        });
    };

    const updatedCart = { items: updateCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId, productSize) {
    // const updatedCartItems = this.cart.items.filter(item => {
    //     return productId.toString() !== item.productId.toString() && productSize !== item.size;
    // });

    let updatedCartItems = [];
    this.cart.items.forEach(item => {
        if (productId.toString() !== item.productId.toString()) {
            updatedCartItems.push(item);
        } else {
            if (item.size !== productSize) {
                updatedCartItems.push(item);
            }
        }
    });

    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.removeOneFromCart = function (productId, size) {
    const cartProducts = this.cart.items.filter(cp => {
        return cp.productId.toString() === productId.toString();
    });

    const cartProductIndex = this.cart.items.findIndex(cp => {
        return ((cp.productId.toString() === productId.toString()) && (cp.size === size))

    });


    let flag = false;
    let newQuantity;
    const updateCartItems = [...this.cart.items];

    if (cartProducts) {
        cartProducts.forEach((cartProduct, index) => {
            if (cartProduct.size === size) {
                newQuantity = cartProducts[index].quantity - 1;
                updateCartItems[cartProductIndex].quantity = newQuantity;
            }
        });
    }
    const updatedCart = { items: updateCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { item: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);