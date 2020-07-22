const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

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
