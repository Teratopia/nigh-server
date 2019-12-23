//import bodyParser from 'body-parser';
//import testPersist from './persistence/testPersist';
import userPersistance from '../persistence/userPersistence';
//mport foo from '../persistence/userPersistence';


const loginUser = (req, res) => {
    console.log('log in 2');
    console.log('login successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.loginUser(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, bodyJson.pnToken, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        user : doc
        })
    }, (err, errorCode, verificationCode) => {
        console.log('# err = ', err);
        if(errorCode && verificationCode){
            res.status(errorCode).send({
                success : false,
                message : err,
                verificationCode : verificationCode
            })
        } else {
            res.status((errorCode || 500)).send({
                success : false,
                message : err
            })
        }
        
    });
}

const signUpUser = (req, res) => {
    console.log('signUp successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.createNewUser(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, bodyJson.pnToken, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const requestEmailVerification = (req, res) => {
    console.log('requestEmailVerification successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.requestEmailVerification(bodyJson.email, code => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        code : code
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const addPnToken = (req, res) => {
    console.log('addPnToken successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.addPnToken(bodyJson.email, bodyJson.pnToken, code => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        code : code
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateUserLocation = (req, res) => {
    console.log('updateUserLocation successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.updateUserLocation(bodyJson.userId, bodyJson.latitude, bodyJson.longitude, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateUserEmail = (req, res) => {
    console.log('updateUserEmail successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.updateUserEmail(bodyJson.userId, bodyJson.email, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateUserStatusToActive = (req, res) => {
    console.log('updateUserStatusToActive successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.updateUserStatusToActive(bodyJson.userId, bodyJson.statuses, bodyJson.venueId, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateUserStatuses = (req, res) => {
    console.log('updateUserStatuses successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.updateUserStatuses(bodyJson.userId, bodyJson.statuses, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const setAllUserStatusesToPassive = (req, res) => {
    console.log('setAllUserStatusesToPassive successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.setAllUserStatusesToPassive(bodyJson.userId, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : true,
        bodyReceived : req.body,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const fetchUserInfoByDeviceId = (req, res) => {
    console.log('devId successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.fetchUserInfoByDeviceId(bodyJson.deviceId, docs => {
      console.log('# docs = ', docs);
      var retDoc;
      docs.forEach(function(doc) {
        console.log('foreach doc = ')
        console.log(doc);
        if(!retDoc && doc.lastLogin){
          retDoc = doc;
        }
        if(doc.lastLogin && Date.parse(doc.lastLogin) > Date.parse(retDoc.lastLogin)){
          retDoc = doc;
        }
      });
      res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        docReturned : retDoc
      })
    }, err => {
      console.log('# err = ', err);
      res.status(500).send({
        success : false,
        message : err
      })
    });
}

const getAllUsers = (req, res) => {
    console.log('getAllUsers successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.getAllUsers(bodyJson.userId, docs => {
        console.log('# getAllUsers docs = ', docs);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        users : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getMultipleUsersById = (req, res) => {
    console.log('getMultipleUsersById successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.getMultipleUsersById(bodyJson.userIds, docs => {
        console.log('# getMultipleUsersById docs = ', docs);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        users : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getAllUsersByActivity = (req, res) => {
    console.log('getAllUsersByActivity successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.getAllUsersByActivity(bodyJson.userId, bodyJson.activity, docs => {
        console.log('# getAllUsersByActivity docs = ', docs);

        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        users : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getAllUsersByActivityAndRange = (req, res) => {
    console.log('getAllUsersByActivityAndRange successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.getAllUsersByActivityAndRange(bodyJson.userId, bodyJson.activity, bodyJson.range, docs => {
        console.log('# getAllUsersByActivityAndRange docs = ', docs);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        users : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}


const updateUserProfilePic = (imgPath, userId, req, res) => {
    userPersistance.updateUserProfilePic(imgPath, userId, doc => {
        console.log('# updateUserProfilePic doc = ', doc);
        res.status(200).send({
        success : 'true',
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getUserProfileImage = (req, res) => {
    console.log('getUserProfileImage 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.getUserProfileImage(bodyJson.userId, doc => {
        console.log('# getUserProfileImage doc = ', doc);
        res.status(200).send({
        success : 'true',
        image : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateUserProfileInformation = (req, res) => {
    console.log('updateUserProfileInformation 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.updateUserProfileInformation(bodyJson, doc => {
        console.log('# updateUserProfileInformation doc = ', doc);
        res.status(200).send({
        success : true,
        user : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const searchUserByUsername = (req, res) => {
    console.log('searchUserByUsername 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.searchUserByUsername(bodyJson.username, docs => {
        console.log('# searchUserByUsername docs = ', docs);
        res.status(200).send({
        success : true,
        users : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const sendFriendRequest = (req, res) => {
    console.log('sendFriendRequest 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.sendFriendRequest(bodyJson.requesterId, bodyJson.requesteeId, bodyJson.message, request => {
        console.log('# sendFriendRequest request = ', request);
        res.status(200).send({
        success : true,
        request : request
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getAllFriendRequestsForUser = (req, res) => {
    console.log('getAllFriendRequestsForUser 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.getAllFriendRequestsForUser(bodyJson.userId, requests => {
        console.log('# getAllFriendRequestsForUser requests = ', requests);
        res.status(200).send({
        success : true,
        requests : requests
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const acceptFriendRequest = (req, res) => {
    console.log('acceptFriendRequest 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.acceptFriendRequest(bodyJson.userId, bodyJson.requesterId, (requestee, requester) => {
        console.log('# acceptFriendRequest user = ', user);
        res.status(200).send({
        success : true,
        updatedRequestee : requestee,
        updatedRequester : requester
        })}, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getUserFriends = (req, res) => {
    console.log('getUserFriends 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.getUserFriends(bodyJson.userId, friends => {
        console.log('# getUserFriends friends = ', friends);
        res.status(200).send({
        success : true,
        friends : friends
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const toggleBlockFriend = (req, res) => {
    console.log('toggleBlockFriend 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.toggleBlockFriend(bodyJson.userId, bodyJson.friendToBlockId, user => {
        console.log('# toggleBlockFriend friendToBlockId = ', bodyJson.friendToBlockId);
        res.status(200).send({
        success : true,
        user : user
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const addVenueIdToFavorites = (req, res) => {
    console.log('addVenueIdToFavorites 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.addVenueIdToFavorites(bodyJson.userId, bodyJson.venueId, user => {
        console.log('# addVenueIdToFavorites user = ', user);
        res.status(200).send({
        success : true,
        user : user
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const removeVenueIdFromFavorites = (req, res) => {
    console.log('removeVenueIdFromFavorites 1');
    var bodyJson = req.body;
    console.log(bodyJson);
    userPersistance.removeVenueIdFromFavorites(bodyJson.userId, bodyJson.venueId, user => {
        console.log('# removeVenueIdFromFavorites user = ', user);
        res.status(200).send({
        success : true,
        user : user
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const deleteAllUsers = () => {
    userPersistance.deleteAllUsers();
}

export default {    requestEmailVerification,
                    loginUser, 
                    signUpUser, 
                    addPnToken,
                    updateUserEmail,
                    updateUserLocation, 
                    updateUserStatuses, 
                    setAllUserStatusesToPassive, 
                    fetchUserInfoByDeviceId, 
                    getAllUsers, 
                    getAllUsersByActivity, 
                    getAllUsersByActivityAndRange, 
                    deleteAllUsers, 
                    updateUserProfilePic, 
                    getUserProfileImage, 
                    updateUserProfileInformation, 
                    searchUserByUsername,
                    sendFriendRequest,
                    getAllFriendRequestsForUser,
                    acceptFriendRequest,
                    getUserFriends,
                    toggleBlockFriend,
                    updateUserStatusToActive,
                    getMultipleUsersById,
                    addVenueIdToFavorites,
                    removeVenueIdFromFavorites
                };