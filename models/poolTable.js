const mongoose = require('mongoose');

var poolTableSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    lastUpdated : Date,
    name : String,
    price : Number,
    priceUnit : String,
    size : String,
   });

module.exports = mongoose.model('PoolTable', poolTableSchema);