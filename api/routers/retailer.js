'use strict';
let model = require('../model/retailer')

function register(req, res) {
    let data = req.body;
    if (!data.company || !data.coordinates || !data.username || !data.password || !data.yaAccount) {
        return res.json({error: 'missing username, password, coordinates, company name or yandex.money account', result: false});
    }
    if (!data.coordinates.long || !data.coordinates.lat) {
        return res.json({error: 'incorrect coordinates format', result: false});
    }
    model.getUserName(data.username, (err, username) => {
        if (err) {
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (username) return res.json({error: 'username already taken', result: false});
        model.addCompany(data.username, data.password, data.coordinates, data.company, data.yaAccount, (err) => {
            if (err) {
                console.log(err);
                return res.json({error: 'DB error', result: false})
            }
            return _auth(data.username, data.password, res);
        });
    });
}

function _auth(username, password, res) {
    model.getRetailer(username, password, (err, retailer) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (!retailer) return res.json({error: 'invalid username or password', result: false});
        return res.json({error: false, result: retailer});
    });
}

function auth(req, res) {
    if (!req.query.username || !req.query.password) {
        return res.json({error: 'missing username or password', result: false});
    }
    return _auth(req.query.username, req.query.password, res);
}

function addGoods(req, res) {
    if (!req.query.goods || !req.query.username || !req.query.password) {
        return res.json({error: 'missing username, password or goods', result: false});
    }
    model.getRetailer(req.query.username, req.query.password, (err, retailer) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (!retailer) return res.json({error: 'invalid username or password', result: false});
        model.addGoods(retailer, req.query.goods, (err) => {
            if (err){
                console.log(err);
                return res.json({error: 'DB error', result: false});
            }
            return res.json({error: false, result: true});
        });
    });
}

function accomplishOrder(req, res) {
    if (!req.query.orderID || !req.query.username || !req.query.password) {
        return res.json({error: 'missing username, password or order ID', result: false});
    }
    model.getRetailer(req.query.username, req.query.password, (err, retailer) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (!retailer) return res.json({error: 'invalid username or password', result: false});
        model.accomplishOrder(retailer, req.query.orderID, (err, updateCount) => {
            if (err){
                console.log(err);
                return res.json({error: 'DB error', result: false});
            }
            if (updateCount != 1) return res.json({error: 'Wrong order ID', result: false});
            return res.json({error: false, result: true});
        });
    });
}

function getOrders(req, res) {
    if (!req.query.username || !req.query.password) {
        return res.json({error: 'missing username or password', result: false});
    }
    model.getRetailer(req.query.username, req.query.password, (err, retailer) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (!retailer) return res.json({error: 'invalid username or password', result: false});
        model.getOrders(retailer, (err, orders) => {
            if (err){
                console.log(err);
                return res.json({error: 'DB error', result: false});
            }
            return res.json({error: false, result: orders});
        });
    });
}

module.exports = {
    register,
    addGoods,
    accomplishOrder,
    getOrders,
    auth
};