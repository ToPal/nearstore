'use strict';

const retailer = require('./retailer');
const customer = require('./customer');

module.exports = function(app) {
    app.post('/register', retailer.register);
    app.get('/addGoods', retailer.addGoods);
    app.get('/getOrders', retailer.getOrders);
    app.get('/accomplishOrder', retailer.accomplishOrder);
    app.get('/auth', retailer.auth);
    app.get('/find', customer.find);
    app.get('/getGoods', customer.getGoods);
    app.get('/order', customer.order);
};