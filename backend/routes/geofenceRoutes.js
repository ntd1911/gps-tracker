const express =
require("express");

const router =
express.Router();

const Geofence =
require("../models/Geofence");

// SAVE GEOFENCE
router.post(
  "/save",
  async (req, res) => {

    try {

      console.log(req.body);

      const geofence =
        new Geofence({

          deviceId:
            req.body.deviceId,

          lat:
            req.body.lat,

          lng:
            req.body.lng,

          radius:
            req.body.radius,

          enabled:
            req.body.enabled

        });

      await geofence.save();

      res.json({
        success:true,
        message:"Geofence saved"
      });

    }

    catch(err) {

      console.log(err);

      res.status(500).json({

        success:false,

        error:err.message

      });
    }
  }
);

// GET
router.get(
  "/:deviceId",
  async (req, res) => {

    try {

      const data =
        await Geofence.findOne({

          deviceId:
            req.params.deviceId

        });

      res.json(data);

    }

    catch(err) {

      res.status(500).json({

        error:err.message

      });
    }
  }
);

module.exports =
router;