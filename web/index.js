const express = require('express');
const app = express();
const config = require('./config.json');

app.use('/', express.static('public'));
//require('./routers')(app);

app.listen(config.port, function () {
    console.log('Nearstore Web-service listening on port %s!', config.port);
});