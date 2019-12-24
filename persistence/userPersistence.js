import notificationHandler from '../notifications/notificationHandler';

const mongoose = require('mongoose');
const User = require('../models/user');
const Venue = require('../models/venue');
const Image = require('../models/image');
const FriendRequest = require('../models/friendRequest');
var fs = require('fs');
const Bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');

const createNewUser = (username, password, latitude, longitude, deviceId, pnToken, onSuccess, onFailure) => {
    User.find({ username: username }).then(docs => {
        if(docs.length > 0){
            onFailure('Username Exists');
        } else {
            password = Bcrypt.hashSync(password, 10);
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                createDate: Date.now(),
                lastLogin: Date.now(),
                username: username,
                password: password,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                picture: null,
                isActive: true,
                activeVenueId : null,
                deviceIds: [deviceId],
                pnToken : pnToken,
                recognizedPnTokens : [pnToken],
                statuses: initializeStatuses()
            });
            user.save().then(doc => {
                onSuccess(doc);
            }).catch(err => {
                onFailure(err);
            });
        }
    }).catch(err => {
        onFailure(err);
    })
}

const fetchUserInfoByDeviceId = (deviceId, onSuccess, onFailure) => {
    User.find({ deviceIds: { $in: [deviceId] } }).then(docs => {
        onSuccess(docs);
    }).catch(err => {
        onFailure(err);
    })
}

async function loginUser(username, password, latitude, longitude, deviceId, pnToken, onSuccess, onFailure){
    console.log('log in user 3');

    let user = await User.findOne({username : username});
    if(!user){
        onFailure('No username found.');
    }
    if(Bcrypt.compareSync(password, user.password)){
        if(user.pnToken === pnToken){
            await user.updateOne({
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                lastLogin: Date.now()
            });
            var updatedUser = await User.findById(user._id);
            onSuccess(updatedUser);
        } else if(user.recognizedPnTokens.includes(pnToken)){
            await user.updateOne({
                pnToken : pnToken,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                lastLogin: Date.now()
            });
            var updatedUser = await User.findById(user._id);
            onSuccess(updatedUser);
        } else {
            //TO DO: 
            let message = 'An unrecognized device is attempting to log in.';
            notificationHandler.sendNotification(
                user.pnToken, 
                message, 
                {'notificationType': 'unrecognizedDevie', 'text' : message}, 
                30
            )
            if(user.email){
                console.log('user has email');
                requestEmailVerification(user.email, code => {
                    onSuccess(user, code);
                    //onFailure('Unauthorized device id.', 401, code);
                }, err => {
                    console.log('requestEmailVerification error = ', err);
                })
            }
            /*
            await user.updateOne({pnToken : pnToken});
            var updatedUser = await User.findById(user._id);
            onSuccess(updatedUser);
            */
        }
    } else {
        onFailure('Password does not match.');
    }
    /*
    User.findOne({
        username: username
    }).then(doc => {
        if(Bcrypt.compareSync(password, doc.password)) {
            console.log('log in user success doc = ', doc);
            if(doc.pnToken !== pnToken){

                doc.updateOne({pnToken : pnToken}).then(updatedUser => {
                    onSuccess(updatedUser);
                });                
            } else {
                onSuccess(doc);
            }
        } else {
            onFailure('Invalid password');
        }
    }).catch(err => {
        onFailure(err);
    });
    */
}

const requestEmailVerification = (email, onSuccess, onFailure) => {
    console.log('requestEmailVerification successful, req.body = ');
    var code = Math.random().toFixed(6)+'';
    var resCode = code.substring(2, 8);
    console.log('code = ', resCode);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user : 'kennisnigh1@gmail.com',
          pass : 'jhcuyiaeuuluecye'
        }
      });

      var mailOptions = {
        from: 'Nigh',
        to: email,
        subject: 'Your Nigh Authentication Code',
        html: '<div style="width : 34%; padding : 24px; border-style: solid; border-width: 1px; border-color: #607d8b;">'+
                '<h4 style="text-align: center;">Your Nigh Email Verification Code</h4>'+
                '<h2 style="text-align: center;">'+resCode+'</h2>'+
            '</div>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          onFailure(error);
        } else {
          console.log('Email sent: ' + info.response);
          onSuccess(resCode);
        }
      });
}

async function updateUserEmail(userId, email, onSuccess, onFailure){
    User.findById(userId).then(user => {
        user.email = email;
        user.save().then(updatedUser => {
            onSuccess(updatedUser);
        }).catch(e => {
            onFailure(e);
        })
    })
}

