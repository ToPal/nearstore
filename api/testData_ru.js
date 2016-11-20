const retailerModel = require('./model/retailer');

function handler(err) {
    if (err) return console.log(err);
}

retailerModel.addCompany('теремок', 'теремок', {long: 30.371, lat: 60.009}, 'Теремок', 410011398386747, handler);
retailerModel.addCompany('пироги', 'пг2016', {long: 30.373, lat: 60.008}, 'Пирожковый дворик', 410013539542859, handler);
retailerModel.addCompany('subway', 'supersub', {long: 30.385, lat: 59.982}, 'Subway', 410011398386747, handler);
setTimeout(()=>{
    retailerModel.getRetailer('теремок', 'теремок', teremokHandler);
    retailerModel.getRetailer('пироги', 'пг2016', pdHandler);
    retailerModel.getRetailer('subway', 'supersub', subwayHandler);
}, 100);

function teremokHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.60,
        name: 'Блин',
        desc: 'Со сгущенкой',
        retailerID : retailer._id
    }, {
        price : 0.40,
        name: 'Чай',
        desc: 'Чёрный или зелёный',
        retailerID : retailer._id
    }, {
        price : 0.75,
        name: 'Салат',
        desc: 'Оливье',
        retailerID : retailer._id
    }], handler);
}

function pdHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.69,
        name: 'Пирог',
        desc: 'Черничный',
        retailerID : retailer._id
    }, {
        price : 0.50,
        name: 'Кофе',
        desc: 'Капучино или латте',
        retailerID : retailer._id
    }, {
        price : 0.80,
        name: 'Маффин',
        desc: 'С шоколадом',
        retailerID : retailer._id
    }], handler);
}

function subwayHandler(err, retailer) {
    if (err) return console.log(err);
    retailerModel.addGoods(retailer, [{
        price : 0.99,
        name: 'Саб дня',
        desc: 'С беконом',
        retailerID : retailer._id
    }, {
        price : 0.80,
        name: 'Капучино',
        desc: 'Всегда свежий',
        retailerID : retailer._id
    }, {
        price : 0.98,
        name: 'Ролл',
        desc: 'Салат в лаваше',
        retailerID : retailer._id
    }], handler);
}