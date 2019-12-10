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
import notificationHandler from '../notifications/notificationHandler';

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

async function addMessageToMatch(matchId, message, onSuccess, onFailure){
    console.log('addMessageToMatch 1, matchID = '+matchId+', message = ');
    console.log(message);

    var match = await Match.findById(matchId);
    if(match){
        console.log('match found, ', match);
        await match.updateOne({
            $push : {messages : {
                userId: message.user._id,
                createDate: message.createdAt,
                text : message.text
            }}});
        var updatedMatch = await Match.findById(matchId);
        if(updatedMatch.userOne._id === message.user._id){
                try{
                    var recipient = await User.findById(updatedMatch.userTwo._id);
                    await notificationHandler.sendNotification(recipient.pnToken, 'New message from '+updatedMatch.userOne.username+'!', {}, 120);
                } catch (e){
                    console.log('send notification error = ', e);
                }
        } else {
                try{
                    var recipient = await User.findById(updatedMatch.userOne._id);
                    await notificationHandler.sendNotification(recipient.pnToken, 'New message from '+updatedMatch.userTwo.username+'!', {}, 120);
                } catch (e){
                    console.log('send notification error = ', e);
                }
        }
        onSuccess(updatedMatch);
    } else {
        onFailure('Could not find match');
    }

/*
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
            }).then(res => {
                //sendNotification(pnToken, text, payload = {}, expSecs = 30)
                console.log('%% addMessageToMatch res 2 = ', res);
                if(res.userOne._id === message.user._id){
                    notificationHandler.sendNotification(res.userTwo.pnToken, 'New message from '+message.username+'!', {}, 120);
                } else {
                    notificationHandler.sendNotification(res.userOne.pnToken, 'New message from '+message.username+'!', {}, 120);
                }
                onSuccess(res);
            }).catch(err => {
                onFailure(err);
            });
        } else {
            onFailure('No match found.');
        }
    }).catch(err => {
        onFailure(err);
    });
    */
}

export default { createOrFetchMatch, findAllMatchesByUserId, addMessageToMatch, findMatchById }