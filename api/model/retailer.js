'use strict';

let mongo = require('../db');
let async = require('async');

function addCompany(username, password, coordinates, company, yaAccount, callback) {
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (db, cb) => {
            let usersCollection = db.collection('retailers');
            usersCollection.insertOne({
                username: username,
                password: password,
                coordinates: {long: +coordinates.long,
                    lat: +coordinates.lat},
                company: company,
                yaAccount: yaAccount
            }, (err) => {cb(err, db);});
        },
        (db, cb) => db.close(cb)
    ], callback);
}

function getUserName(username, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('retailers');
            usersCollection.findOne({username: username}, cb);
        }
    ], (err, object) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, (object) ? object.username : undefined)
        });
    });
}

function getRetailer(username, password, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('retailers');
            usersCollection.findOne({username: username, password: password}, cb);
        }
    ], (err, object) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, (object) ? object : undefined)
        });
    });
}

function getRetailerInfo(retailerID, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('retailers');
            usersCollection.findOne({_id: retailerID}, cb);
        }
    ], (err, object) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, (object) ? object : undefined)
        });
    });
}

function addGoods(retailer, _goods, callback) {
    let goods = Array.isArray(_goods) ? _goods : [_goods];
    let db = undefined;
    if (goods.length == 0) callback('goods array is empty');
    goods.forEach(good => {
        good.price = +good.price;
        good.retailerID = retailer._id;
    });
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('goods');
            usersCollection.insertMany(goods, cb);
        },
        (objects, cb) => {
            if (!db) cb('DB error');
            db.close(cb);
        }
    ], callback);
}

function getOrders(retailer, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let usersCollection = db.collection('orders');
            usersCollection.find({retailerID: new mongo.ObjectID(retailer._id)}).toArray(cb);
        }
    ], (err, object) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, (object) ? object : undefined)
        });
    });
}

function accomplishOrder(retailer, order, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            let collection = db.collection('orders');
            collection.updateOne({_id: new mongo.ObjectID(order), retailerID: retailer._id},
                {$set: {complete: true}}, cb);
        }
    ], (err, res) => {
        if (db) db.close();
        callback(err, res.matchedCount);
    });
}

module.exports = {
    addCompany,
    getUserName,
    getRetailer,
    addGoods,
    getOrders,
    accomplishOrder,
    getRetailerInfo
};