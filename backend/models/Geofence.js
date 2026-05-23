const mongoose =
require("mongoose");

const GeofenceSchema =
new mongoose.Schema({

  deviceId:String,

  lat:Number,

  lng:Number,

  radius:Number,

  enabled:Boolean

});

module.exports =
mongoose.model(
  "Geofence",
  GeofenceSchema
);