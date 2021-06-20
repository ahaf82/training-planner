const mongoose = require('mongoose');

const TrainingGroupSchema = mongoose.Schema({
    trainingGroup: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        familyMember: [{
            type: mongoose.Types.ObjectId
        }],
        ref: 'member'
    }], 
    trainingSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainingSession'
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('trainingGroup', TrainingGroupSchema);
