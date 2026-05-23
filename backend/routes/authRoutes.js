const express =
require("express");

const router =
express.Router();

const User =
require("../models/User");

// REGISTER
router.post(
  "/register",
  async (req, res) => {

    try {

      const user =
        new User(req.body);

      await user.save();

      res.json({
        message:"Register success"
      });

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

module.exports =
router;