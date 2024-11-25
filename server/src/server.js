const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit'); // Correct import

const app = express();

// Set up the rate limiter with 5 requests per minute
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Maximum 5 requests per minute
  message: 'Too many requests from this IP. Please try again later.',
});
app.use(rateLimiter);
app.use(xssClean()); // Protect against XSS attacks
app.use(morgan('dev')); // Log HTTP requests in the console
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// This route uses the rate limiter middleware
app.get("/test", rateLimiter, (req, res) => {
  res.status(200).send({
    message: "API is working fine", // Response for the /test route
  });
});

// This route handles user profile data
app.get("/api/users", (req, res) => {
  console.log("GET /api/users route hit"); // Log when the route is hit
  res.status(200).send({
    message: "User profile is returned", // Response for the /api/users route
  });
});

// Error handling for undefined routes
app.use((req, res, next) => {
  console.log(`Route ${req.originalUrl} not found`); // Log the not found route
  res.status(404).json({ message: 'Route not found' }); // Return 404 error for undefined routes
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).send('Something broke!'); // Return 500 error if something goes wrong
});

// Start the server and listen on port 3001
app.listen(3001, () => {
  console.log("Server is running at http://localhost:3001");
});
