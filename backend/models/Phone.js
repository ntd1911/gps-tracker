const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema({
  userId: String,
  phoneNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Phone", PhoneSchema);
