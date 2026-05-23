const express =
require("express");

const router =
express.Router();

const Device =
require("../models/Device");

// ADD DEVICE
router.post(
  "/add",
  async (req, res) => {

    try {

      const device =
        new Device(req.body);

      await device.save();

      res.json({
        message:"Device added"
      });

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

// GET USER DEVICES
router.get(
  "/:userId",
  async (req, res) => {

    try {

      const devices =
        await Device.find({

          userId:
          req.params.userId

        });

      res.json(devices);

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

module.exports =
router;