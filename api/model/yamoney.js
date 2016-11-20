'use strict';

const mongo = require('../db');
const async = require('async');

function setToken(userID, token, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            db.collection('yamoney').update({userID}, {$set: {token}}, {upsert: true}, cb);
        }
    ], (err) => {
        if (!db) return callback(err);
        db.close(() => { callback(err); });
    });
}

function getToken(userID, callback) {
    let db = null;
    async.waterfall([
        cb => mongo.mongo_connect(cb),
        (_db, cb) => {
            db = _db;
            db.collection('yamoney').findOne({userID}, cb);
        }
    ], (err, object) => {
        if (!db) return callback(err);
        db.close(() => {
            callback(err, (object) ? object : undefined)
        });
    });
}

module.exports = {
    getToken,
    setToken
};