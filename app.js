console.log('!! APP INIT !!');

var now = new Date();
console.log('Time of init: ' + now.toISOString());

import express from 'express';
import db from './testDb/db';
import bodyParser from 'body-parser';
import testPersist from './persistence/testPersist';
import userPersistance from './persistence/userPersistence';
import UserRouter from './router/userRouter';
import MatchRouter from './router/matchRouter';
import VenueRouter from './router/venueRouter';
import MatchPersistence from './persistence/matchPersistence';
import CompetitionRouter from './router/competitionRouter';

import notificationHandler from './notifications/notificationHandler';

notificationHandler;

const mongoose = require('mongoose');
const Product = require('./models/product');

//onst mongoPass = '2boldlyG)whereN01..'
const mongoPass = 'boogie77'
mongoose.connect('mongodb+srv://user1:'+mongoPass+'@node-rest-shop-lewiw.mongodb.net/test?retryWrites=true&w=majority');

// Set up the express router
const router = express();
var server = require('http').Server(router);
var io = require('socket.io')(server);

// Parse incoming requests data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res){
  res.sendFile('web/index.html', { root: __dirname });
});


io.on('connection', function(socket){
  var room = 'default';
  var userId = 'default';
  console.log('a user connected');
  socket.on('userLogin', function(userId) {
    console.log('userLogin userId, '+userId);
    userId = userId;
  });
  socket.on('room', function(matchRoom) {
    console.log('room recieved, '+matchRoom);
    socket.join(matchRoom);
    room = matchRoom;
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + JSON.stringify(msg)+', room = '+room);

    MatchPersistence.addMessageToMatch(room, msg, res => {
      console.log('persist message successful, res = ');
      console.log(res);
    }, err => {
      console.log('persist message unsuccessful, err = ');
      console.log(err);
    });
    socket.broadcast.to(room).emit('chat message', msg);
  });
  socket.on('leaveRoom', function(room) {
    console.log('room left, '+room);
    socket.leave(room);
  });
  socket.on('userLogout', function(userId) {
    console.log('userLogout userId, '+userId);
    if(userId !== 'default'){
        userPersistance.setAllUserStatusesToPassive(userId, doc => {
        console.log('socket user doc = ', doc);
    }, err => {
        console.log('# err = ', err);
      });
    }
    userId = 'default';
  });
  socket.on('disconnect', function(){
    console.log('on disconnect userId = ', userId);
    if(userId !== 'default'){
      userPersistance.setAllUserStatusesToPassive(userId, doc => {
      console.log('socket user doc = ', doc);
    }, err => {
      console.log('# err = ', err);
    });
    }
    console.log('user disconnected');
  });
});


//API

// get all todos
router.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db.todos
  })
});

