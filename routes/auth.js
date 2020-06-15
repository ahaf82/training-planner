const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../middleware/auth');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const { check, validationResult } = require('express-validator');

const Member = require('../models/Member');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let member = await Member.findOne({ email })

        if (!member) {
            return res.status(400).json({ msg: 'Ungültige E-Mail Adresse' });
        }

        const isMatch = await bcrypt.compare(password, member.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Ungültiges Passwort' });
        }

        const payload = {
            member: {
                id: member._id,
                role: member.role
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.send({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
);


// FaceBook

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/auth/facebook/callback"
    //profileFields: [ "email", "name" ]
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Login mit Facebook');
            const { email, name } = profile._json;
            let member = await Member.findOne({ email })

            if (!member) {
                member = new Member({
                    name,
                    email
                });
                await member.save();
            }

            const payload = {
                member: {
                    id: member._id,
                    role: member.role
                }
            }
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.send({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
);


// Google

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/auth/google/callback",
    profileFields: [ "email", "name" ]
},
    async (token, tokenSecret, profile, done) => {
        try {
            const { email, name } = profile._json;
            let member = await Member.findOne({ email })

            if (!member) {
                console.log('New Member');
                member = new Member({
                    name,
                    email
                });
                await member.save();
            }


            const payload = {
                member: {
                    id: member._id,
                    role: member.role
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                console.log(token);
                res.send({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
);

// Twitter
/*
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        try {
            let member = await Member.findOne({ email: profile.emails.value })

            if (!member) {
                return res.status(400).json({ msg: 'Ungültige E-Mail Adresse' });
            }

            const isMatch = await bcrypt.compare(password, member.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Ungültiges Passwort' });
            }

            const payload = {
                member: {
                    id: member._id,
                    role: member.role
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.send({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
);*/


passport.serializeUser(function (member, done) {
    done(null, member);
});

passport.deserializeUser(function (member, done) {
    done(null, member);
});

// @routes    GET api/auth
// @desc      Get logged in member
// @access    Private
router.get('/', auth, async(req, res) => {
    try {
        console.log('Hallo member! ');
        const member = await Member.findById( req.member._id ).select('-password');
        console.log('Mitglied ist da', member.name)
        res.json(member);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
}); 

// @routes    POST api/auth
// @desc      Auth member and get token
// @access    Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let member = await Member.findOne({ email })

            if (!member) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, member.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                member: {
                    _id: member._id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.send({ token });
                next();
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


// FACEBOOK

// @routes    GET api/facebook
// @desc      Auth facebook member and get token
// @access    Public
 router.get('/auth/facebook', passport.authenticate('facebook'));

// @routes    GET api/facebook/callback
// @desc      Auth facebook member and get token
// @access    
router.get('/api/auth/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: 'http://google.de',
        failureRedirect: '/fail'
    })
);


// GOOGLE

// @routes    GET api/google
// @desc      Auth facebook member and get token
// @access    Public
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @routes    GET api/google/callback
// @desc      Auth google member and get token
// @access    
router.get('/auth/google/callback', 
    passport.authenticate('google'),
    async (req, res) => {
        console.log('Ich warte hier ein bisschen');
        res.redirect('/');
    }
);

router.get('/fail', (req, res) => {
    console.log('Das hat nicht geklappt');
    res.send('Authentifizierung fehlgeschlagen');
});

module.exports = router;

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
/*app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/ail' }),
    function (req, res) {
        res.redirect('/');
    });*/