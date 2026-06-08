const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Phone = require("../models/Phone");

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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const phone = new Phone({
      userId: req.user.userId,
      phoneNumber
    });

    await phone.save();
    res.json({ message: 'Phone saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to save phone', error: err.message });
  }
});

module.exports = router;
