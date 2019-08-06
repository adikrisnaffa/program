
var firebase = require("firebase-admin");
var service_account = require("./app.json")

if (firebase.apps.length > 0) {
  firebase.app();
} else {
  firebase.initializeApp({
    credential: firebase.credential.cert(service_account),
    databaseURL: "https://kontrol-led-54e35.firebaseio.com"
  });
}

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});




module.exports = db;