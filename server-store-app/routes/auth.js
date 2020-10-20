
const { body } = require('express-validator/check');
const express = require("express");

const authController = require("../controllers/auth");

const User = require('../models/user');

const router = express.Router();


router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please Enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email address already exists!')
                        }
                    });
            }),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ], authController.signup);

router.post('/login', authController.login);



router.post('/reset-password', authController.resetPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;
