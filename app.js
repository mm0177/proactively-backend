const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Swagger docs

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const speakerRoutes = require('./src/routes/speakerRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

// Initialize App
dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/bookings', bookingRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("Welcome to the Speaker Booking API!");
  });
  