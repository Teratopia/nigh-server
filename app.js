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
import MatchPersistence from './persistence/matchPersistence';

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
  console.log('a user connected');
  socket.on('room', function(matchRoom) {
    console.log('room recieved, '+matchRoom);
    socket.join(matchRoom);
    room = matchRoom;
    /*
    MatchPersistence.findMatchById(matchRoom, match => {
      console.log('connection find Match by id match = ');
      console.log(match);

      //socket.to(room).emit('chat message', reformatInitialMessages(match));
    }, err => {
      console.log(err);
    });
    */
    //io.to(room).emit('chat message', 'joined chat');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + JSON.stringify(msg)+', room = '+room);

    //io.emit('chat message', msg);
    MatchPersistence.addMessageToMatch(room, msg, res => {
      console.log('persist message successful, res = ');
      console.log(res);
    }, err => {
      console.log('persist message unsuccessful, err = ');
      console.log(err);
    });
    socket.broadcast.to(room).emit('chat message', msg);
    /*
, function(answer){
      console.log('answered', answer);
    }
    */
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

function reformatInitialMessages(match){
  /*
  {createdAt : Date,
  text : String,
  user : {
    _id : String
  }}

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
*/
  
  var retVal = [];
  match.messages.forEach(function(message){
    var reformMess = {
      _id : message._id,
      text : message.text,
      createdAt : message.createDate,
      user : {
        _id : message.userId,
      }
    };
    if(message.userId === match.userOne._id){
      reformMess.user.name = match.userOne.username;
    } else {
      reformMess.user.name = match.userTwo.username;
    }
    retVal.push(reformMess);
  });
  return retVal;
}


/*
const nsp = io.of('/matchChat');
nsp.on('connection', function(socket){
  //populate chat messages
  console.log('someone connected');

  socket.on('room', function(room) {
    //socket.join(room);
    console.log('room recieved, '+room);
});

  //replace someRoom with match ID
  //socket.join('some room');
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    nsp.emit('chat message', msg);
    //nsp.to('some room').emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
*/


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