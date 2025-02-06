import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.Email as string,
    pass: process.env.Email_password as string,
  },
});

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const mailOptions = {
    from: process.env.Email,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
