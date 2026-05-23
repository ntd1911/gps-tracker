const express =
require("express");

const router =
express.Router();

const Parking =
require("../models/Parking");

// SAVE
router.post(
  "/save",
  async (req, res) => {

    try {

      const parking =
        new Parking(req.body);

      await parking.save();

      res.json({
        message:"Parking saved"
      });

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

// GET
router.get(
  "/:deviceId",
  async (req, res) => {

    try {

      const data =
        await Parking.findOne({

          deviceId:
          req.params.deviceId

        });

      res.json(data);

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

module.exports =
router;