async function addPnToken(userId, pnToken, onSuccess, onFailure){
    User.findById(userId).then(user => {
        user.pnToken = pnToken;
        user.recognizedPnTokens.push(pnToken);
        user.save().then(res => {
            User.findById(userId).then(updatedUser => {
                onSuccess(updatedUser);
            }).catch(e => {
                onFailure(e);
            })
        }).catch(e => {
            onFailure(e);
        })
    })
}

async function notifyUserFriendsOfActiveStatus(userId, venueId, activity){
    const user = await User.findById(userId);
    let addLocation = false;
    let abort = false;
        user.statuses.forEach(status => {
            if(status.activityName === activity){
                if(status.shareMyStatusWithFriends){
                    if(status.shareMyLocationWithFriends){
                        addLocation = true;
                    }
                } else {
                    abort = true;
                }
            }
        })
    if(abort){
        return;
    }
    let message = user.username+' is now active!';
    if(venueId && addLocation){
        const venue = await Venue.findById(venueId);
        message = user.username+' checked into '+venue.properName+'!';
    }
    var friendIds = user.friendsIdList;
    var blockedIds = user.blockedFriendsIdList;
    var filteredFriendIds = friendIds.filter(function(value){
        if(blockedIds.includes(value)){
            return false;
        }
        return true;
    });
    var queryIdList = filteredFriendIds.forEach(ffId => {
        ffId = mongoose.Types.ObjectId(ffId);
    });
    var friends = await model.find({
        '_id': { $in: queryIdList },
        statuses : {
            $elemMatch: {
                activityName: activity,
                friendsBecomeActive: true
            }
        },
        //blockedFriendsIdList : { $nin : [userId] }
    }, function(err, docs){
         console.log(docs);
    });
    friends.forEach(friend => {
        if(!friend.blockedFriendsIdList.includes(userId) && friend.pnToken){
            notificationHandler.sendNotification(
                friend.pnToken,
                message,
                {'notificationType': 'friendStatusChange', 'text' : message}
            )
        }
    })
}

async function updateUserStatusToActive(userId, statuses, venueId, onSuccess, onFailure) {
    const user = await User.findById(userId);
    const update = {activeVenueId : venueId, statuses : statuses};
    await user.updateOne(update);
    const updatedUser = await User.findById(userId);
    console.log('updateUserStatusToActive updatedUser = ');
    console.log(updatedUser);
    onSuccess(updatedUser);
    statuses.forEach(status => {
        if(status.active){
            notifyUserFriendsOfActiveStatus(userId, venueId, status.activityName);
        }
    })
}

async function updateUserStatuses(userId, statuses, onSuccess, onFailure) {
    //TODO HANDLE OTHER ACTIVITIES
    const update = { statuses: statuses };
    var flag = false;
    statuses.forEach(status => {
        if(status.active){
            flag = true;
        }
    })
    if(flag){
        update.activeVenueId = null;
    }
    const user = await User.findById(userId);
    await user.updateOne(update);
    const updatedUser = await User.findById(userId);

    console.log('updatedUser = ');
    console.log(updatedUser);
    onSuccess(updatedUser);
}

async function logoutUser(userId, onSuccess, onFailure) {
    setAllUserStatusesToPassive(userId, updatedUser => {
            updatedUser.updateOne({isActive : false}).then(doc => {
                onSuccess(doc);
            }).catch(err => {
                console.log('logout user error = ', err);
                onFailure(err);
            })
        });
}

async function setAllUserStatusesToPassive(userId, onSuccess, onFailure) {
    const user = await User.findById(userId);
    console.log('USER 1:');
    console.log(user);
    user.statuses.forEach(function(status){
        status.active ? status.active = false : null;
    });
    console.log('USER 2:');
    console.log(user);
    const update = { activeVenueId : null, statuses: user.statuses };
    await user.updateOne(update);
    const updatedUser = await User.findById(userId);

    console.log('updatedUser = ');
    console.log(updatedUser);
    onSuccess(updatedUser);
}

async function updateUserLocation(userId, latitude, longitude, onSuccess, onFailure) {
    console.log('updateUserLocation latitude = ' + latitude + ', longitude = ' + longitude);
    const user = await User.findById(userId);
    const update = {
        location: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
        }
    };
    await user.updateOne(update);
    const updatedUser = await User.findById(userId);
    onSuccess(updatedUser);
}

