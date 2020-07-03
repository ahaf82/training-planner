const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

const Member = require("../models/Member");
const TrainingSession = require("../models/TrainingSession");
const TrainingGroup = require("../models/TrainingGroup");

// @routes    Get api/training-session
// @desc      Get all training-sessions
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        if (req.member.role === 'admin' || req.member.role === 'superUser' || req.member.role === 'member') {
            console.log('DA');
            trainingSession = await TrainingSession.find({}).sort({
                time: -1,
                date: -1
            });
        } else {
            console.log('Hier');
            trainingSession = await TrainingSession.find({}).sort({
                time: -1,
                date: -1
            });
        }

        res.json(trainingSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler");
    }
});

// @routes    POST api/training-session
// @desc      Add new training-session
// @access    Private
router.post(
    "/",
    [
        auth,
        [
            check('description', 'Beschreibung der Trainingseinheit').not().isEmpty(),
            check('time', 'Zu welcher Zeit findet die Trainingseinheit statt').not().isEmpty(),
            check('date', 'An welchem Tag findet die Trainingseinheit statt').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.errors[0].msg );
            return res.status(400).json({ msg: 'Bitte Beschreibung, Datum und Uhrzeit eingeben' });
        }

        const { trainingGroup, description, maxMembers, memberCount, time, date, members } = req.body;

        try {
            const newTrainingSession = new TrainingSession({
                description,
                time,
                date,
                maxMembers,
                memberCount,
                trainingGroup,
                members: []
            });

            const trainingSession = await newTrainingSession.save();

            res.json(trainingSession);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Fehler");
        }
    }
);

// @routes    Put api/trainingSession/:id
// @desc      Update trainingSession
// @access    Private
router.put("/:_id", auth, async (req, res) => {
    const { description, maxMembers, memberCount, members, time, date, trainingGroup } = req.body;

    // Build trainingSession object
    const trainingSessionFields = { members: [] };
    if (description) trainingSessionFields.description = description;
    if (trainingGroup) trainingSessionFields.trainingGroup = trainingGroup;
    if (maxMembers) trainingSessionFields.maxMembers = maxMembers;
    if (memberCount) trainingSessionFields.memberCount = memberCount;
    if (members) trainingSessionFields.members = members;
    if (time) trainingSessionFields.time = time;
    if (date) trainingSessionFields.date = date;
    try {
        let trainingSession = await TrainingSession.findById(req.params._id);
        console.log('Session: ' * trainingSession);

        if (!trainingSession) return res.status(404).json({ msg: 'Trainingseinheit nicht gefunden' });

        trainingSession = await TrainingSession.findByIdAndUpdate(req.params._id,
            { $set: trainingSessionFields },
            { new: true });

        res.json(trainingSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }

});

// @routes    Delete api/trainingSession/:id
// @desc      Delete trainingSession
// @access    Private
router.delete("/:_id", auth, async (req, res) => {
    try {
        let trainingSession = await TrainingSession.findById(req.params._id);

        if (!trainingSession) return res.status(404).json({ msg: 'Trainingseinheit nicht gefunden' });

        /* Make sure member owns trainingSession */
        // if (trainingSession.member.toString() !== req.user._id) {
        //     return res.status(401).json({ msg: 'Zugriff nicht authorisiert' });
        // }

        await TrainingSession.findByIdAndRemove(req.params._id);

        res.json('Trainingseinheit gelöscht');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;
