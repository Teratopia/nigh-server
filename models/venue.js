const mongoose = require('mongoose');
import PoolTable from './poolTable';
import VenuePromotion from './venuePromotion';
import VenueLeague from './venueLeague';

const venueSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    lastLogin : Date,
    username : String,
    password : String,
    properName : String,
    lastDeviceId : String,
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    email : String,
    googlePlaceId : String,
    googleVicinity : String,
    poolTables : [PoolTable.schema],
    venuePromotions : [VenuePromotion.schema],
    adminIds : [String],
    pushNotificationPromotion : String,
    activeLeague : VenueLeague.schema,
    houseRules : {}
});

venueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Venue', venueSchema);