function initializeStatuses() {
    let retActs = [];
    activities.forEach(function (act) {
        retActs.push({
            key: act.key,
            activityName: act.title,
            activityDescription: act.explanation,
            active: false,
            passive: false,
            lastModified: Date.now(),
            description: '' 
        });
    });
    return retActs;
}

const getAllUsers = (userId, onSuccess, onFailure) => {
    User.find().then(docs => {
        onSuccess(docs);
    }).catch(err => {
        onFailure(err);
    })
}

const getMultipleUsersById = (userIds, onSuccess, onFailure) => {
    User.find({_id : { $in : userIds}}).then(docs => {
        onSuccess(docs);
    }).catch(err => {
        onFailure(err);
    })
}

const getAllUsersByActivity = (userId, activity, onSuccess, onFailure) => {

    console.log('%%% activity = ' + activity)
    User.find({
        isActive: true,
        statuses: {
            $elemMatch: {
                activityName: activity,
                active: true
            }
        }
    }).then(docs => {
        console.log('getAllUsersByActivity success docs = ');
        console.log(docs);
        onSuccess(docs);
    }).catch(err => {
        console.log('getAllUsersByActivity failure err = ');
        console.log(err);
        onFailure(err);
    })
}

const getAllUsersByActivityAndRange = (userId, activity, range, onSuccess, onFailure) => {
    console.log('%%% activity = ' + activity)
    User.findById(userId).then(user => {
        if (!user) {
            onFailure('no user found');
        } else {
            var query = {
                isActive: true,
                location: {
                    $near: {
                        $maxDistance: range,
                        $geometry: {
                            type: "Point",
                            coordinates: user.location.coordinates
                        }
                    }
                },
                _id : { $ne : userId}
            };
            if(activity !== 'ALL'){
                query.statuses = {
                    $elemMatch: {
                        activityName: activity,
                        active: true
                    }
                }
            }
            console.log('getAllUsersByActivityAndRange user = ');
            console.log(user);
            console.log('coords = ');
            console.log(user.location.coordinates);
            User.find(query).then(docs => {
                console.log('getAllUsersByActivityAndRange success docs = ');
                console.log(docs);
                onSuccess(docs);
            }).catch(err => {
                console.log('getAllUsersByActivityAndRange failure err = ');
                console.log(err);
                onFailure(err);
            });
        }
    });
}

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

const updateUserProfilePic = (imgPath, userId, onSuccess, onFailure) => {
    const image = new Image({
        _id: mongoose.Types.ObjectId(),
        createDate: Date.now(),
    });
    image.source.data = fs.readFileSync(imgPath);
    image.save().then(imgDoc => {
        User.findById(userId).then(userDoc => {
            userDoc.picture = imgDoc._id;
            userDoc.save().then(doc => {
                console.log('updateUserProfilePic success doc = ');
                console.log(doc);
                onSuccess(doc);
            }).catch(err => {
                console.log('updateUserProfilePic failure 1 err = ');
                console.log(err);
                onFailure(err);
            });
        }).catch(err => {
            console.log('updateUserProfilePic failure 2 err = ');
            console.log(err);
            onFailure(err);
        });
    }).catch(err => {
        console.log('updateUserProfilePic failure 3 err = ');
        console.log(err);
        onFailure(err);
    });
}

const getUserProfileImage = (userId, onSuccess, onFailure) => {
    User.findById(userId).then(userDoc => {
        if(userDoc.picture){
            Image.findById(userDoc.picture).then(imgDoc => {
                console.log('getUserProfileImage success doc = ');
                console.log(imgDoc);
                onSuccess(imgDoc);
            }).catch(err => {
                console.log('getUserProfileImage failure 1 err = ');
                console.log(err);
                onFailure(err);
            });
        } else {
            console.log('getUserProfileImage failure image not found err = ');
            onFailure('image not found');
        }
    }).catch(err => {
        console.log('getUserProfileImage failure 2 err = ');
        console.log(err);
        onFailure(err);
    });
}

const updateUserProfileInformation = (reqBody, onSuccess, onFailure) => {
    User.findById(reqBody.userId).then(userDoc => {
        for (var prop in reqBody) {
            if (Object.prototype.hasOwnProperty.call(reqBody, prop)) {
                userDoc[prop] = reqBody[prop];
            }
        }
        userDoc.save().then(doc => {
            onSuccess(doc);
        }).catch(err => {
            console.log('updateUserProfileInformation failure 1 err = ');
            console.log(err);
            onFailure(err);
        });
    }).catch(err => {
        console.log('updateUserProfileInformation failure 2 err = ');
        console.log(err);
        onFailure(err);
    });
}

