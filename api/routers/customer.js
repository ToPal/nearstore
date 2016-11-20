'use strict';

const model = require('../model/customer');
const retailers = require('../model/retailer');
const yamoney = require('../model/yamoney');
const config = require('../config.json');
const async = require('async');
const mongo = require('../db');
const yandexMoneySDK = require("yandex-money-sdk");

function find(req, res) {
    if (!req.query.coordinates){
        return res.json({error: 'missing coordinates', result: false});
    }
    if (!req.query.coordinates.long || !req.query.coordinates.lat) {
        return res.json({error: 'incorrect coordinates format', result: false});
    }
    let searchString = req.query.searchString || '';
    model.find(req.query.coordinates, searchString, (err, result) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        return res.json({error: false, result: result});
    });
}

function getGoods(req, res) {
    console.log(req.query);
    if (!req.query.companyID){
        return res.json({error: 'missing company ID', result: false});
    }
    model.getGoods(req.query.companyID, (err, goods) => {
        if (err) {
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        return res.json({error: false, result: goods});
    });
}

function order(req, res) {
    console.log('order', req.query);
    if (!req.query.goods || !req.query.userID){
        return res.json({error: 'missing parameters', result: false});
    }
    if (!Array.isArray(req.query.goods) || !req.query.goods.length) {
        return res.json({error: 'No goods to order', result: false});
    }
    let api;
    async.waterfall([
        cb => yamoney.getToken(req.query.userID, cb),
        (token, cb) => {
            console.log('get token', token);
            if (!token) {
                let aurhUrl = yandexMoneySDK.Wallet
                    .buildObtainTokenUrl(config.yamoney.app_id, config.yamoney.redirect_uri+'?userID='+req.query.userID,
                    ['payment-p2p']) + '&instance_name=' + req.query.userID;
                res.json({error: false, result: {authUrl: aurhUrl}});
                return cb(new Error('stop'));
            }
            api = new yandexMoneySDK.Wallet(token.token);
            let retailerID = new mongo.ObjectID(req.query.goods[0].retailerID);
            retailers.getRetailerInfo(retailerID, cb);
        }, (retailer, cb) => {
            console.log('retailer info:', retailer);
            if (!retailer) {
                res.json({error: 'Incorrect retailer data', result: false});
                return cb(new Error('stop'));
            }
            let sum = req.query.goods.reduce((a, x)=>a + parseFloat(x.price), 0);
            let options = {
                "pattern_id": "p2p",
                "to": ''+retailer.yaAccount,
                "amount_due": sum.toFixed(2),
                "comment": "payment for order",
                "message": "have a nice day"
            };
            console.log('options to pay:', options);
            api.requestPayment(options, cb);
        }, function(data, temp, cb) {
            console.log('payment result:', arguments);
            if(data.status !== "success") return cb(new Error(data.status));
            const request_id = data.request_id;
            api.processPayment({request_id}, cb);
        }, function (res, temp, cb) {
            console.log('processPaymentFinished', arguments);
            model.order(req.query.goods, cb);
        }, (pin, cb) => {
            res.json({error: false, result: pin});
            cb(null);
        }
    ], function(err) {
        if (err&&err.message&&err.message!='stop')
            return res.json({error: err.message, result: false});
    });
}

module.exports = {
    find,
    getGoods,
    order
};