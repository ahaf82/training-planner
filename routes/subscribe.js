const express = require("express");
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const webpush = require('web-push');

router.use(cors());
router.use(bodyParser.json());


// Push-Messages
webpush.setVapidDetails(
    "mailto:ahaf82@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Subscribe Route
router.post("/", async (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = subscription.payload;
    console.log(subscription.payload);
    console.log('Payload ist da...');

    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

module.exports = router;
