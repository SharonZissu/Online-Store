const User = require('./models/user');
// require('app/app/app.js')
// const cors = require('cors');
const fs = require('fs');
const path = require('path');

const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require('mongoose');



const app = express();



const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();

});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.im1am.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(result => {
        app.listen(process.env.PORT || 3001);
    })
    .catch(err => console.log(err));