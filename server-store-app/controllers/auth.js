const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.NODEMAILER_KEY
    }
}))

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const { email, name, password } = req.body;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name,
                cart: { items: [] }
            });
            return user.save()
        })
        .then(user => {
            res.status(201).json({ message: 'User created', user: user });
            return transporter.sendMail({
                to: email,
                from: 'sharonzissu10@gmail.com',
                subject: 'Sign up Succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            }).catch(err => console.log(err));
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};


exports.login = (req, res, next) => {

    const { email, password } = req.body;

    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Looks like either your email address or password were incorrect. Wanna try again?');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Looks like either your email address or password were incorrect. Wanna try again?');
                error.statusCode = 401;
                throw error;
            }
            let isAdmin;
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
                `${process.env.JWT_KEY}`,
                { expiresIn: '1h' }
            );
            if (loadedUser._id.toString() === '5f3bbbafab13683e40829711') {
                req.isAdmin = true;
                isAdmin = true;
            } else {
                req.isAdmin = false;
                isAdmin = false;
            }
            res.status(200).json({ token: token, userId: loadedUser._id.toString(), expiresIn: 3600, isAdmin: isAdmin, name: loadedUser.name });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};

exports.resetPassword = (req, res, next) => {
    console.log(req.body.email);
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then(user => {
                console.log('USER USER USER USER USER', user);
                if (!user) {
                    const error = new Error("User don't exists with that email");
                    error.statusCode = 401;
                    throw error;
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();

            })
            .then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'sharonzissu10@gmail.com',
                    subject: 'Password Reset',
                    html:
                        `
                <p>You requested a password reset</p>
                <p>Click this <a href="${process.env.FRONT_URL}/new-password/${token}">link</a> to set a new password</p>
                `
                });
                res.json({ message: 'check your email' });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    })
};

// exports.getNewPassword = (req, res, next) => {
//     const token = req.params.token;
//     User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
//         .then(user => {

//         })
//         .catch(err => console.log(err));
// };

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const token = req.body.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                const error = new Error('Try again! session expired');
                error.statusCode = 401;
                throw error;
            }
            returnedUser = user;
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save();
                })
                .then(savedUser => {
                    res.status(200).json({ message: 'Password updated successfully!' });
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};