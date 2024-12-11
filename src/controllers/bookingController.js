const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const transporter = require('../config/nodemailer.config');
const calendar = require('../config/googleCalender.config');

exports.bookSession = async (req, res) => {
  const { speakerId, date, timeSlot } = req.body;
  try {
    // Check availability
    const slot = await TimeSlot.findOne({ where: { speakerId, date, slot: timeSlot } });
    if (slot && slot.isBooked) {
      return res.status(400).send('Time slot already booked.');
    }

    // Create booking
    const booking = await Booking.create({ userId: req.user.id, speakerId, date, timeSlot });
    if (slot) {
      slot.isBooked = true;
      await slot.save();
    } else {
      await TimeSlot.create({ speakerId, date, slot: timeSlot, isBooked: true });
    }

    // Email notification
    const userEmail = req.user.email;
    const speaker = await Speaker.findOne({ where: { id: speakerId } });
    const speakerEmail = speaker.email;

    const emailMessage = `Session booked for ${date} at ${timeSlot}`;
    await transporter.sendMail({ to: [userEmail, speakerEmail], subject: 'Session Confirmation', text: emailMessage });

    // Google Calendar event
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: 'Session Booking',
        description: emailMessage,
        start: { dateTime: `${date}T${timeSlot}:00`, timeZone: 'UTC' },
        end: { dateTime: `${date}T${timeSlot + 1}:00`, timeZone: 'UTC' },
        attendees: [{ email: userEmail }, { email: speakerEmail }],
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).send('Error booking session: ' + error.message);
  }
};
