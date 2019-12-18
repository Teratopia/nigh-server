const mongoose = require('mongoose');
const Image = require('../models/image');
var multer = require('multer');
var fs = require('fs');

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: Storage })

const uploadImageAndReturnId = (imgPath, onSuccess, onFailure) => {
    console.log('uploadImageAndReturnId 2');
    const image = new Image({
        _id: mongoose.Types.ObjectId(),
        createDate: Date.now(),
    });
    image.source.data = fs.readFileSync(imgPath);
    image.save().then(imgDoc => {
        onSuccess(imgDoc);
    }).catch(err => {
        console.log('uploadImageAndReturnId failure 3 err = ');
        console.log(err);
        onFailure(err);
    });
}

const getImageById = (imageId, onSuccess, onFailure) => {
    Image.findById(imageId).then(image => {
        onSuccess(image);
    }).catch(e => {
        console.log('getImageById error = ', e);
        onFailure(e);
    })
}

export default {uploadImageAndReturnId, getImageById}