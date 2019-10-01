import nodemailer from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY
    }
  })
);

/**
 * @sendMail : responsible for sending email
 * @argument emailObject
 * - to : [req.body.email]
 * - from: [ADD_YOUR_EMAIL_ADDRESS_HERE]
 * - subject: [YOUR_EMAIL_SUBJECT_MESSAGE_HERE]
 * - html: [ADD_HTML_TEMPLATE_OF_EMAIL_HERE]
 */
const sendMail = (userEmail, res) => {
  transporter.sendMail(
    {
      to: userEmail,
      from: 'contact@test.com',
      subject: 'Signup succeeded!',
      html: '<h1>You have signed up successfully!</h1>'
    },
    err => {
      if (err) return res.status(500).send(err);
    }
  );
};

export default sendMail;
