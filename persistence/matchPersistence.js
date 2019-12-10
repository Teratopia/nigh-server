//createOrFetchMatch
/*
var Message = new Schema({
     userId: String,
     createDate: Date,
     text : String
    });

const matchSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    matchDate : Date,
    userOne : String,
    userTwo : String,
    messages : [Message]
});

*/

const mongoose = require('mongoose');
const Match = require('../models/match');
const User = require('../models/user');
const notificationHandler = require('../notifications/notificationHandler');

const createOrFetchMatch = (userId, matchUserId, event, onSuccess, onFailure) => {
    Match.findOne({$or : [
        {
        'userOne._id' : userId,
        'userTwo._id' : matchUserId
        }, {
        'userOne._id' : matchUserId,
        'userTwo._id' : userId
        }
    ]}).then(result => {
        console.log('createOrFetchMatch 1, result = ');
        console.log(result);
        if(!result){
            createMatch(userId, matchUserId, event, onSuccess, onFailure);
        } else {
            onSuccess(result);
        }
    });
    
}

const createMatch = (userId, matchUserId, event, onSuccess, onFailure) => {
    console.log('createMatch event = ');
    console.log(event);
    User.findById(userId).then(userOne => {
        User.findById(matchUserId).then(userTwo => {
            const match = new Match({
                _id : mongoose.Types.ObjectId(),
                matchDate : new Date(),
                userOne : userOne,
                userTwo : userTwo,
                messages : []
            });
            if(event){
                match.messages = [{
                    userId : matchUserId,
                    createDate : new Date(),
                    text : event.description
                }];
            }
            match.save().then(doc => {
                onSuccess(doc);
            }).catch(err => {
                onFailure(err);
            });
        });
    });
}

const findAllMatchesByUserId = (userId, onSuccess, onFailure) => {
    Match.find({ 'userOne._id' : userId })
    .then(results => {
        onSuccess(results)})
    .catch(err => {
        onFailure(err);
    });
}

const findMatchById = (matchId, onSuccess, onFailure) => {
    Match.findById(matchId)
    .then(result => {
        onSuccess(result)})
    .catch(err => {
        onFailure(err);
    });
}

const addMessageToMatch = (matchId, message, onSuccess, onFailure) => {
    console.log('addMessageToMatch 1, matchID = '+matchId+', message = ');
    console.log(message);
    Match.findById(matchId)
    .then(result => {
        if(result){
            console.log('result:');
            console.log(result);
            result.updateOne({
                $push : {messages : {
                    userId: message.user._id,
                    createDate: message.createdAt,
                    text : message.text
                }}
            }).then(result => {
                //sendNotification(pnToken, text, payload = {}, expSecs = 30)
                var recipient = result.userOne === message.user._id ? result.userTwo : result.userOne;
                if(recipient.pnToken){
                    notificationHandler.sendNotification(recipient.pnToken, 'New message from '+message.username+'!', {}, 120);
                }
                onSuccess(result);
            }).catch(err => {
                onFailure(err);
            });
        } else {
            onFailure('No match found.');
        }
    }).catch(err => {
        onFailure(err);
    });
}

export default { createOrFetchMatch, findAllMatchesByUserId, addMessageToMatch, findMatchById }