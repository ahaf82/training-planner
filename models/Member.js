const mongoose = require('mongoose');

const MemberSchema = mongoose.Schema({
    trainingGroup: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainingGroup'
    }],
    role: {
        type: String,
        required: true,
        default: "none",
        enum: ["none", "member", "admin", "superUser"]
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    address: {
        street: {
            type: String
        },
        postalCode: {
            type: Number
        },
        city: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('member', MemberSchema);
