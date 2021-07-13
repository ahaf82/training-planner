const mongoose = require('mongoose');

const EmailSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now("<YYYY-mm-ddTHH:MM:ss>")
    }
})

module.exports = mongoose.model('email', EmailSchema);