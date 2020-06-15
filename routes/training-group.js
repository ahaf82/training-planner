const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

const TrainingGroup = require("../models/TrainingGroup");
const Member = require("../models/Member");

// @routes    Get api/training-group
// @desc      Get all training-groups
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        const trainingGroup = await TrainingGroup.find({ /*member: req.member._id*/ }).sort({
            name: 1,
        });
        res.json(trainingGroup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler");
    }
});

// @routes    POST api/training-group
// @desc      Add new training-group
// @access    Private
router.post(
    "/",
    [
        auth,
        [
            check('trainingGroup', 'Welche Gruppe?').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { trainingGroup } = req.body;

        try {
            const newTrainingGroup = new TrainingGroup({
                trainingGroup
            });

            const group = await newTrainingGroup.save();

            res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Fehler");
        }
    }
);

// @routes    Put api/trainingGroup/:id
// @desc      Update trainingGroup
// @access    Private
router.put("/:_id", auth, async (req, res) => {
    const { trainingGroup } = req.body;
    console.log(req.body);

    // Build trainingGroup object
    const trainingGroupFields = {};
    if (trainingGroup) trainingGroupFields.trainingGroup = trainingGroup;
    try {
        let trainingGroup = await TrainingGroup.findById(req.params._id);

        if (!trainingGroup) return res.status(404).json({ msg: 'Trainingsgruppe nicht gefunden' });

        trainingGroup = await TrainingGroup.findByIdAndUpdate(req.params._id,
            { $set: trainingGroupFields },
            { new: true });

        res.json(trainingGroup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }

});

// @routes    Delete api/trainingGroup/:id
// @desc      Delete trainingGroup
// @access    Private
router.delete("/:_id", auth, async (req, res) => {
    try {
        let trainingGroup = await TrainingGroup.findById(req.params._id);

        if (!trainingGroup) return res.status(404).json({ msg: 'Trainingsgruppe nicht gefunden' });

        await TrainingGroup.findByIdAndRemove(req.params._id);

        res.json('Trainingsgruppe gelöscht');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;
