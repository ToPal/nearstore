'use strict';

const config = require('../config.json');
const yamoney = require('../model/yamoney');
const yandexMoney = require("yandex-money-sdk");

function redirectHandler(req, res) {
    console.log('redirect handler', req.query);
    if (req.query.error) {
        console.log('Redirect handler:', req.query.error, req.query.error_description);
        return res.status(500).json({error: req.query.error});
    }
    yandexMoney.Wallet.getAccessToken(config.yamoney.app_id, req.query.code,
        config.yamoney.redirect_uri, '', function (err, result) {
            if (err||result.error) {
                console.log('getAccessToken err', err&&err.message||result.error);
                return res.send('Error: '+(err&&err.message||result.error));
            }
            yamoney.setToken(req.query.instance_id, result,
                () => res.send('Thanks! You can return to your order in Telegram'));
        });
}

module.exports = {
    redirectHandler
};