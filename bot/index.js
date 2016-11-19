'use strict';

const Telegram = require('telegram-node-bot');
const config = require('./config.json');
const AuthController = require('./router/AuthController');

const authController = new AuthController();
const tg = new Telegram.Telegram(config.bot_token);

tg.router.any(authController);