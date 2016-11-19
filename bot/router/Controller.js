'use strict';
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('../config.json');
const request = require('request');

class Controller extends TelegramBaseController {

    handle($){
        if ($.message.text == '/start') return $.sendMessage(
            'Hello, I am Near Store bot!\n' +
            'You can use me to buy something in the store on your way!');
        if ($.message.location == null) return $.sendMessage(
            'Please send me your current location and I\'ll find something for you!');
        let location = $.message.location;
        console.log(location);
        apiRequest('find', {
            coordinates: {
                long: location.longitude,
                lat: location.latitude
            }
        }, (err, result) => {
            if (err) {
                console.log(err);
                return $.sendMessage('Server error occured. Please try again later');
            }
            console.log(result);
        });
    }
}

function apiRequest(method, params, cb) {
    request.get(config.api_server + ":" + config.api_port + "/" + method, {
        qs: params,
        json: true
    }, (err, response, result) => {
        cb(err, result);
    });
}

module.exports = Controller;
