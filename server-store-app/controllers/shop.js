const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const { uuid } = require('uuidv4');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.NODEMAILER_KEY
    }
}));
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.getProducts = (req, res, next) => {
    category = req.body.category;
    brand = req.body.brand;
    department = req.body.department;

    const currentPage = req.query.page || 1;
    const perPage = 4;
    let totalItems;

    let filter;
    if (!brand && !department) {
        filter = { category: category };
    } else if (brand && !department) {
        filter = { category: category, brand: brand };
    } else if (!brand && department) {
        filter = { category: category, department: department };
    } else {
        filter = { category: category, brand: brand, department: department };
    }
    Product.find(filter)
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Product.find(filter)
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(products => {
            res.status(200).json({ message: 'Fetched products successfully', products: products, totalItems: totalItems });
        })
        .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            res.status(200).json({ product: product });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const { productId, size } = req.body;
    if (!size) {
        const error = new Error('no size picked');
        error.statusCode = 401;
        throw error;
    }
    let returnedProduct;
    Product.findById(productId)
        .then(product => {
            // console.log('INSIDEINSIDE');
            // console.log(product);
            returnedProduct = product;
            // console.log('RETURNPRODUCT:', returnedProduct);
            // console.log(product.cart);
            return User.findById(req.userId);
        })
        .then(user => {
            // console.log('RETURNNNN', returnedProduct);
            return user.addToCart(returnedProduct, size);
        })
        .then(result => {
            res.status(200).json({ product: returnedProduct });
        })

        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.getCart = (req, res, next) => {

    User.findOne({ _id: req.userId })

        .then((user) => {
            return user
            // .populate('cart.items.productId')
            // .execPopulate()
        })
        .then(userData => {
            const products = userData.cart.items;
            // console.log(products);
            res.status(200).send(products);
        })
        .catch((err) => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {

    const prodId = req.body.productId;
    const size = req.body.size;
    User.findById(req.userId)
        .then(user => {
            return user.removeFromCart(prodId, size)
        })

        .then((result) => {
            res.status(200).json({ prodId: prodId });
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteOneProduct = (req, res, next) => {

    const prodId = req.body.productId;
    const size = req.body.size;
    User.findById(req.userId)
        .then(user => {
            return user.removeOneFromCart(prodId, size)
        })
        .then((result) => {
            res.status(200).json({ prodId: prodId });
        })
        .catch((err) => console.log(err));
};

exports.getUserName = (req, res, next) => {
    // console.log('REQQQQQQQQQQ', req.userId);
    User.findById(req.userId)
        .then(user => {
            res.status(200).json({ name: user.name });
        })
        .catch(err => console.log(err));
}

exports.checkout = async (req, res, next) => {
    let error;
    let status;
    try {
        const { totalPriceNew, token } = req.body;
        console.log('TOTAL PRICE:', totalPriceNew.toFixed(2));
        const customer = await
            stripe.customers.create({
                email: token.email,
                source: token.id
            });

        const idempotencyKey = uuid();
        const charge = await stripe.charges.create(
            {
                amount: parseInt(totalPriceNew),
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: `Phrchased ${parseInt(totalPriceNew)}$`,
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            },
            {
                idempotencyKey
            }

        );
        console.log("Charge:", { charge });
        status = "success";
    } catch (error) {
        console.log(error);
        status = "failure"
    }
    res.json({ error, status });
};

exports.newOrder = (req, res, next) => {
    const email = req.body.order.userDetails.email;
    const order = new Order(req.body.order);
    order.save()
        .then(result => {
            // console.log('Result:', result);
            res.status(200).json({ message: 'success', orderId: result._id });
            return transporter.sendMail({
                to: email,
                from: 'sharonzissu10@gmail.com',
                subject: 'Thank You for your order!',
                html: `
                <h1>You successfully signed up!</h1>
                <p>Click this <a href="${process.env.FRONT_URL}/orders">link</a> to go to your Orders Page</p>
                `
            }).catch(err => console.log(err));
        })
        .catch(err => console.log(err))


};

exports.getOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    console.log('ORDER:', orderId);
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                const error = new Error('Order with this id not found!');
                error.statusCode = 401;
                throw error;
            }
            res.status(200).json({ order: order });
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {

    Order.find({ userId: req.userId })
        .then(orders => {
            console.log(orders);
            res.status(200).json({ orders: orders });
        })
        .catch(err => console.log(err));
};

exports.resetCart = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }
            user.cart.items = [];
            return user.save();
        })
        .then(user => {
            res.status(200).json({ message: 'success' });
        })
        .catch(err => console.log(err));
};
// exports.getCart = (req, res, next) => {
//     req.user
//         .populate('cart.items.productId')
//         .then(product => {

//         })
// }
