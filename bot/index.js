'use strict';

const Telegram = require('telegram-node-bot');
const config = require('./config.json');
const Controller = require('./router/Controller');

const controller = new Controller();
const tg = new Telegram.Telegram(config.bot_token, {
    workers: 1,
    webAdmin: { port: 7778,host: 'localhost'} });

tg.router.any(controller);