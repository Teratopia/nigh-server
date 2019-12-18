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
    var query = {venueId : venueId};
    if(fromDate && toDate){
        query.createDate = { $gte: fromDate, $lte: toDate };
    }
    Competition.find(query).then(resComps => {
        onSuccess(resComps);
    }).catch(err => {
        onFailure(err);
    });
}

/*
{
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    endDate : Date,
    acceptedDate : Date,
    challengerId : String,
    accepterId : String,
    venueId : String,
    rules : {},
    challengerResultClaim : String,
    accepterResultClaim : String,
    gameType : String,
    challengerConfirmed : Boolean,
    accepterConfirmed : Boolean
}
*/

const getLeaderboardInfo = async (venueId, fromDate, toDate, onSuccess, onFailure) => {
    let userPoints = {};
    getVenueCompetitionHistory(venueId, fromDate, toDate, comps => {

        comps.forEach(comp => {
            var challengerId = comp.challengerId;
            var accepterId = comp.accepterId;
            if(comp.challengerResultClaim === 'win' && comp.accepterResultClaim === 'loss'){
                /*
                !userPoints[challengerId] ? 
                userPoints[challengerId] = {totalGamesPlayed : 1} : 
                userPoints[challengerId].totalGamesPlayed += 1;
                */
                if(userPoints[challengerId]){
                    userPoints[challengerId].totalGamesPlayed += 1;
                    userPoints[challengerId].totalWins ? 
                    userPoints[challengerId].totalWins += 1 : 
                    userPoints[challengerId].totalWins = 1;
                } else {
                    userPoints[challengerId] = {
                        totalGamesPlayed : 1,
                        totalWins : 1,
                        totalLosses : 0
                    }
                }
                userPoints[challengerId][accepterId] ? 
                userPoints[challengerId][accepterId] += 1 : 
                userPoints[challengerId][accepterId] = 1;
                /*
                !userPoints[accepterId] ? 
                userPoints[accepterId] = {totalGamesPlayed : 1} : 
                userPoints[accepterId].totalGamesPlayed += 1;
                */
                if(userPoints[accepterId]){
                    userPoints[accepterId].totalGamesPlayed += 1;
                    userPoints[accepterId].totalLosses ? 
                    userPoints[accepterId].totalLosses += 1 : 
                    userPoints[accepterId].totalLosses = 1;
                } else {
                    userPoints[accepterId] = {
                        totalGamesPlayed : 1,
                        totalLosses : 1,
                        totalWins : 0
                    }
                }
                userPoints[accepterId][challengerId] ? 
                userPoints[accepterId][challengerId] -= 1 : 
                userPoints[accepterId][challengerId] = -1;
                
            } else if(comp.challengerResultClaim === 'loss' && comp.accepterResultClaim === 'win'){
                /*
                !userPoints[challengerId] ? 
                userPoints[challengerId] = {totalGamesPlayed : 1} : 
                userPoints[challengerId].totalGamesPlayed += 1;
                */
                if(userPoints[challengerId]){
                    userPoints[challengerId].totalGamesPlayed += 1;
                    userPoints[challengerId].totalLosses ? 
                    userPoints[challengerId].totalLosses += 1 : 
                    userPoints[challengerId].totalLosses = 1;
                } else {
                    userPoints[challengerId] = {
                        totalGamesPlayed : 1,
                        totalLosses : 1,
                        totalWins : 0
                    }
                }
                userPoints[challengerId][accepterId] ? 
                userPoints[challengerId][accepterId] -= 1 : 
                userPoints[challengerId][accepterId] = -1;

                /*
                !userPoints[accepterId] ? 
                userPoints[accepterId] = {totalGamesPlayed : 1} : 
                userPoints[accepterId].totalGamesPlayed += 1;
                */
               if(userPoints[accepterId]){
                    userPoints[accepterId].totalGamesPlayed += 1;
                    userPoints[accepterId].totalWins ? 
                    userPoints[accepterId].totalWins += 1 : 
                    userPoints[accepterId].totalWins = 1;
                } else {
                    userPoints[accepterId] = {
                        totalGamesPlayed : 1,
                        totalWins : 1,
                        totalLosses : 0
                    }
                }
                userPoints[accepterId][challengerId] ? 
                userPoints[accepterId][challengerId] += 1 : 
                userPoints[accepterId][challengerId] = 1;

            }
        })
        const allUserIds = Object.keys(userPoints);
        User.find({ _id : { $in : allUserIds }}).then(userList => {
            let scoresList = [];
                userList.forEach(user => {
                let userId = user._id;
                let uniqueUsersPlayed = 0;
                let score = 0;
                let userPointsRecord = userPoints[userId];
                console.log('userPointsRecord = ', userPointsRecord);
                let usersPlayedIds = Object.keys(userPointsRecord);
                usersPlayedIds.forEach(id => {
                    if(id !== 'totalGamesPlayed' && id !== 'totalLosses' && id !== 'totalWins'){
                        uniqueUsersPlayed += 1;
                        let result = userPointsRecord[id];
                        if(result > 0){
                            score += 1;
                        }
                        //result === 0 ? null : result > 0 ? score += 1 : score -= 1;
                    }
                });

                userPoints[userId].score = score;
                userPoints[userId].uniqueUsersPlayed = uniqueUsersPlayed;
                userPoints[userId].user = user;
                scoresList.push(userPoints[userId]);
            });
            var sortedScoresList = scoresList.sort(function(a, b){
                if(a.score > b.score){
                    return -1;
                } else if (a.score < b.score) {
                    return 1;
                } else if (a.score === b.score){
                    if(a.uniqueUsersPlayed > b.uniqueUsersPlayed){
                        return -1;
                    } else if (a.uniqueUsersPlayed < b.uniqueUsersPlayed) {
                        return 1;
                    } else if (a.uniqueUsersPlayed === b.uniqueUsersPlayed){
                        if(a.totalGamesPlayed > b.totalGamesPlayed){
                            return -1;
                        } else if (a.totalGamesPlayed < b.totalGamesPlayed) {
                            return 1;
                        } else if (a.totalGamesPlayed === b.totalGamesPlayed){
                            a.tie = true;
                            b.tie = true;
                            return 0;
                        }
                    }
                }
            });
            var place = 1;
            for(var i = 0 ; i < sortedScoresList.length ; i++){
                sortedScoresList[i].place = place;
                if(sortedScoresList[i].tie && sortedScoresList[i+1] && sortedScoresList[i+1].tie){
                    //do nothing
                } else {
                    place++;
                }
            }
            onSuccess(sortedScoresList);
        }).catch(err => {
            console.log('getLeaderboardInfo err = ', err);
            onFailure(err);
        })
    }, err => {
        console.log('getLeaderboardInfo err = ', err);
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
                getVenueCompetitionHistory,
                getLeaderboardInfo
            }