router.post('/api/v1/product', (req, res, next) => {

  const product = new Product({
    _id : mongoose.Types.ObjectId(),
    name : req.body.name,
    price : req.body.price
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.get('/api/v1/product/:productId', (req, res, next) => {

  const id = req.params.productId;

  Product.findById(id)
  .exec()
  .then(doc => {
    console.log(doc);
    res.status(200).json(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
  
});

router.post('/testConnect', (req, res, next) => {
  console.log('testConnect successful, req.body = ');
  console.log(req.body);
  res.status(200).send({
    success : 'true',
    bodyReceived : req.body
  })
});

router.put('/updateUserStatuses', (req, res) => {
  UserRouter.updateUserStatuses(req, res);
});

router.put('/setAllUserStatusesToPassive', (req, res) => {
  UserRouter.setAllUserStatusesToPassive(req, res);
});

router.put('/updateUserLocation', (req, res) => {
  UserRouter.updateUserLocation(req, res);
});

router.post('/signUp', (req, res) => {
  UserRouter.signUpUser(req, res);
});

router.post('/login', (req, res) => {
  console.log('log in 1');
  UserRouter.loginUser(req, res);
});

router.post('/devId', (req, res) => {
  console.log('%%% devId 1');
  UserRouter.fetchUserInfoByDeviceId(req, res);
});

router.post('/getAllUsers', (req, res) => {
  UserRouter.getAllUsers(req, res);
});

router.post('/getAllUsersByActivity', (req, res) => {
  UserRouter.getAllUsersByActivity(req, res);
});

router.post('/getAllUsersByActivityAndRange', (req, res) => {
  UserRouter.getAllUsersByActivityAndRange(req, res);
});

router.post('/updateUserProfileInformation', (req, res) => {
  UserRouter.updateUserProfileInformation(req, res);
});

router.post('/deleteAllUsers', (req, res) => {
  console.log('delete all users');
  UserRouter.deleteAllUsers(req, res);
});



var fs = require('fs');
var multer = require('multer');

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    console.log('** storage');
    callback(null, './images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: Storage })

router.post('/updateUserProfilePic', upload.array('photo', 3), (req, res) => {
  console.log('updateUserProfilePic req, ', req);
  console.log('updateUserProfilePic res, ', res);
  console.log('updateUserProfilePic req.res, ', req.res);
  console.log('updateUserProfilePic req.files, ', req.files);
  console.log('updateUserProfilePic req.body.userId, ', req.body.userId);
  UserRouter.updateUserProfilePic(req.files[0].path, req.body.userId, req, res);
  //userPersistance.updateUserProfilePic(imgPath, req.body.userId, );

});

router.post('/getUserProfileImage', (req, res) => {
  UserRouter.getUserProfileImage(req, res);
});

router.post('/createOrFetchMatch', (req, res) => {
  MatchRouter.createOrFetchMatch(req, res);
});

router.post('/findAllMatchesByUserId', (req, res) => {
  MatchRouter.findAllMatchesByUserId(req, res);
});

router.post('/fetchMatchById', (req, res) => {
  MatchRouter.fetchMatchById(req, res);
});

router.post('/searchUserByUsername', (req, res) => {
  console.log('searchUserByUsername 1');
  UserRouter.searchUserByUsername(req, res);
});

router.post('/sendFriendRequest', (req, res) => {
  console.log('sendFriendRequest 1');
  UserRouter.sendFriendRequest(req, res);
});

router.post('/getAllFriendRequestsForUser', (req, res) => {
  console.log('getAllFriendRequestsForUser 1');
  UserRouter.getAllFriendRequestsForUser(req, res);
});

router.post('/acceptFriendRequest', (req, res) => {
  console.log('acceptFriendRequest 1');
  UserRouter.acceptFriendRequest(req, res);
});

router.post('/getUserFriends', (req, res) => {
  console.log('getUserFriends 1');
  UserRouter.getUserFriends(req, res);
});

router.post('/requestCompetition', (req, res) => {
  console.log('requestCompetition 1');
  CompetitionRouter.requestCompetition(req, res);
});

router.post('/checkForCompetition', (req, res) => {
  console.log('checkForCompetition 1');
  CompetitionRouter.checkForCompetition(req, res);
});

router.delete('/deleteChallenge', (req, res) => {
  console.log('deleteChallenge 1');
  CompetitionRouter.deleteChallenge(req, res);
});

router.post('/acceptChallenge', (req, res) => {
  console.log('acceptChallenge 1');
  CompetitionRouter.acceptChallenge(req, res);
});

router.post('/updateChallenge', (req, res) => {
  console.log('acceptChallenge 1');
  CompetitionRouter.updateChallenge(req, res);
});

router.post('/confirmChallenge', (req, res) => {
  console.log('confirmChallenge 1');
  CompetitionRouter.confirmChallenge(req, res);
});

router.post('/toggleBlockFriend', (req, res) => {
  console.log('toggleBlockFriend 1');
  UserRouter.toggleBlockFriend(req, res);
});

router.post('/signUpVenue', (req, res) => {
  console.log('signUpVenue 1');
  VenueRouter.signUpVenue(req, res);
});

router.post('/loginVenue', (req, res) => {
  console.log('loginVenue 1');
  VenueRouter.loginVenue(req, res);
});

router.post('/updateVenue', (req, res) => {
  console.log('updateVenue 1');
  VenueRouter.updateVenue(req, res);
});

router.post('/queryVenues', (req, res) => {
  console.log('queryVenues 1');
  VenueRouter.queryVenues(req, res);
});

router.delete('/clearVenues', (req, res) => {
  console.log('clearVenues 1');
  VenueRouter.clearVenues(req, res);
});

router.post('/addTableToVenue', (req, res) => {
  console.log('addTableToVenue 1');
  VenueRouter.addTableToVenue(req, res);
});

router.post('/updateTable', (req, res) => {
  console.log('updateTable 1');
  VenueRouter.updateTable(req, res);
});

router.delete('/deletePoolTable', (req, res) => {
  console.log('deletePoolTable 1');
  VenueRouter.deletePoolTable(req, res);
});

router.post('/getVenueById', (req, res) => {
  console.log('getVenueById 1');
  VenueRouter.getVenueById(req, res);
});

router.post('/getPlayersCheckedIntoVenue', (req, res) => {
  console.log('getPlayersCheckedIntoVenue 1');
  VenueRouter.getPlayersCheckedIntoVenue(req, res);
});

router.post('/updateUserStatusToActive', (req, res) => {
  console.log('updateUserStatusToActive 1');
  UserRouter.updateUserStatusToActive(req, res);
});

router.post('/getCompetitionHistory', (req, res) => {
  console.log('getCompetitionHistory 1');
  CompetitionRouter.getCompetitionHistory(req, res);
});

router.post('/getVenueCompetitionHistory', (req, res) => {
  console.log('getVenueCompetitionHistory 1');
  CompetitionRouter.getVenueCompetitionHistory(req, res);
});

router.post('/getMultipleUsersById', (req, res) => {
  console.log('getMultipleUsersById 1');
  UserRouter.getMultipleUsersById(req, res);
});

router.post('/upsertVenuePromotion', upload.array('photo', 3), (req, res) => {
  console.log('upsertVenuePromotion req, ', req);
  //console.log('upsertVenuePromotion res, ', res);
  //console.log('upsertVenuePromotion req.res, ', req.res);
  //console.log('upsertVenuePromotion req.files, ', req.files);
  console.log('upsertVenuePromotion req.body.venueId, ', req.body.venueId);
  console.log('upsertVenuePromotion req.body, ', req.body);
  if(req.files && req.files[0] && req.files[0].path){
    VenueRouter.upsertVenuePromotion(req.files[0].path, req.body.venueId, req.body._id, req.body.name, req.body.fromDate, req.body.toDate, req.body.isActive, req, res);
  } else {
    VenueRouter.upsertVenuePromotion(null, req.body.venueId, req.body._id, req.body.name, req.body.fromDate, req.body.toDate, req.body.isActive, req, res);

  }
});

router.delete('/clearVenuePromotions', (req, res) => {
  console.log('clearVenuePromotions 1');
  VenueRouter.clearVenuePromotions(req, res);
});

router.delete('/clearVenuePromotions/:venueId', (req, res) => {
  console.log('clearVenuePromotions 1');
  VenueRouter.clearVenuePromotions(req, res);
});

router.post('/getVenuePromotionImage', (req, res) => {
  console.log('getVenuePromotionImage 1');
  VenueRouter.getVenuePromotionImage(req, res);
});

router.post('/getVenueNotificationInfoById', (req, res) => {
  console.log('getVenueNotificationInfoById 1');
  VenueRouter.getVenueNotificationInfoById(req, res);
});

router.post('/deletePromotion', (req, res) => {
  console.log('deletePromotion 1');
  VenueRouter.deletePromotion(req, res);
});

//Nigh.us-east-2.elasticbeanstalk.com
/*
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
*/

var port = process.env.PORT || 5000;

server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});