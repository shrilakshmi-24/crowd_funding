const nodemailer = require('nodemailer');
require('dotenv').config();
// Create a Nodemailer transporter using the SMTP host
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // Set to true if using port 465 with SSL/TLS
  auth: {
    user: 'tuts_pack@hotmail.com',
    pass: process.env.pass,
  },
});

// Send an email using the transporter
transporter.sendMail({
  from: 'tuts_pack@hotmail.com',
  to: 'shreeshenoy24@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email sent using Nodemailer.',
}, (error, info) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Email sent:', info.response);
  }
});
