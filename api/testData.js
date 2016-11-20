const retailerModel = require('./model/retailer');

function handler(err) {
    if (err) return console.log(err);
}

retailerModel.addCompany('teremok', 'teremok', {long: 30.0, lat: 60.0}, 'TEREMOK', 410011398386747, handler);
retailerModel.addCompany('pirozhkoviyDvorik', 'pd2016', {long: 30.386, lat: 59.984}, 'Pirozhkoviy dvorik', 410011398386747, handler);
retailerModel.addCompany('subway', 'super-sub', {long: 30.385, lat: 59.982}, 'Subway', 410011398386747, handler);
setTimeout(()=>{
    retailerModel.getRetailer('teremok', 'teremok', teremokHandler);
    retailerModel.getRetailer('pirozhkoviyDvorik', 'pd2016', pdHandler);
    retailerModel.getRetailer('subway', 'super-sub', subwayHandler);
}, 100);

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