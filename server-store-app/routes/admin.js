const path = require("path");

const { body } = require('express-validator/check');
const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

// router.get("/add-product", adminController.getAddProduct);



router.post("/add-product", isAuth, isAdmin, fileUpload.single('image'),
    [
        body('title')
            .trim()
            .not()
            .isEmpty(),
        body('description')
            .trim()
            .isLength({ min: 5 })
            .not()
            .isEmpty(),
        body('price')
            .isFloat()
    ],
    adminController.postAddProduct);

router.post('/products', isAuth, isAdmin, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, isAdmin, adminController.getEditProduct);

router.post('/edit-product', isAuth, isAdmin, fileUpload.single('image'),
    [
        body('title')
            .trim()
            .not()
            .isEmpty(),
        body('description')
            .trim()
            .isLength({ min: 5 })
            .not()
            .isEmpty(),
        body('price')
            .isFloat()
    ], adminController.postEditProduct);

router.post('/delete-product', isAuth, isAdmin, adminController.postDeleteProduct);



module.exports = router;
