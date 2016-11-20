'use strict';
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('../config.json');
const request = require('request');

class Controller extends TelegramBaseController {

    handle($){
        if ($.message.text == '/start') return $.sendMessage(
            'Hello, I am Near Store bot!\n' +
            'You can use me to buy something in the store on your way.\n' +
            'To do this just send me your location!');
        if ($.message.location == null) return $.sendMessage(
            'Please send me your current location and I\'ll find something for you!');
        let location = $.message.location;
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
            if (result.error) {
                return $.sendMessage('Error: ' + result.error);
            }
            apiFindResponse($, result.result)
        });
    }
}

function apiFindResponse($, result) {
    if (result.length == 0) return $.sendMessage("No retailers found");
    let queue = [() => $.sendMessage('Following retailers found:')];
    let menuLayout = [];
    result.forEach(r => {
        queue.push(()=> $.sendMessage('Company: ' + r.company)
            .then(()=>$.sendLocation(r.coordinates.lat, r.coordinates.long)));
        addMenuEntry($, menuLayout, r);
    });
    queue.push(() => $.runInlineMenu({
        method: 'sendMessage',
        params: ['Select company:'],
        menu: menuLayout
    }));
    next(queue);
}

function addMenuEntry($, menu, entry) {
    menu.push({
        'text': entry.company,
        'callback': ()=> {
            retailerMenuSelect($, entry._id);
        }
    });
}

function retailerMenuSelect($, retailerID) {
    apiRequest('getGoods', {
        companyID: retailerID
    }, (err, result) => {
        if (err) {
            console.log(err);
            return $.sendMessage('Server error occured. Please try again later');
        }
        if (result.error) {
            return $.sendMessage('Error: ' + result.error);
        }
        let order = {goods: []};
        let menuLayout = [{
            'text': 'reset',
            'callback': () => resetOrder(order)
        }, {
            'text': 'order',
            'callback': () => confirmOrder($, order)
        }];
        result.result.forEach(r => {
            menuLayout.push({
                'text': '₽' + r.price + ' ' + r.name + '(' + r.desc + ')',
                'callback': () => addToOrder(order, r)
            });
        });
        $.runInlineMenu({
            method: 'sendMessage',
            params: ['Make order:'],
            menu: menuLayout
        })
    });
}

function resetOrder(order){
    order.goods = [];
}

function confirmOrder($, order){
    $.sendMessage('your order is:\n' +
        order.goods.map(g => `₽${g.price} ${g.name} (${g.desc})`).join('\n')).then(()=>{
        let menuLayout = [{
            'text': 'YES',
            'callback': () => performOrder($, order)
        }, {
            'text': 'NO',
            'callback': () => {}
        }];
        $.runInlineMenu({
            method: 'sendMessage',
            params: ['Confirm?'],
            layout: 2,
            menu: menuLayout
        })
    });
}

function performOrder($, order) {
    apiRequest('order', {
        goods: order.goods
    }, (err, result) => {
        if (err) {
            console.log(err);
            return $.sendMessage('Server error occured. Please try again later');
        }
        if (result.error) {
            return $.sendMessage('Error: ' + result.error);
        }
        $.sendMessage(`Your pin code is ${result.result}\nCome back again!`);
    });
}

function addToOrder(order, good){
    order.goods.push(good);
}

function next(queue) {
    function _next() {
        if (!queue.length) return;
        let func = queue.shift();
        if (!queue.length) func();
        else func().then(_next);
    }
    _next();
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
