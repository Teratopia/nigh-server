const mongoose = require('mongoose');

const competitionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    endDate : Date,
    acceptedDate : Date,
    challengerId : String,
    accepterId : String,
    venueId : String,
    rules : {},
    challengerResultClaim : String,
    accepterResultClaim : String,
    gameType : String,
    challengerConfirmed : Boolean,
    accepterConfirmed : Boolean
});

module.exports = mongoose.model('Competition', competitionSchema);