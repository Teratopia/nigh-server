const mongoose = require('mongoose');
const User = require('../models/user');
const Venue = require('../models/venue');
const PoolTable = require('../models/poolTable');
const Image = require('../models/image');
const FriendRequest = require('../models/friendRequest');
const VenuePromotion = require('../models/venuePromotion');
var fs = require('fs');
const Bcrypt = require("bcryptjs");

const signUpVenue = (username, password, latitude, longitude, deviceId, onSuccess, onFailure) => {
    Venue.find({ username: username }).then(docs => {
        if(docs.length > 0){
            onFailure('Username Exists');
        } else {
            password = Bcrypt.hashSync(password, 10);
            const venue = new Venue({
                _id : mongoose.Types.ObjectId(),
                createDate : new Date(),
                lastLogin : new Date(),
                username : username,
                password : password,
                lastDeviceId : deviceId,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                email : null,
                googlePlaceId : null,
                googleVicinity : null,
                poolTables : [],
                venuePromotions : [],
                adminIds : [],
                houseRules : {}
            });
            venue.save().then(doc => {
                onSuccess(doc);
            }).catch(err => {
                onFailure(err);
            });
        }
    }).catch(err => {
        onFailure(err);
    })   
}

const loginVenue = (username, password, latitude, longitude, deviceId, onSuccess, onFailure) => {
    console.log('login venue 2');
    Venue.findOne({
        username: username
    }).then(doc => {
        if(Bcrypt.compareSync(password, doc.password)) {
            console.log('log in user success doc = ', doc);
            onSuccess(doc);
        } else {
            onFailure('Invalid password');
        }
    }).catch(err => {
        onFailure(err);
    })
}

