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
        console.log(email);
        let member = await Member.findOne({ email });

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
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.send({ token });
        });
    } catch (error) {
        console.error(error.message);
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
                expiresIn: 3600
            }, (error, token) => {
                if (error) throw error;
                res.send({ token });
            });
        } catch (error) {
            console.error(error.message);
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
    profileFields: ["email", "name"]
},
    async (token, tokenSecret, profile, done) => {
        try {
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
            }, (error, token) => {
                if (error) throw error;
                res.send({ token });
            });
        } catch (error) {
            console.error(error.message);
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
            }, (error, token) => {
                if (error) throw error;
                res.send({ token });
            });
        } catch (error) {
            console.error(error.message);
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
router.get('/', auth, async (req, res) => {
    try {
        const member = await Member.findById(req.member._id).select('-password');
        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }
});

// @routes    POST api/auth
// @desc      Auth member and get token
// @access    Public
router.post('/', [
    check('email', 'Bitte gib eine gültige E-Mail Adresse ein').isEmail(),
    check('password', 'Bitte Passwort eingeben').exists()
],
    async (req, res, next) => {
        console.log(res.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.errors[0].msg });
        }

        const { email, password } = req.body;
        
        try {

            let emailUser = email.toLowerCase();
          
            let member = await Member.findOne({ email: emailUser });

            if (!member) {
                return res.status(400).json({ msg: 'Ungültige E-Mail Adresse oder Passwort' });
            }

            const isMatch = await bcrypt.compare(password, member.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Ungültige E-Mail Adresse oder Passwort' });
            }

            const payload = {
                member: {
                    _id: member._id,
                    role: member.role
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (error, token) => {
                if (error) throw error;
                res.send({ token });
                next();
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Fehler');
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
        res.redirect('/');
    }
);

router.get('/fail', (req, res) => {
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