const searchUserByUsername = (username, onSuccess, onFailure) => {
    User.find({username: new RegExp('^'+username, "i")}).then(docs => {
        onSuccess(docs);
    }).catch(err => {
        onFailure(err);
    });
}

const sendFriendRequest = (requesterId, requesteeId, message, onSuccess, onFailure) => {
    User.findById(requesterId).then(erUser => {
        if(erUser){
            User.findById(requesteeId).then(eeUser => {
                if(eeUser){
                    const friendRequest = new FriendRequest({
                        _id: mongoose.Types.ObjectId(),
                        createDate: Date.now(),
                        responseDate: null,
                        requester : erUser,
                        requestee : eeUser,
                        accepted : false,
                        message : message
                    });
                    friendRequest.save().then(doc => {
                        onSuccess(doc);
                    }).catch(err => {
                        onFailure(err);
                    })
                }
            }).catch(err => {
                onFailure(err);
            })
        }
    }).catch(err => {
        onFailure(err);
    })
}

const getAllFriendRequestsForUser = (userId, onSuccess, onFailure) => {
    //FriendRequest.deleteMany({});
    FriendRequest.find({ $or : [
            {"requester._id" : userId, accepted : false},
            {"requestee._id" : userId, accepted : false}
        ]
    }).then(requests => {
        onSuccess(requests);
    }).catch(err => {
        onFailure(err);
    });
}

const acceptFriendRequest = (userId, requesterId, onSuccess, onFailure) => {
    FriendRequest.findOne({"requester._id" : requesterId, "requestee._id" : userId}).then(request => {
        request.accepted = true;
        request.save().then(doc => {
            User.findById(userId).then(requestee => {
                requestee.friendsIdList.push(requesterId);
                requestee.save().then(updatedRequestee => {
                    User.findById(requesterId).then(requester => {
                        requester.friendsIdList.push(userId);
                        requester.save().then(updateRequester => {
                            onSuccess(updatedRequestee, updateRequester);
                        }).catch(err => {
                            onFailure(err);
                        });
                    }).catch(err => {
                        onFailure(err);
                    });
                }).catch(err => {
                    onFailure(err);
                });
            }).catch(err => {
                onFailure(err);
            });
        }).catch(err => {
            onFailure(err);
        });
    }).catch(err => {
        onFailure(err);
    });
}

const getUserFriends = (userId, onSuccess, onFailure) => {
    User.findById(userId).then(user => {
        User.find({_id : { $in : user.friendsIdList}}).then(users => {
            onSuccess(users);
        }).catch(err => {
            onFailure(err);
        })
    })
}

const toggleBlockFriend = (userId, friendToBlockId, onSuccess, onFailure) => {
    User.findById(userId).then(user => {
        var removing = false;
        user.blockedFriendsIdList.forEach((id, index) => {
            if(id === friendToBlockId){
                removing = true;
            }
        });
        if(removing){
            user.blockedFriendsIdList.pull(friendToBlockId);
        } else {
            user.blockedFriendsIdList.push(friendToBlockId);
        }
        user.save().then(resUser => {
            onSuccess(resUser);
        }).catch(err => {
            onFailure(err);
        })
    })
}

async function addVenueIdToFavorites(userId, venueId, onSuccess, onFailure){
    var user = await User.findById(userId);
        if(user){
            await user.updateOne({
                $push : {venueFavoritesIdList : venueId}
            });
            var updatedUser = await User.findById(userId);
            onSuccess(updatedUser);
        } else {
            onFailure('no user found');
        }
}

async function removeVenueIdFromFavorites(userId, venueId, onSuccess, onFailure){

    var user = await User.update( {_id: userId}, { $pullAll: {venueFavoritesIdList: [venueId] } } );
    if(user){
        var updatedUser = await User.findById(userId);
        onSuccess(updatedUser);
    } else {
        onFailure('no user returned');
    }
}

//get rid of this...
const deleteAllUsers = () => {
    User.deleteMany({}, res => {
        console.log('users deleted, res = ');
        console.log(res);
    });
}

