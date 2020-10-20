const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('REQQQQQQQQQQQQQQQQ', req.userId);
    if (req.userId.toString() === '5f3bbbafab13683e40829711') {
        next();
    } else {
        const error = new Error('Not admin!');
        error.statusCode = 404;
        throw error;
    }
};