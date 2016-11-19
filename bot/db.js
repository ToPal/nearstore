'use strict';
const mongodb = require('mongodb');
const config = require('./config.json');
const util = require('util');

function get_DB_url(host, port, dbName) {
    return util.format('mongodb://%s:%s/%s', host, port, dbName);
}
let url = get_DB_url(config.db_host, config.db_port, config.db_name);

module.exports = {
    mongo_connect: (cb) => mongodb.connect(url, cb),
    ObjectID: mongodb.ObjectID
};