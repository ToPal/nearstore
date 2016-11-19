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
            usersCollection.findOne({'retailerID' : new mongo.ObjectID(companyID)}, cb);
        }
    ], (err, goods) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, goods)
        });
    });
}

module.exports = {
    find,
    getGoods
}