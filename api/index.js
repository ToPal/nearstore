const express = require('express');
const app = express();
const config = require('./config.json');

app.use(express.static('static'));
require('./routers')(app);

app.listen(config.port, function () {
    console.log('Nearstore API listening on port %s!', config.port);
});