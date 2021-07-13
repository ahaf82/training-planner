const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

const Email = require("../models/Email");
const Member = require("../models/Member");
const sendEmail = require('../utils/email/sendEmail');

// @routes    Get api/email
// @desc      Get all emails
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        email = await Email.find({}).sort({
            email: -1
        });
        res.json(email);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler");
    }
});

// @routes    POST api/email
// @desc      Add new email
// @access    Private
router.post(
    "/",
    [
        auth
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("body", req.body);
        let { from, to, subject, message } = req.body;

        if (to == '') to = "alle";

        try {
            const newEmail = new Email({
                from,
                to,
                subject,
                message
            });

            // Convert Object Id to Name
            let members, groupMembers, subMembers = [];

            if (to == "alle") groupMembers = await Member.find({});
            else {
                members = await Member.find({});
                groupMembers = await members.filter(member => member.trainingGroup.includes(to)).map(obj => obj);
                subMembers = await members.filter(element => element.familyMember.length > 0);
                subMembers = await subMembers.filter(obj => obj.familyMember.filter(member => member.trainingGroup.includes(to)).length > 0);
                groupMembers = groupMembers.concat(subMembers);
            }
            const emails = await groupMembers.map(obj => obj.email);
            const email = await newEmail.save();
            // console.log("gorupes", groupMembers);
            // console.log("subs", subMembers);
            console.log("mailadresses", emails);
            // console.log("submembers", subMembers);
            groupMembers.forEach(member =>  {
                let name = (member.name + " ").split(" ")[0];
                sendEmail(member.email, subject, { name: name, message: message }, "./template/sendOwnMail.handlebars");
            });
            email.groupMembers = groupMembers;
            res.json(email);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Fehler");
        }
    }
);

// @routes    Put api/email/:id
// @desc      Update email
// @access    Private
router.put("/:_id", auth, async (req, res) => {
    const { email, subject, message } = req.body;

    // Build email object
    const emailFields = { subject: [], message: [] };
    if (trainingGroup) emailFields.trainingGroup = email;
    if (subject) emailFields.subject = subject;
    if (message) emailFields.message = message;
    try {
        let email = await Email.findById(req.params._id);

        if (!email) return res.status(404).json({ msg: 'Email nicht gefunden' });

        email = await Email.findByIdAndUpdate(req.params._id,
            { $set: emailFields },
            { new: true });

        res.json(email);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }

});

// @routes    Delete api/email/:id
// @desc      Delete email
// @access    Private
router.delete("/:_id", auth, async (req, res) => {
    try {
        let email = await Email.findById(req.params._id);

        if (!email) return res.status(404).json({ msg: 'Email nicht gefunden' });

        await Email.findByIdAndRemove(req.params._id);

        res.json('Email gelöscht');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;
