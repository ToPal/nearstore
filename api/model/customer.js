'use strict'

const mongo = require('../db');
const async = require('async');

const latGrad = 0.009009009;
const longGrad = 0.017889088;

function find(coordinates, searchString, callback) {
    let minLat = +coordinates.lat - latGrad, maxLat = +coordinates.lat + latGrad;
    let minLong = +coordinates.long - longGrad, maxLong = +coordinates.long + longGrad;
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('retailers');
            usersCollection.find({'coordinates.long' : {$lt: maxLong, $gt: minLong},
                        'coordinates.lat' : {$lt: maxLat, $gt: minLat}}).toArray(cb);
        }
    ], (err, retailers) => {
        if (!db) return callback(err);
        db.close(() => {
            retailers.forEach(retailer => {
                delete retailer.password;
                delete retailer.username;
            });
            callback(err, retailers)
        });
    });
}

function getGoods(companyID, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('goods');
            usersCollection.find({'retailerID' : new mongo.ObjectID(companyID)}).toArray(cb);
        }
    ], (err, goods) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, goods)
        });
    });
}

function order(_goods, callback) {
    let goods = Array.isArray(_goods) ? _goods : [_goods];
    if (goods.length == 0) {
        callback('empty order');
    }
    let order = {};
    order.retailerID = new mongo.ObjectID(goods[0].retailerID);
    order.goods = goods.map(g => new mongo.ObjectID(g.goodID));
    order.pin = Math.floor(Math.random() * 10000);
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('orders');
            usersCollection.insertOne(order, cb);
        }
    ], (err) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, order.pin)
        });
    });
}

module.exports = {
    find,
    getGoods,
    order
};