const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const webpush = require('web-push');

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
app.use('/api/auth/request-password-reset', require('./routes/auth'));
app.use('/api/auth/reset-password', require('./routes/auth'));
app.use('/api/auth/fail', require('./routes/auth'));

// Define private routes
app.use('/api/member', require('./routes/member'));
app.use('/api/training-group', require('./routes/training-group'));
app.use('/api/training-session', require('./routes/training-session'));

// Emails
app.use('/api/email', require('./routes/email'));

// Push Notification
app.use('/subscribe', require('./routes/subscribe'));


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
