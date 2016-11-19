'use strict';
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;

class CheckAuthController extends TelegramBaseController {
    handle($){
        $.sendMessage(
            'Hello, I am Near Store bot!\n' +
            'You can use me to buy something in the store on your way!');
    }
}

module.exports = CheckAuthController;
