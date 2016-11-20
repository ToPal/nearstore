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
        config.yamoney.redirect_uri, function (err, token) {
            if (err) return console.log('getAccessToken err', err);
            yamoney.setToken(req.query.instance_id, token, () => res.json({}));
        });
}

module.exports = {
    redirectHandler
};