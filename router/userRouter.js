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
    userPersistance.loginUser(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, doc => {
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

const signUpUser = (req, res) => {
    console.log('signUp successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    userPersistance.createNewUser(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, doc => {
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





const deleteAllUsers = () => {
    userPersistance.deleteAllUsers();
}

export default { loginUser, signUpUser, updateUserLocation, updateUserStatuses, setAllUserStatusesToPassive, fetchUserInfoByDeviceId, getAllUsers, getAllUsersByActivity, getAllUsersByActivityAndRange, deleteAllUsers, updateUserProfilePic, getUserProfileImage, updateUserProfileInformation };