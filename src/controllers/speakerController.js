const Speaker = require('../models/Speaker');

exports.addSpeakerProfile = async (req, res) => {
  const { expertise, pricePerSession } = req.body;
  try {
    const speaker = await Speaker.create({ userId: req.user.id, expertise, pricePerSession });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).send('Error adding speaker profile: ' + error.message);
  }
};
