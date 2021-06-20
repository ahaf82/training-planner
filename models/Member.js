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
        enum: ["none", "member", "trainer", "admin", "superUser"]
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
    passwordReset: { 
        type: String, select: false 
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
    trainingSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainingSession'
    }], 
    devices: [{
        endpoint: {
            type: String
        },
        expirationTime: {
            type: String
        },
        keys: {
            p256dh: {
                type: String
            },
            auth: {
                type: String
            }
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    familyMember: [{
        name: {
            type: String,
            required: true
        },
        trainingGroup: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trainingGroup'
        }],
        trainingSessions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trainingSession'
        }]
    }]
},
{
  timestamps: true,
})

module.exports = mongoose.model('member', MemberSchema);
