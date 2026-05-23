const mongoose =
require("mongoose");

const ParkingSchema =
new mongoose.Schema({

  deviceId:String,

  lat:Number,

  lng:Number

});

module.exports =
mongoose.model(
  "Parking",
  ParkingSchema
);