const activities = [
    { key: '0', title: 'ART', description: '', status: 'off', explanation: 'Have a new exhibit folks should check out? Need volunteers to make your work a reality? Looking for a critic, a mentor or just a fresh perspective? Do you love art? Post or reply to an art event!' },
    { key: '1', title: 'BASKETBALL', description: '', status: 'off', explanation: 'One on one? Three on three? Horse? Friendly pick up game? Just plain like watching folks shoot hoops? Post or reply to a basketball invitation!' },
    { key: '2', title: 'BILLIARDS', description: '', status: 'off', explanation: 'Eight Ball? Nine Ball? Three Ball? Cut-Throat? Need some pointers? Like to teach beginners? Shoot some pool with a billiards invitation!' },
    { key: '3', title: 'BOARD GAMES', description: '', status: 'off', explanation: 'Scrabble? Settlers of Catan? Monopoly? You name it! Tell folks what board game you\'re playing or reply to a posted board game invitation!' },
    { key: '4', title: 'CARDS', description: '', status: 'off', explanation: 'Poker? Rummy? Bridge? Go Fish? Tell folks what card game you\'re playing or reply to a posted card game invitation!' },
    { key: '5', title: 'CHARITY', description: '', status: 'off', explanation: 'Need volunteers to support a good cause? Want to spend some time helping others? Post or reply to a charity volunteering opportunity!' },
    { key: '6', title: 'CHESS', description: '', status: 'off', explanation: 'A game so great it needed its own category! Want to teach a beginner? Want to learn some tips? Looking for some fresh competition? Want to challenge a master? Post or reply to a chess invitation!' },
    { key: '7', title: 'D&D', description: '', status: 'off', explanation: 'Searching for that rogue to round out your party? Want to try a one shot with a brand new DM? Want to sit in on a campaign for a single session then go out in a blaze of glory? Break out the dice and post or reply to a D&D invitation!' },
    { key: '8', title: 'DARTS', description: '', status: 'off', explanation: '301? Around the world? A friendly game of Bullseye? Throw out or reply to a darts invitation!' },
    { key: '9', title: 'DOMINOS', description: '', status: 'off' },
    { key: '10', title: 'FOOD', description: '', status: 'off', explanation: 'Looking for folks to join your pot-luck barbeque? Have some leftovers you\'re not in the mood for? Need a taste tester, food critic or sampler? ...Hungry? Post or reply to a food invitation!' },
    { key: '11', title: 'FOOTBALL', description: '', status: 'off' },
    { key: '12', title: 'GO', description: '', status: 'off' },
    { key: '13', title: 'MAGIC CARDS', description: '', status: 'off' },
    { key: '14', title: 'MUSIC', description: '', status: 'off', explanation: 'Looking for a trumpet player to sit in with the band? Throwing a gig? Busking? Touring? Critiquing? Scouting? Recording? Just want to jam with some new folks? Post or reply to a music invitation!' },
    { key: '15', title: 'PING PONG', description: '', status: 'off' },
    { key: '16', title: 'PERFORMANCE', description: '', status: 'off', explanation: 'Looking for an audience? Need to find an actor? Want folks to know about your cool street performance? Just feel like watching a show? Post or reply to a performance event!' },
    { key: '17', title: 'POKEMON GO', description: '', status: 'off' },
    { key: '18', title: 'PROMOTION', description: '', status: 'off', explanation: 'Having a sale? New item on the menu? Looking for the latest limited time deals? Post or reply to a promotion event!' },
    { key: '19', title: 'RUNNING', description: '', status: 'off' },
    { key: '20', title: 'SHUFFLEBOARD', description: '', status: 'off' },
    { key: '21', title: 'SOCCER', description: '', status: 'off' },
    { key: '22', title: 'TENNIS', description: '', status: 'off' },
    { key: '23', title: 'WORK', description: '', status: 'off', explanation: 'Need some work done? Want to make some cash? Tell folks what you need done or reply to a posted job offer!' }
];

export default {    createNewUser, 
                    fetchUserInfoByDeviceId, 
                    updateUserEmail,
                    addPnToken,
                    loginUser, 
                    updateUserStatuses, 
                    setAllUserStatusesToPassive, 
                    updateUserLocation, 
                    getAllUsers, 
                    getAllUsersByActivity, 
                    getAllUsersByActivityAndRange, 
                    updateUserProfilePic, 
                    deleteAllUsers, 
                    getUserProfileImage, 
                    updateUserProfileInformation, 
                    searchUserByUsername,
                    sendFriendRequest,
                    getAllFriendRequestsForUser,
                    acceptFriendRequest,
                    getUserFriends,
                    updateUserStatusToActive,
                    toggleBlockFriend,
                    getMultipleUsersById,
                    logoutUser,
                    addVenueIdToFavorites,
                    removeVenueIdFromFavorites,
                    requestEmailVerification
                };