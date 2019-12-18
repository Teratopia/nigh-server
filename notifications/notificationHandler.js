var apn = require('apn');
const path = require('path');

//const certPath = path.resolve(__dirname) + '/node_modules/apn/test/credentials/support/certIssuerKey.p12';
//const certPath = '../constants/Apple Development IOS Push Services: org.reactjs.native.example.Nigh2.cer';
//const certPath = path.resolve(__dirname) + '/constants/Apple Development IOS Push Services: org.reactjs.native.example.Nigh2.cer';

const certPath = path.resolve(__dirname) + '/../constants/AuthKey_6TKNHKXR46.p8';
const teamId = 'F559B6R2ZF';
const keyId = '6TKNHKXR46';
const bundleId = 'org.reactjs.native.example.Nigh2';
const deviceToken = 'c3fcaaf44153ea3f76b94329a4a5808780c92e62ddd070a020e2f87ba1557d9b';

var options = {
    token: {
      key: certPath,
      keyId: keyId,
      teamId: teamId
    },
    production: false
  };

try{
    var apnProvider = new apn.Provider(options);
} catch (e){
    console.log('apn error = ', e);
}
  
var testNote = new apn.Notification();
 
testNote.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
testNote.badge = 3;
testNote.sound = "ping.aiff";
testNote.alert = "You have a new message";
//testNote.payload = {'messageFrom': 'John Appleseed'};
testNote.payload = {'notificationType': 'chatMessage', 'text' : 'test'};
testNote.topic = bundleId;

console.log('noteHandler testNote = ', testNote);

apnProvider.send(testNote, deviceToken).then( (result) => {
    console.log('apn result = ', result);
    // see documentation for an explanation of result
  });

async function sendNotification(pnToken, text, payload = {}, expSecs = 30){
    
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + expSecs; 
    note.badge = 0;
    note.sound = "ping.aiff";
    note.alert = text;
    note.payload = payload;
    note.topic = bundleId;

    apnProvider.send(note, pnToken).then( (result) => {
        console.log('sendNotification apn result = ', result);
        // see documentation for an explanation of result
      });
}

export default { sendNotification }