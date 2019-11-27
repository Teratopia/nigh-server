//import matchPersistence from '../persistence/matchPersistence';
import competitionPersistence from '../persistence/competitionPersistence';

const requestCompetition = (req, res) => {
    console.log('requestCompetition successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.requestCompetition(bodyJson.competition, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        competition : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const checkForCompetition = (req, res) => {
    console.log('checkForCompetition successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.checkForCompetition(bodyJson.userId, bodyJson.friendId, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        competition : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const deleteChallenge = (req, res) => {
    console.log('deleteChallenge successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.deleteChallenge(bodyJson.competitionId, doc => {
        console.log('# doc = ', doc);
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

const acceptChallenge = (req, res) => {
    console.log('acceptChallenge successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.acceptChallenge(bodyJson.competitionId, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        competition : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const updateChallenge = (req, res) => {
    console.log('updateChallenge successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.updateChallenge(bodyJson.competition, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        competition : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const confirmChallenge = (req, res) => {
    console.log('confirmChallenge successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.confirmChallenge(bodyJson.userId, bodyJson.competitionId, doc => {
        console.log('# doc = ', doc);
        res.status(200).send({
        success : 'true',
        competition : doc
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getCompetitionHistory = (req, res) => {
    console.log('getCompetitionHistory successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.getCompetitionHistory(bodyJson.userId, bodyJson.friendId, competitions => {
        console.log('# competitions = ', competitions);
        res.status(200).send({
        success : 'true',
        competitions : competitions
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getVenueCompetitionHistory = (req, res) => {
    console.log('getVenueCompetitionHistory successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    competitionPersistence.getVenueCompetitionHistory(bodyJson.venueId, bodyJson.fromDate, bodyJson.toDate, competitions => {
        console.log('# competitions = ', competitions);
        res.status(200).send({
        success : 'true',
        competitions : competitions
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
                requestCompetition, 
                checkForCompetition,
                deleteChallenge,
                acceptChallenge,
                updateChallenge,
                confirmChallenge,
                getCompetitionHistory,
                getVenueCompetitionHistory
                };