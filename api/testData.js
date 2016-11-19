const retailerModel = require('./model/retailer');

function handler(err) {
    if (err) return console.log(err);
}

retailerModel.addCompany('teremok', 'teremok', {long: 60.0, lat: 30.0}, 'TEREMOK', handler);
retailerModel.addCompany('pirozhkoviyDvorik', 'pd2016', {long: 60.1, lat: 29.99}, 'Pirozhkoviy dvorik', handler);
retailerModel.addCompany('subway', 'super-sub', {long: 60.05, lat: 30.012}, 'Subway', handler);
retailerModel.getRetailer('teremok', 'teremok', teremokHandler);
retailerModel.getRetailer('pirozhkoviyDvorik', 'pd2016', pdHandler);
retailerModel.getRetailer('subway', 'super-sub', subwayHandler);

function teremokHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 60,
        name: 'pancake',
        desc: 'delicious pancake',
        retailerID : retailer._id
    }, {
        price : 40,
        name: 'tea',
        desc: 'hot black tea',
        retailerID : retailer._id
    }, {
        price : 75,
        name: 'salad',
        desc: 'olivye',
        retailerID : retailer._id
    }], handler);
}

function pdHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 69,
        name: 'pie',
        desc: 'delicious pie',
        retailerID : retailer._id
    }, {
        price : 50,
        name: 'coffee',
        desc: 'awesome coffee',
        retailerID : retailer._id
    }, {
        price : 80,
        name: 'muffin',
        desc: 'Cause there\'s muffin you can do about it',
        retailerID : retailer._id
    }], handler);
}

function subwayHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 99,
        name: 'subway of the day',
        desc: 'bread and bacon',
        retailerID : retailer._id
    }, {
        price : 80,
        name: 'cappuccino',
        desc: 'best cappuccino ever',
        retailerID : retailer._id
    }, {
        price : 98,
        name: 'roll',
        desc: 'same as sub but rolled',
        retailerID : retailer._id
    }], handler);
}