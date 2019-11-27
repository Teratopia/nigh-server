const mongoose = require('mongoose');
import User from './user';

const friendRequest = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    responseDate : Date,
    requester : User.schema,
    requestee : User.schema,
    accepted : Boolean,
    message : String
});

module.exports = mongoose.model('FriendRequest', friendRequest);

/*
requester : User.schema,
    requestee : User.schema,
*/