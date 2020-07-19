const mongoose = require('mongoose');

const TrainingSessionSchema = mongoose.Schema({
  trainingGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trainingGroup'
  },
  description: {
    type: String,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member'
  }, 
  maxMembers: {
    type: Number
  },
  memberCount: {
    type: Number
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member'
  }],
  time: {
    type: String,
    required: true
  },
  timeTo: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('trainingSession', TrainingSessionSchema);
