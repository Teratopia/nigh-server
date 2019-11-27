const mongoose = require('mongoose');
const Competition = require('../models/competition');
const User = require('../models/user');

const requestCompetition = (competition, onSuccess, onFailure) => {
    console.log('psersist requestCompetition = ', competition);
    competition._id = mongoose.Types.ObjectId();
    const newComp = new Competition(competition);
    newComp.save().then(resComp => {
        onSuccess(resComp);
    }).catch(err => {
        onFailure(err);
    });
}

const checkForCompetition = (userId, friendId, onSuccess, onFailure) => {
    Competition.findOne({ $or : [
        {"challengerId" : userId, "accepterId" : friendId, challengerConfirmed : false, accepterConfirmed : false},
        {"accepterId" : userId, "challengerId" : friendId, challengerConfirmed : false, accepterConfirmed : false},
        {"challengerId" : userId, "accepterId" : friendId, challengerConfirmed : false, accepterConfirmed : true},
        {"accepterId" : userId, "challengerId" : friendId, challengerConfirmed : true, accepterConfirmed : false}
    ]
    }).then(competition => {
        onSuccess(competition);
    }).catch(err => {
        onFailure(err);
    });
}

const deleteChallenge = (competitionId, onSuccess, onFailure) => {
    Competition.deleteOne({_id : competitionId}).then(res => {
        onSuccess(res);
    }).catch(err => {
        onFailure(err);
    });
}

const acceptChallenge = (competitionId, onSuccess, onFailure) => {
    Competition.findById(competitionId).then(comp => {
        comp.acceptedDate = new Date();
        comp.save().then(res => {
            onSuccess(res);
        }).catch(err => {
            onFailure(err);
        });
    }).catch(err => {
        onFailure(err);
    });
}

const updateChallenge = (competition, onSuccess, onFailure) => {
    Competition.findById(competition._id).then(comp => {
        comp.accepterResultClaim === competition.accepterResultClaim ? null : comp.accepterResultClaim = competition.accepterResultClaim;
        comp.challengerResultClaim === competition.challengerResultClaim ? null : comp.challengerResultClaim = competition.challengerResultClaim;
        //TODO - fix
        if(!comp.endDate && (comp.accepterResultClaim || comp.challengerResultClaim)){
            comp.endDate = new Date();
        }
        comp.save().then(res => {
            onSuccess(res);
        }).catch(err => {
            onFailure(err);
        });
    }).catch(err => {
        onFailure(err);
    });
}

const confirmChallenge = (userId, competitionId, onSuccess, onFailure) => {
    Competition.findById(competitionId).then(comp => {
        comp.challengerId === userId ? comp.challengerConfirmed = true : comp.accepterConfirmed = true;
        comp.save().then(res => {
            onSuccess(res);
        }).catch(err => {
            onFailure(err);
        });
    }).catch(err => {
        onFailure(err);
    });
}

const getCompetitionHistory = (userId, friendId, onSuccess, onFailure) => {
    Competition.find({ $or : [
        {"challengerId" : userId, "accepterId" : friendId, challengerConfirmed : true, accepterConfirmed : true},
        {"accepterId" : userId, "challengerId" : friendId, challengerConfirmed : true, accepterConfirmed : true}
        ]
    }).then(resComps => {
        onSuccess(resComps);
    }).catch(err => {
        onFailure(err);
    });
}

const getVenueCompetitionHistory = (venueId, fromDate, toDate, onSuccess, onFailure) => {
    Competition.find({venueId : venueId}).then(resComps => {
        onSuccess(resComps);
    }).catch(err => {
        onFailure(err);
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
            }