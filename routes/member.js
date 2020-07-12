const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Member = require('../models/Member');

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
                role: "none"
            });

            const salt = await bcrypt.genSalt(12);

            member.password = await bcrypt.hash(password, salt);

            await member.save();

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
        console.log(req.member)
        if (req.member.role === 'admin') {
            member = await Member.find({}).sort({
                 name: 1
            });
        } else {
            member = await Member.find({ member: req.member._id }).sort({
                name: 1
            });
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
    const { name, email, role, trainingGroup, trainingSessions } = req.body;
    
    // Build member object
    const memberFields = { trainingGroup: [], trainingSessions: [] };
    if (name) memberFields.name = name;
    if (email) memberFields.email = email;
    if (trainingGroup) memberFields.trainingGroup = trainingGroup;
    if (role) memberFields.role = role;
    if (trainingSessions) memberFields.trainingSessions = trainingSessions;
    // if (address.street) memberFields.address.street = address.street;
    // if (address.postalCode) memberFields.address.postalCode = address.postalCode;
    // if (address.city) memberFields.address.city = address.city;
    try {
        let editMember = await Member.findById(req.params._id);

        if (!editMember) return res.status(404).json({ msg: 'Mitglied nicht gefunden' });

        member = await Member.findByIdAndUpdate(req.params._id,
            { $set: memberFields },
            { new: true });

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
        let member = await Member.findById(req.params._id);

        if (!member) return res.status(404).json({ msg: 'Mitglied nicht gefunden' });

        await Member.findByIdAndRemove(req.params._id);

        res.json('Mitglied gelöscht');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;

