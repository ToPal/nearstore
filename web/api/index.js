'use strict';

const config = require('../config.json');
const request = require('request');

function api_request(method, opts, cb) {
    request(config.nearstore_api+'/'+method, opts, callback);
}