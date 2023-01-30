const functions = require("firebase-functions");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { user } = require("firebase-functions/v1/auth");
admin.initializeApp(functions.config().firebase);
//google account credentials used to send email
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'arkamazumder0@gmail.com',
        pass: 'vgcsinjjmzkgufjz'
    }
});
exports.sendNotificationToTopic = functions.firestore.document("Visitor Data/{uid}").onCreate(async (change, context) => {
    //let docID = event.after.id;
   
    let nameOfVisitor = "Visitor "+ change.data().nameOfVisitor + " is at your office 🏘";
    let title = "Visitor's Alert!";
   // let content = nameOfVisitor;
    var message = {
        notification: {
            title: title,
            body: nameOfVisitor,
           
        },
        topic: 'PushNotifications',
    };
    
    let response = await admin.messaging().send(message);
    //console.log(response);
    console.log(nameOfVisitor);
});
exports.seen = functions.firestore.document("Visitor Data/{uid}").onUpdate(async (change, context) => {
    //let docID = event.after.id;
   
    let nameOfVisitor = change.after.data().nameOfVisitor;
    let name_Of_seen = change.after.data().nameofsubmitor;
    let body ="Visitor "+ nameOfVisitor +" has been seen by admin";
    let title = "Visitor's Alert!";
   // let content = nameOfVisitor;
    var message = {
        notification: {
            title: title,
            body: body,
           
        },
        topic: 'PushNotifications',
    };

    let response = await admin.messaging().send(message);
    //console.log(response);
    console.log(nameOfVisitor);
});

exports.delete = functions.firestore.document("Visitor Data/{uid}").onDelete(async (change, context) => {
    //let docID = event.after.id;
    let body = "❌ A visitor has been deleted "
    let title = "Visitor's Alert!";
    function sendEmail() {
        Email.send({
          Host: "smtp.gmail.com",
          Username: "sender@email_address.com",
          Password: "Enter your password",
          To: 'receiver@email_address.com',
          From: "sender@email_address.com",
          Subject: "Sending Email using javascript",
          Body: "Well that was easy!!",
        })
          .then(function (message) {
            alert("mail sent successfully")
          });
      }
    var message = {
        notification: {
            title: title,
            body: body,
           
        },
        topic: 'PushNotifications',
    };

    let response = await admin.messaging().send(message);
    
});

//make admin
exports.newUserSignUp = functions.auth.user().onCreate((user)=>{
    console.log('user created',user.email,user.uid);
    const mailOptions = {
        from: `arkamazumder0@gmail.com`,
        to: `arka.asl@gmail.com`,
        subject: 'New User',
        html: `<h1>New User has been register to your app!</h1>
                            <p>
                               <b>User Email is: </b>${user.email}<br>
                            </p>
                            <p>
                            <b>Check the app admin console to verify the user<br>
                         </p>
                            `
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        console.log("Sent!")
    });
});

