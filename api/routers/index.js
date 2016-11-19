'use strict';

const retailer = require('./retailer');
const customer = require('./customer');

module.exports = function(app) {
    app.get('/register', retailer.register);
    app.get('/addGoods', retailer.addGoods);
    app.get('/find', customer.find);
    app.get('/getGoods', customer.getGoods);
    app.get('/order', customer.order);
};