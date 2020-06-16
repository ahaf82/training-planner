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
    check('password', 'Bitte gib ein a Passwort mit mehr als 8 Zeichen, mindestens einem Großbuchstaben, einem Kleinbuchstaben und einem Sonderzeichen ein').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, address } = req.body;
        // const { street, postalCode, city } = address;

        try {
            let member = await Member.findOne({ email });

            if (member) {
                return res.status(400).json({ msg: 'Mitglied bereits vorhanden' });
            }

            member = new Member({
                name,
                email,
                password,
                // address: {
                //     street,
                //     postalCode,
                //     city
                // },
                role: "none"
            });

            const salt = await bcrypt.genSalt(12);

            member.password = await bcrypt.hash(password, salt);

            await member.save();

            const payload = {
                member: {
                    _id: member._id,
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
            res.status(500).json('Server Fehler');
        }
    });

// @routes    Get api/member
// @desc      Get all members
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        const member = await Member.find({}).sort({
            name: -1,
        });
        res.json(member);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler");
    }
});


// @routes    Put api/member/:id
// @desc      Update member
// @access    Private
router.put("/:_id", auth, async (req, res) => {
    const { trainingGroup, name, email, address, date } = req.body;
    
    // Build member object
    const memberFields = { address: {} };
    if (name) memberFields.name = name;
    if (email) memberFields.email = email;
    if (address.street) memberFields.address.street = address.street;
    if (address.postalCode) memberFields.address.postalCode = address.postalCode;
    if (address.city) memberFields.address.city = address.city;
    try {
        let editMember = await Member.findById(req.params._id);

        if (!editMember) return res.status(404).json({ msg: 'Mitglied nicht gefunden' });

        member = await Member.findByIdAndUpdate(req.params._id,
            { $set: memberFields },
            { new: true });

        res.json(member);
    } catch (err) {
        console.error(err.message);
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;

