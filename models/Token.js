const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "member",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,// this is the expiry time in seconds
    },
  });

  module.exports = mongoose.model("Token", TokenSchema);