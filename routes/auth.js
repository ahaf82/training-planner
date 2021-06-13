const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendEmail = require('../utils/email/sendEmail');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const { check, validationResult } = require('express-validator');

const Member = require('../models/Member');
const Token = require('../models/Token');

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

const requestPasswordReset = async (email, url) => {

    console.log("reqpasswordreset", email)
    const member = await Member.findOne({ email });
    const clientURL = url;
    const bcryptSalt = 10;
    console.log("member", email, member, clientURL)

    if (!member) throw new Error("Member does not exist");
    let token = await Token.findOne({ memberId: member._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    await new Token({
        memberId: member._id,
        token: hash,
        createdAt: Date.now(),
    }).save();
    console.log("HEXTOK", resetToken)
    const link = `${clientURL}/api/auth/reset-password?token=${resetToken}&id=${member._id}`;
    sendEmail(member.email, "Rücksetzung deines Passworts", { name: member.name, link: link, }, "./template/requestResetPassword.handlebars");
    return link;
};


const resetPassword = async (memberId, token, password, newPassword) => {
    console.log("im in the reser", token);
    let passwordResetToken = await Token.findOne({ memberId });
    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }
    console.log("pwtoken", passwordResetToken);
    console.log("token", token);
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    console.log("trueValid", isValid)
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, Number(10));
    await Member.updateOne(
        { _id: memberId },
        { $set: { password: hash } },
        { new: true }
    );
    const member = await Member.findById({ _id: memberId });
    sendEmail(
        member.email,
        "Du hast dein Passwort erfolgreich zurückgesetzt",
        {
            name: member.name, password: password
        },
        "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
};

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
            }, (error, token) => {
                if (error) throw error;
                console.log(token);
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
        console.log('Mitglied ist da', member.role)
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
            console.log('hier');
            let emailUser = email.toLowerCase();
            console.log(emailUser);
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
        console.log('Ich warte hier ein bisschen');
        res.redirect('/');
    }
);

// @routes    GET api/auth/request-password-reset
// @desc      Get logged in member
// @access 
router.post('/request-password-reset', async (req, res) => {
    try {
        console.log("request pw reset", req.body.email);
        const requestPasswordResetService = await requestPasswordReset(
            req.body.email.toLowerCase(), req.get('host')
        );
        return res.json(requestPasswordResetService);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }
});

// @routes    GET api/auth/reset-password
// @desc      Get logged in member
// @access 
router.get('/reset-password', async (req, res) => {
    try {
        console.log("boooday", req.query.id);
        console.log(req.query.npw);
        const member = await Member.findOne({ _id: req.query.id });
        console.log("member", member)
        const resetPasswordService = await resetPassword(
            member._id,
            req.query.token,
            member.password,
            req.query.npw
        );
        return res.json(resetPasswordService);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }
});

router.get('/fail', (req, res) => {
    console.log('Das hat nicht geklappt');
    res.send('Authentifizierung fehlgeschlagen');
});

module.exports = router;
