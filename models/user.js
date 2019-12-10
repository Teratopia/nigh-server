const mongoose = require('mongoose');

var Status = mongoose.Schema({
    activityName : String,
    activityDescription : String,
    active : Boolean,
    passive : Boolean,
    lastModified : Date,
    description : String,

    friendsAreNear : Boolean,
    friendsBecomeActive : Boolean,
    aPoolTableIsNear : Boolean,
    anActiveUserIsNear : Boolean,
    shareMyStatusWithFriends : Boolean,
    shareMyLocationWithFriends : Boolean,
    showFriendsMyLocationOnMap : Boolean,
    notifyFriendsIfNear : Boolean,
    notifyAnyUserIfNear : Boolean,

    league : Boolean,
    casual : Boolean
   });

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    lastLogin : Date,
    username : String,
    password : String,
    //profilePicture : { data : Buffer, contentType : String},
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    picture : String,
    isActive : Boolean,
    activeVenueId : String,
    deviceIds : [String],
    pnToken : String,
    gender : String,
    sexuality : String,
    occupation : String,
    relationshipStatus : String,
    spiritAnimal : String,
    birthdate : Date,
    email : String,
    profileDescription : String,
    friendsIdList : [String],
    blockedFriendsIdList : [String],
    statuses : [Status]
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);