const mongoose = require('mongoose');

const TrainingGroupSchema = mongoose.Schema({
    trainingGroup: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('trainingGroup', TrainingGroupSchema);
