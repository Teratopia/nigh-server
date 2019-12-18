//import bodyParser from 'body-parser';
//import testPersist from './persistence/testPersist';
import venuePersistence from '../persistence/venuePersistence';
//mport foo from '../persistence/userPersistence';


const signUpVenue = (req, res) => {
    console.log('signUp 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    venuePersistence.signUpVenue(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, venue => {
        console.log('# doc = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const loginVenue = (req, res) => {
    console.log('login 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    venuePersistence.loginVenue(bodyJson.username, bodyJson.password, bodyJson.latitude, bodyJson.longitude, bodyJson.deviceId, venue => {
        console.log('# doc = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateVenue = (req, res) => {
    console.log('updateVenue 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.updateVenue(bodyJson.venue, venue => {
        console.log('# doc = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const queryVenues = (req, res) => {
    console.log('queryVenues 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.queryVenues(bodyJson.lat, bodyJson.long, bodyJson.radius, venues => {
        console.log('# venues = ', venues);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venues : venues
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getVenueById = (req, res) => {
    console.log('getVenueById 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.getVenueById(bodyJson.venueId, venue => {
        console.log('# venue = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getVenuesById = (req, res) => {
    console.log('getVenuesById 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.getVenuesById(bodyJson.venueIdList, venues => {
        console.log('# venues = ', venues);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venues : venues
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getVenueNotificationInfoById = (req, res) => {
    console.log('getVenueNotificationInfoById 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.getVenueNotificationInfoById(bodyJson.venueId, bodyJson.statusSettings, bodyJson.friendsList, retVal => {
        //console.log('# venue = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : retVal.venue,
        friendsAtVenue : retVal.friendsAtVenue,
        nonFriendsAtVenue : retVal.nonFriendsAtVenue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getPlayersCheckedIntoVenue = (req, res) => {
    console.log('getPlayersCheckedIntoVenue 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.getPlayersCheckedIntoVenue(bodyJson.venueId, bodyJson.activityName, users => {
        console.log('# users = ', users);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        users : users
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const addTableToVenue = (req, res) => {
    console.log('addTableToVenue 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.addTableToVenue(bodyJson.venueId, bodyJson.poolTable, venue => {
        console.log('# venue = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateTable = (req, res) => {
    console.log('updateTable 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.updateTable(bodyJson.venueId, bodyJson.poolTable, (table, venue) => {
        console.log('# table = ', table);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        table : table,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const deletePoolTable = (req, res) => {
    console.log('deletePoolTable 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.deletePoolTable(bodyJson.venueId, bodyJson.tableId, venue => {
        console.log('# venue = ', venue);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const clearVenues = (req, res) => {
    console.log('clearVenues 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.clearVenues(() => {
        res.status(200).send({
        success : 'true'
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const clearVenuePromotions = (req, res) => {
    console.log('clearVenuePromotions 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    const venueId = req.params.venueId;
    
    venuePersistence.clearVenuePromotions(venueId, () => {
        res.status(200).send({
        success : 'true'
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getVenuePromotionImage = (req, res) => {
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.getVenuePromotionImage(bodyJson.venuePromotion, image => {
        res.status(200).send({
        success : 'true',
        image : image
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const upsertVenuePromotion = (node, venueId, promotionId, name, fromDate, toDate, isActive, req, res) => {
    console.log('upsertVenuePromotion 1 successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.upsertVenuePromotion(node, venueId, promotionId, name, fromDate, toDate, isActive, venue => {
        res.status(200).send({
        success : 'true',
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const deletePromotion = (req, res) => {
    var bodyJson = req.body;
    console.log(bodyJson);
    venuePersistence.deletePromotion(bodyJson.venueId, bodyJson.venuePromotionId, venue => {
        res.status(200).send({
        success : 'true',
        venue : venue
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

export default {    
                signUpVenue, 
                loginVenue,
                updateVenue,
                queryVenues,
                addTableToVenue,
                clearVenues,
                updateTable,
                getVenueById,
                getPlayersCheckedIntoVenue,
                deletePoolTable,
                upsertVenuePromotion,
                clearVenuePromotions,
                getVenuePromotionImage,
                getVenueNotificationInfoById,
                deletePromotion,
                getVenuesById
                };