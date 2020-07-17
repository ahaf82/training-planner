const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Connect Firebase
const firebase = require("firebase-admin");
const serviceAccount = require("./training-planner-bafd0-firebase-adminsdk-em7w2-9e3ab2621b.json");

// The Firebase token of the device which will get the notification
// It can be a string or an array of strings
const firebaseToken = 'abcdeabcdeabcde';

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://training-planner-bafd0.firebaseio.com"
});

const payload = {
    notification: {
        title: 'Notification Title',
        body: 'This is an example notification',
    }
};

const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
};

firebase.messaging().sendToDevice(firebaseToken, payload, options);

// Connect DataBase
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define authentication routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/auth/facebook', require('./routes/auth'));
app.use('/api/auth/auth/facebook/callback', require('./routes/auth'));
app.use('/api/auth/auth/google', require('./routes/auth'));
app.use('/api/auth/auth/google/callback', require('./routes/auth'));
app.use('/api/auth/fail', require('./routes/auth'));

// Define private routes
app.use('/api/member', require('./routes/member'));
app.use('/api/training-group', require('./routes/training-group'));
app.use('/api/training-session', require('./routes/training-session'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder   
    app.use(express.static('client/build'));


    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });


}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
