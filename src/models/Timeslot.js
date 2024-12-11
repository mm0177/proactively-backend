const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimeSlot = sequelize.define('TimeSlot', {
  speakerId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  slot: { type: DataTypes.STRING, allowNull: false },
  isBooked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = TimeSlot;
