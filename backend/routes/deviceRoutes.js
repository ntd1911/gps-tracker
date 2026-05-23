const express =
require("express");

const router =
express.Router();

const Device =
require("../models/Device");
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ADD DEVICE
router.post('/add', authMiddleware, async (req, res) => {
  try {
    // attach userId from token if not provided
    const payload = req.body;
    payload.userId = payload.userId || req.user.userId;

    const device = new Device(payload);
    await device.save();
    res.json({ message: 'Device added' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER DEVICES
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user.userId });
    res.json(devices);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports =
router;