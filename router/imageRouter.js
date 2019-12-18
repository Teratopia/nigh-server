import imagePersistence from '../persistence/imagePersistence';

const uploadImageAndReturnId = (imgPath, req, res) => {
    console.log('# uploadImageAndReturnId doc 1');
    imagePersistence.uploadImageAndReturnId(imgPath, doc => {
        console.log('# uploadImageAndReturnId doc = ', doc);
        res.status(200).send({
        success : 'true',
        id : doc._id
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

const getImageById = (req, res) => {
    console.log('getImageById successful, req.body = ');
    var bodyJson = req.body;
    console.log(bodyJson);
    //username, password, latitude, longitude, onSuccess, onFailure
    imagePersistence.getImageById(bodyJson.imageId, doc => {
        console.log('# getImageById doc = ', doc);
        res.status(200).send({
        success : 'true',
        image : doc,
        })
    }, err => {
        console.log('# err = ', err);
        res.status(500).send({
        success : false,
        message : err
        })
    });
}

export default {uploadImageAndReturnId, getImageById}