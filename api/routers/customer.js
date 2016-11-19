'use strict';

function find(req, res) {
    if (!req.query.coordinates || !req.query.searchString){
        return res.json({error: 'missing coordinates or search string', result: false});
    }
    return res.send("OK!");
}

function getGoods(req, res) {
    if (!req.query.companyID){
        return res.json({error: 'missing company ID', result: false});
    }
    return res.send("OK!");
}

function order(req, res) {
    if (!req.query.goods){
        return res.json({error: 'missing goods', result: false});
    }
    return res.send("OK!");
}

module.exports = {
    find,
    getGoods,
    order
};