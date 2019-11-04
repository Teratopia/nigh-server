const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    initDate : Date,
    expDate : Date,
    hitLimit : Number,
    latitude : Number,
    longitude : Number,
    locationTitle : String,
    locationDescription : String,
    eventTitle : String,
    eventDescription : String,
    eventUnitTitle : String,
    eventUnitPrice : String,
    limitTo : [String]
});

module.exports = mongoose.model('Promotion', promotionSchema);