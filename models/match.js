const mongoose = require('mongoose');
import User from './user';

var Message = mongoose.Schema({
     userId: String,
     createDate: Date,
     text : String
    });

const matchSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    matchDate : Date,
    userOne : User.schema,
    userTwo : User.schema,
    messages : [Message]
});

module.exports = mongoose.model('Match', matchSchema);