const mongoose = require('mongoose');

const venueLeagueSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    venueId : String,
    createDate : Date,
    startDate : Date,
    endDate : Date,
    firstPlacePrizeTitle : String,
    firstPlacePrizeDescription : String,
    firstPlacePrizeImageId : String,
    firstPlaceWinnerId : String,
    secondPlacePrizeTitle : String,
    secondPlacePrizeDescription : String,
    secondPlacePrizeImageId : String,
    secondPlaceWinnerId : String,
    thirdPlacePrizeTitle : String,
    thirdPlacePrizeDescription : String,
    thirdPlacePrizeImageId : String,
    thirdPlaceWinnerId : String,
    timeFrame : String
});

module.exports = mongoose.model('VenueLeague', venueLeagueSchema);