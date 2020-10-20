const path = require('path');

const express = require('express');
const isAuth = require('../middleware/is-auth');


const shopController = require('../controllers/shop');

const router = express.Router();

router.post('/men', isAuth, shopController.getProducts);

router.post('/women', isAuth, shopController.getProducts);

router.get('/name', isAuth, shopController.getUserName);

router.get('/products/:productId', isAuth, shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-product', isAuth, shopController.postCartDeleteProduct);

router.post('/cart-delete-one-product', isAuth, shopController.postCartDeleteOneProduct);

router.post('/checkout', isAuth, shopController.checkout);

router.post('/new-order', isAuth, shopController.newOrder);

router.get('/order-complete/:orderId', isAuth, shopController.getOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/reset-cart', isAuth, shopController.resetCart);





module.exports = router;
