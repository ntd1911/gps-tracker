const express =
require("express");

const router =
express.Router();

const User =
require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post(
  "/register",
  async (req, res) => {

    try {

      // hash password
      const { username, password } = req.body;
      const hash = await bcrypt.hash(password, 10);

      const user = new User({ username, password: hash });
      await user.save();

      res.json({ message: "Đã đăng ký thành công" });

    }

    catch(err) {

      res.status(500).json(err);
    }
  }
);

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports =
router;