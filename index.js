const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotificationToTopic = functions.firestore.document("Visitor Data/{uid}").onWrite(async (event) => {
    //let docID = event.after.id;
    let title = "Alert";
    let content = "New Visitor added";
    var message = {
        notification: {
            title: title,
            body: content,
        },
        topic: 'PushNotifications',
    };

    let response = await admin.messaging().send(message);
    console.log(response);
});