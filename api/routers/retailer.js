'use strict';
let model = require('../model/retailer')

function register(req, res) {
    console.log(req.query);
    if (!req.query.company || !req.query.coordinates || !req.query.username || !req.query.password) {
        return res.json({error: 'missing username, password, coordinates or company name', result: false});
    }
    if (!req.query.coordinates.long || !req.query.coordinates.lat) {
        return res.json({error: 'incorrect coordinates format', result: false});
    }
    model.getUserName(req.query.username, (err, username) => {
        if (err) {
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        if (username) return res.json({error: 'username already taken', result: false});
        model.addCompany(req.query.username, req.query.password, req.query.coordinates, req.query.company, (err) => {
            if (err) {
                console.log(err);
                return res.json({error: 'DB error', result: false})
            }
            return res.json({error: false, result: true})
        })
    });
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
    getOrders
};