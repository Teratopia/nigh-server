//import matchPersistence from '../persistence/matchPersistence';
import matchPersistence from '../persistence/matchPersistence';

const createOrFetchMatch = (req, res) => {
    console.log('createOrFetchMatch successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    matchPersistence.createOrFetchMatch(bodyJson.userId, bodyJson.matchUserId, bodyJson.event, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        match : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const findAllMatchesByUserId = (req, res) => {
    console.log('findAllMatchesByUserId successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    matchPersistence.findAllMatchesByUserId(bodyJson.userId, docs => {
        console.log('# docs = ', docs);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        matches : docs
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const fetchMatchById = (req, res) => {
    console.log('fetchMatchById successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    matchPersistence.findMatchById(bodyJson.matchId, doc => {
        console.log('# docs = ', doc);
        res.status(200).send({
        success : 'true',
        bodyReceived : req.body,
        match : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

export default { createOrFetchMatch, findAllMatchesByUserId, fetchMatchById };