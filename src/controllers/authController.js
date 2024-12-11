const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.config');
const otpGenerator = require('../utils/otpGenerator');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/dotenv.config');

let otps = {}; // Store OTPs temporarily (for demo; use Redis for production)

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, role });

    // Generate and send OTP
    const otp = otpGenerator();
    otps[email] = otp;

    await transporter.sendMail({
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP is: ${otp}`,
    });

    res.status(201).send('User created. Verify using OTP sent to email.');
  } catch (error) {
    res.status(500).send('Error signing up: ' + error.message);
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (otps[email] && otps[email] === otp) {
      const user = await User.findOne({ where: { email } });
      user.isVerified = true;
      await user.save();
      delete otps[email];
      res.status(200).send('Account verified.');
    } else {
      res.status(400).send('Invalid OTP.');
    }
  } catch (error) {
    res.status(500).send('Error verifying OTP: ' + error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid credentials.');
    }

    if (!user.isVerified) return res.status(403).send('Account not verified.');

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
};
