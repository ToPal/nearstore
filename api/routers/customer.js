'use strict';

const model = require('../model/customer');

function find(req, res) {
    if (!req.query.coordinates){
        return res.json({error: 'missing coordinates', result: false});
    }
    if (!req.query.coordinates.long || !req.query.coordinates.lat) {
        return res.json({error: 'incorrect coordinates format', result: false});
    }
    let searchString = req.query.searchString || '';
    model.find(req.query.coordinates, searchString, (err, result) => {
        if (err){
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        return res.json({error: false, result: result});
    });
}

function getGoods(req, res) {
    if (!req.query.companyID){
        return res.json({error: 'missing company ID', result: false});
    }
    model.getGoods(req.query.companyID, (err, goods) => {
        if (err) {
            console.log(err);
            return res.json({error: 'DB error', result: false});
        }
        return res.json({error: false, result: goods});
    });
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