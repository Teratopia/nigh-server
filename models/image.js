const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    createDate : Date,
    source : { data : Buffer, contentType : String},
});

module.exports = mongoose.model('Image', imageSchema);