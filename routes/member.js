const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const util = require('util');

const Member = require('../models/Member');
const sendEmail = require('../utils/email/sendEmail');

// @routes    POST api/member
// @desc      Register a member
// @access    Private
router.post('/', [
    check('name', 'Bitte gib einen Namen ein').not().isEmpty(),
    check('email', 'Bitte gib eine gültige E-Mail Adresse ein').isEmail(),
    check('password', 'Bitte gib ein Passwort mit mindestens 8 Zeichen, mindestens einem Großbuchstaben, einem Kleinbuchstaben und einem Sonderzeichen ein').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.errors[0].msg });
        }

        const { name, email, password } = req.body;

        try {
            let emailUser = email.toLowerCase();
            let member = await Member.findOne({ emailUser });

            if (member) {
                return res.status(400).json({ msg: 'E-Mail Adresse bereits vergeben' });
            }

            member = new Member({
                name,
                email: emailUser,
                password,
                trainingGroup: [],
                trainingSessions: [],
                familyMember: [],
                role: "none"
            });

            const salt = await bcrypt.genSalt(12);

            member.password = await bcrypt.hash(password, salt);

            await member.save();

            const adminMails = [ { mail: "info@kentai-plan.de", firstName: "Armin" }, { mail: "Lubehrla@gmail.com", firstName: "Lutz" } ];

            for (let admin of adminMails) {
                sendEmail(
                    admin.mail,
                    "Ein neues Mitglied hat sich angemeldet",
                    {
                        adminName: admin.firstName,
                        name: member.name
                    },
                    "./template/infoToCheckInMember.handlebars"
                )
            }

            const payload = {
                member: {
                    _id: member._id
                    // role: member.role
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
            res.status(500).json('Server Fehler');
        }
    });

// @routes    Get api/member
// @desc      Get all members
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        if (req.member.role === 'admin' || req.member.role === 'trainer' || req.member.role === 'member') {
            member = await Member.find({}).sort({
                name: 1
            });
        } else {
            member = await Member.find({ member: req.member._id }).sort({
                name: 1
            }).concat(Member.find(role === 'admin' || role === 'trainer'));
        }

        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Fehler");
    }
});


// @routes    Put api/member/:id
// @desc      Update member
// @access    Private
router.put("/:_id", auth, async (req, res) => {

    try {

        let memberArray = [];
        let subuser = false;
        let member = await Member.findById(req.params._id);

        if (!member) {
            memberArray = await Member.find({ familyMember: { $elemMatch: { _id: req.params._id} } });
            subuser = true;
            console.log("member is subuser", memberArray);

            if (!member && memberArray.length === 0) {
                return res.status(404).json({ msg: 'Mitglied nicht gefunden' });
            }
        }
        
        if (subuser === true) {
            const { name, email, role, trainingGroup, trainingSessions, familyMember, devices } = memberArray[0];

            let userData = familyMember.filter(subuser => subuser._id.toString() === req.params._id.toString())[0];
            let updatedSubUser = {
                _id: userData._id,
                name: userData.name,
                role: req.body.role,
                trainingGroup: req.body.trainingGroup,
                trainingSessions: req.body.trainingSessions
            }
           
            // console.log("body", req.body);
            // console.log("subuser", updatedSubUser);
            
            const memberFields = {};
            memberFields.name = name;
            memberFields.email = email;
            memberFields.trainingGroup = trainingGroup;
            memberFields.role = role;
            memberFields.trainingSessions = trainingSessions;
            memberFields.familyMember = [ updatedSubUser, ...familyMember.filter(subuser => subuser._id.toString() != req.params._id.toString())];
            memberFields.devices = devices;

            try {
                console.log("user", memberFields);
                console.log(util.inspect(memberFields, {showHidden: false, depth: null})) 
                console.log("filtered", familyMember.filter(subuser => subuser._id.toString() != req.params._id.toString()))  ;    
                member = await Member.findByIdAndUpdate(memberArray[0]._id,
                    { $set: memberFields },
                    { new: true });
        
                return res.json(member);
            } catch (error) {
                console.error(error.message);
                res.status(500).send('Server Fehler');
            }
        }

        const { name, email, role, trainingGroup, trainingSessions, familyMember, devices } = req.body;

        // Build member object
        const memberFields = {};
        if (name) memberFields.name = name;
        if (email) memberFields.email = email;
        if (trainingGroup) memberFields.trainingGroup = trainingGroup;
        if (role) memberFields.role = role;
        if (trainingSessions) memberFields.trainingSessions = trainingSessions;
        if (familyMember) memberFields.familyMember = familyMember;
        if (devices) memberFields.devices = devices;

        member = await Member.findByIdAndUpdate(req.params._id,
            { $set: memberFields },
            { new: true });

        console.log("bodyreq", req.body);
        console.log("email", email);
        if (req.body.sendMail !== undefined && req.body.sendMail == true) {
            console.log("mail will be sent", email);
            sendEmail(
                email,
                "Du bist eingecheckt",
                {
                    name: member.name
                },
                "./template/checkedInMember.handlebars"
            )
        }

        res.json(member);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }

});

// @routes    Delete api/member/:id
// @desc      Delete member
// @access    Private
router.delete("/:_id", auth, async (req, res) => {
    try {
        let memberArray = [];
        let subuser = false;
        let member = await Member.findById(req.params._id);
        // console.log("subuser", req.params._id);

        if (!member) {
            memberArray = await Member.find({ familyMember: { $elemMatch: { _id: req.params._id} } });
            subuser = true;
            console.log("member is subuser", memberArray);

            if (!member && memberArray.length === 0) {
                return res.status(404).json({ msg: 'Mitglied nicht gefunden' });
            }
        }
        // console.log("subuser", subuser);
        // console.log("subuser", req.params._id);
        
        if (subuser === true) {
            // member = await member.familyMember.filter(subuser => subuser._id != req.params._id);
            const { name, email, role, trainingGroup, trainingSessions, familyMember, devices } = memberArray[0];
            
            const memberFields = {};
            memberFields.name = name;
            memberFields.email = email;
            memberFields.trainingGroup = trainingGroup;
            memberFields.role = role;
            memberFields.trainingSessions = trainingSessions;
            memberFields.familyMember = familyMember.filter(subuser => subuser._id.toString() != req.params._id.toString());
            memberFields.devices = devices;
            try {
                console.log("user", memberFields);  
                console.log("filtered", familyMember.filter(subuser => subuser._id.toString() != req.params._id.toString()))  ;    
                member = await Member.findByIdAndUpdate(memberArray[0]._id,
                    { $set: memberFields },
                    { new: true });
        
                return res.json(member);
            } catch (error) {
                console.error(error.message);
                res.status(500).send('Server Fehler');
            }
        }

        await Member.findByIdAndRemove(req.params._id);

        res.json('Mitglied gelöscht');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;

