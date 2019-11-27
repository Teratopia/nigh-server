const mongoose = require('mongoose');

var venuePromotionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    name : String,
    imageId : String,
    fromDate : Date,
    toDate : Date,
    isActive : Boolean
   });

module.exports = mongoose.model('VenuePromotion', venuePromotionSchema);