const updateVenue = (venue, onSuccess, onFailure) => {
    console.log('login venue 2');
    /*
    Venue.findOneAndUpdate({_id : venue._id}, venue, {upsert:false, useFindAndModify:false}, function(err, doc){
        err ? onFailure(err) : onSuccess(doc);
    });
    */
    Venue.findById(venue._id).then(resVen => {
        resVen.updateOne(venue).then(res => {
            Venue.findById(venue._id).then(finalResVen => {
            onSuccess(finalResVen);
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

const queryVenues = (lat, long, radius, onSuccess, onFailure) => {
    console.log('queryVenues 2');
    var query = {
        location: {
            $near: {
                $maxDistance: radius,
                $geometry: {
                    type: "Point",
                    coordinates: [long, lat]
                }
            }
        },
    };
    Venue.find(query).then(venues => {
        onSuccess(venues);
    }).catch(err => {
        onFailure(err);
    });
}

const getVenueById = (venueId, onSuccess, onFailure) => {
    Venue.findById(venueId).then(venue => {
        onSuccess(venue);
    }).catch(err => {
        onFailure(err);
    });
}

const getPlayersCheckedIntoVenue = (venueId, activityName, onSuccess, onFailure) => {
    User.find({isActive : true, activeVenueId : venueId}).then(allUsers => {
        if(!activityName){
            onSuccess(allUsers);
        } else {
            var resUsers = [];
            allUsers.forEach(user => {
                user.statuses.forEach(status => {
                    if(status.activityName === activityName && status.active){
                        resUsers.push(resUsers);
                    }
                })
            })
            onSuccess(resUsers);
        }
    }).catch(err => {
        onFailure(err);
    });
}

const addTableToVenue = (venueId, poolTable, onSuccess, onFailure) => {
    const newTable = new PoolTable(poolTable);
    newTable._id = mongoose.Types.ObjectId();
    newTable.createDate = new Date();
    newTable.lastUpdated = new Date();
    newTable.save().then(resTable => {
        Venue.findById(venueId).then(resVen => {
            resVen.poolTables.push(resTable);
            resVen.save().then(updatedVen => {
                onSuccess(updatedVen);
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

const updateTable = (venueId, poolTable, onSuccess, onFailure) => {

    Venue.update({'poolTables._id' : poolTable._id}, 
        {
            '$set' : {
                'poolTables.$.name' : poolTable.name,
                'poolTables.$.price' : poolTable.price,
                'poolTables.$.priceUnit' : poolTable.priceUnit,
                'poolTables.$.size' : poolTable.size,
                'poolTables.$.lastUpdated' : new Date()
            }
        }).then(res => {
            Venue.findById(venueId).then(resVen => {
                onSuccess(poolTable, resVen);
            }).catch(err => {
                onFailure(err);
            });
        }).catch(err => {
            onFailure(err);
        });
}

const deletePoolTable = (venueId, tableId, onSuccess, onFailure) => {
    Venue.findByIdAndUpdate(
        venueId,
       { $pull: { 'poolTables': {  _id: tableId } } 
    }).then(res => {
        Venue.findById(venueId).then(venue => {
            onSuccess(venue);
        }).catch(err => {
            onFailure(err);
        });
    }).catch(err => {
        onFailure(err);
    });
}

const clearVenues = (onSuccess, onFailure) => {
    console.log('clearVenues 2');
    Venue.deleteMany({}).then(() => {
        onSuccess();
    }).catch(err => {
        onFailure(err);
    });
}

const clearVenuePromotions = (venueId, onSuccess, onFailure) => {
    console.log('clearVenues 2 venueId = '+venueId);
    if(venueId){
        Venue.findById(venueId).then(venue => {
            venue.update({venuePromotions : []}).then(res => {
                Venue.findById(venueId).then(resVen => {
                    onSuccess();
                }).catch(err => {
                    onFailure(err);
                });
            }).catch(err => {
                onFailure(err);
            });
        }).catch(err => {
            onFailure(err);
        });
    } else {
        VenuePromotion.deleteMany({}).then(() => {
            onSuccess();
        }).catch(err => {
            onFailure(err);
        });
    }
    
}

const getVenuePromotionImage = (venuePromotion, onSuccess, onFailure) => {
    if(venuePromotion.imageId){
                Image.findById(venuePromotion.imageId).then(imgDoc => {
                    console.log('getUserProfileImage success doc = ');
                    console.log(imgDoc);
                    onSuccess(imgDoc);
                }).catch(err => {
                    console.log('getUserProfileImage failure 1 err = ');
                    console.log(err);
                    onFailure(err);
                });
    } else {
        onFailure('No Image ID');
    }
    
}

const findAndUpdateVenuePromotion = (venueId, promotionId, name, fromDate, toDate, isActive, imgDoc, onSuccess, onFailure) => {
    /*
    var update = {
        name : name,
        fromDate : new Date(fromDate),
        toDate : new Date(toDate),
        isActive : isActive
    };
    imgDoc ? update.imageId = imgDoc._id : null;
    */
    var update = {
    'venuePromotions.$.name' : name,
    'venuePromotions.$.fromDate' : fromDate,
    'venuePromotions.$.toDate' : toDate,
    'venuePromotions.$.isActive' : isActive
    }

    if(imgDoc){
        update = {
            'venuePromotions.$.name' : name,
            'venuePromotions.$.fromDate' : fromDate,
            'venuePromotions.$.toDate' : toDate,
            'venuePromotions.$.isActive' : isActive,
            'venuePromotions.$.imageId' : imgDoc._id
        }
    }
    Venue.update({'venuePromotions._id' : promotionId}, 
        {
            '$set' : update
        }).then(res => {
            console.log('findAndUpdateVenuePromotion res = ', res);
            Venue.findById(venueId).then(resVen => {
                onSuccess(resVen);
            }).catch(err => {
                onFailure(err);
            });
        }).catch(err => {
            onFailure(err);
        });

    /*
    VenuePromotion.findByIdAndUpdate(promotionId, update).then(promotion => {
        Venue.findById(venueId).then(venueDoc => {
            onSuccess(venueDoc);
        }).catch(err => {
            console.log('upsertVenuePromotion failure 2 err = ');
            console.log(err);
            onFailure(err);
        });
    })
    */
}

const createVenuePromotionAndAddToVenuePromotionsList = (venueId, name, fromDate, toDate, isActive, imgDoc, onSuccess, onFailure) => {
    var venuePromotion = new VenuePromotion({
        _id: mongoose.Types.ObjectId(),
        createDate: Date.now(),
        name : name,
        fromDate : new Date(fromDate),
        toDate : new Date(toDate),
        isActive : isActive
    });
    imgDoc ? venuePromotion.imageId = imgDoc._id : null;
    venuePromotion.save().then(promotion => {
        Venue.findById(venueId).then(venueDoc => {
            venueDoc.venuePromotions.push(promotion);
            venueDoc.save().then(doc => {
                console.log('upsertVenuePromotion success doc = ');
                console.log(doc);
                onSuccess(doc);
            }).catch(err => {
                console.log('upsertVenuePromotion failure 1 err = ');
                console.log(err);
                onFailure(err);
            });
        }).catch(err => {
            console.log('upsertVenuePromotion failure 2 err = ');
            console.log(err);
            onFailure(err);
        });
    });
}

const upsertVenuePromotion = (imgPath, venueId, promotionId, name, fromDate, toDate, isActive, onSuccess, onFailure) => {
    if(imgPath){
        console.log('fromDate = '+fromDate);
        const image = new Image({
            _id: mongoose.Types.ObjectId(),
            createDate: Date.now(),
        });
        image.source.data = fs.readFileSync(imgPath);
        image.save().then(imgDoc => {
            if(promotionId){
                findAndUpdateVenuePromotion(venueId, promotionId, name, fromDate, toDate, isActive, imgDoc, onSuccess, onFailure);
            } else {
                createVenuePromotionAndAddToVenuePromotionsList(venueId, name, fromDate, toDate, isActive, imgDoc, onSuccess, onFailure);
            }
        }).catch(err => {
            console.log('upsertVenuePromotion failure 3 err = ');
            console.log(err);
            onFailure(err);
        });
    } else {
        if(promotionId){
            findAndUpdateVenuePromotion(venueId, promotionId, name, fromDate, toDate, isActive, null, onSuccess, onFailure);
        } else {
            createVenuePromotionAndAddToVenuePromotionsList(venueId, name, fromDate, toDate, isActive, null, onSuccess, onFailure);
        }
    }
}

const deletePromotion = (venueId, promotionId, onSuccess, onFailure) => {
    VenuePromotion.findByIdAndDelete(promotionId).then(() => {
        Venue.findByIdAndUpdate(
            venueId,
           { $pull: { 'venuePromotions': {  _id: promotionId } } 
        }).then(res => {
            Venue.findById(venueId).then(venue => {
                onSuccess(venue);
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


/*
const fetchVenuePromotions = (venueId, onSuccess, onFailure) => {
    Venue.findById(venueId).then(venue => {
        VenuePromotion.find({_id : { $in : venue.friendsIdList}}).then(venuePromotions => {

            if(!activityName){
                onSuccess(allUsers);
            } else {
                var resUsers = [];
                allUsers.forEach(user => {
                    user.statuses.forEach(status => {
                        if(status.activityName === activityName && status.active){
                            resUsers.push(resUsers);
                        }
                    })
                })
                onSuccess(resUsers);
            }
        }).catch(err => {
            onFailure(err);
        });
    })  
    
}
*/

export default {    signUpVenue, 
                    loginVenue,
                    updateVenue,
                    queryVenues,
                    clearVenues,
                    addTableToVenue,
                    updateTable,
                    getVenueById,
                    getPlayersCheckedIntoVenue,
                    deletePoolTable,
                    upsertVenuePromotion,
                    clearVenuePromotions,
                    getVenuePromotionImage,
                    deletePromotion
                };