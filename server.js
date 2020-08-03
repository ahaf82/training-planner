const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const webpush = require('web-push');

const app = express();

app.use(bodyParser.json())

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


// Push-Messages
webpush.setVapidDetails(
    "mailto:ahaf82@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = subscription.payload;
    console.log('Payload ist da...');

    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});


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
