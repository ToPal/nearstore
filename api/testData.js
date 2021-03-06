const retailerModel = require('./model/retailer');

function handler(err) {
    if (err) return console.log(err);
}

retailerModel.addCompany('teremok', 'teremok', {long: 30.371, lat: 60.009}, 'TEREMOK', 410011398386747, handler);
retailerModel.addCompany('pirozhkoviyDvorik', 'pd2016', {long: 30.373, lat: 60.008}, 'Pirozhkoviy dvorik', 410013539542859, handler);
retailerModel.addCompany('subway', 'super-sub', {long: 30.385, lat: 59.982}, 'Subway', 410011398386747, handler);
setTimeout(()=>{
    retailerModel.getRetailer('teremok', 'teremok', teremokHandler);
    retailerModel.getRetailer('pirozhkoviyDvorik', 'pd2016', pdHandler);
    retailerModel.getRetailer('subway', 'super-sub', subwayHandler);
}, 100);

function teremokHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.60,
        name: 'pancake',
        desc: 'delicious pancake',
        retailerID : retailer._id
    }, {
        price : 0.40,
        name: 'tea',
        desc: 'hot black tea',
        retailerID : retailer._id
    }, {
        price : 0.75,
        name: 'salad',
        desc: 'olivye',
        retailerID : retailer._id
    }], handler);
}

function pdHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.69,
        name: 'pie',
        desc: 'delicious pie',
        retailerID : retailer._id
    }, {
        price : 0.50,
        name: 'coffee',
        desc: 'awesome coffee',
        retailerID : retailer._id
    }, {
        price : 0.80,
        name: 'muffin',
        desc: 'Cause there\'s muffin you can do about it',
        retailerID : retailer._id
    }], handler);
}

function subwayHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.99,
        name: 'subway of the day',
        desc: 'bread and bacon',
        retailerID : retailer._id
    }, {
        price : 0.80,
        name: 'cappuccino',
        desc: 'best cappuccino ever',
        retailerID : retailer._id
    }, {
        price : 0.98,
        name: 'roll',
        desc: 'same as sub but rolled',
        retailerID : retailer._id
    }], handler);
}