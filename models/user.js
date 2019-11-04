const mongoose = require('mongoose');

var Status = mongoose.Schema({
    activityName : String,
    activityDescription : String,
    active : Boolean,
    passive : Boolean,
    lastModified : Date,
    description : String
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
    deviceIds : [String],
    gender : String,
    sexuality : String,
    occupation : String,
    relationshipStatus : String,
    spiritAnimal : String,
    birthdate : Date,
    email : String,
    profileDescription : String,
    statuses : [Status]
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);