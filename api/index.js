const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('static'));
require('./routers')(app);

app.listen(config.port, function () {
    console.log('Nearstore API listening on port %s!', config.port);
});