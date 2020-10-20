const Product = require("../models/product");
const { validationResult } = require('express-validator/check');
const fs = require('fs');

// exports.getAddProduct = (req, res, next) => {
//     res.redirect("http://localhost:3000/admin/add-product");
// };

exports.getProducts = (req, res, next) => {

    category = req.body.category;
    brand = req.body.brand;
    department = req.body.department;

    const currentPage = req.query.page || 1;
    const perPage = 4;
    let totalItems;

    let filter;

    if (!category && !brand && !department) {
        filter = null;
    } else if (!category && !brand && department) {
        filter = { department: department };
    } else if (!category && brand && !department) {
        filter = { brand: brand };
    } else if (category && !brand && !department) {
        filter = { category: category };
    } else if (category && !brand && department) {
        filter = { category: category, department: department };
    } else if (category && brand && !department) {
        filter = { category: category, brand: brand };
    } else if (!category && brand && department) {
        filter = { department: department, brand: brand };
    } else {
        filter = { category: category, brand: brand, department: department };
    }
    Product.find(filter).countDocuments()
        .then(count => {
            totalItems = count;
            return Product.find(filter)
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then(products => {
            res.status(200).json({ message: 'Fetched products successfully', products: products, totalItems: totalItems });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.postAddProduct = (req, res, next) => {
    // console.log('IMAGEEE', req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const { category, department, title, brand, description, price } = req.body;
    // const imageUrl = req.file.path.replace("\\", "/");
    // console.log('PATHHHH', req.file.path);
    // console.log(req.userId);

    const product = new Product({
        category: category,
        department: department,
        title: title,
        brand: brand,
        price: price,
        description: description,
        image: req.file.path,
        price: price,
        userId: req.userId
    });
    product
        .save()
        .then((product) => {
            // console.log("Created Product");
            // console.log(result);
            res.status(200).send(product._id);
            // res.redirect("http://localhost:3000/admin/products");
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    // console.log(editMode);
    if (!editMode) {
        // console.log('YESSSSSS');
        return res.send('this is not edit mode');
    }
    const prodId = req.params.productId;
    // console.log(prodId);
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.send('No Product found');
            }
            res.status(200).send(product);

        })
        .catch((err) => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;

    const updatedCategory = req.body.category;
    const updatedDepartment = req.body.department;
    const updatedTitle = req.body.title;
    const updatedBrand = req.body.brand;
    const updatedDesc = req.body.description;
    const updatedPrice = req.body.price;

    Product
        .findById(prodId)
        .then(product => {
            if (req.file) {
                fs.unlink(product.image, err => {
                    console.log(err);
                });
                product.image = req.file.path;
            }
            product.category = updatedCategory;
            product.department = updatedDepartment;
            product.brand = updatedBrand;
            product.title = updatedTitle;
            product.description = updatedDesc;
            product.price = updatedPrice;
            return product.save();
        })
        .then(productUpdated => {
            // console.log("Updated Product");
            // console.log(productUpdated);
            // res.json(productUpdated);
            // res.status(200).send(productUpdated);
            // res.write(JSON.stringify(productUpdated));
            res.status(200).send(productUpdated);

            // console.log(res.status);

        })
        .catch(err => console.log(err))
};


exports.postDeleteProduct = (req, res, next) => {

    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then((productDeleted) => {
            fs.unlink(productDeleted.image, err => {
                console.log(err);
            });
            res.status(200).json({ message: 'Destroyed Product', productDeleted: productDeleted });

        })
        .catch((err) => console.log(err));
};
