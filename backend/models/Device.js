const mongoose =
require("mongoose");

const DeviceSchema =
new mongoose.Schema({

  userId:String,

  deviceId:String,

  deviceName:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  "Device",
  DeviceSchema
);