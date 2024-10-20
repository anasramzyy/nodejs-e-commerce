import nodemailer from 'nodemailer'

export const sendEmail = async ({to, subject, html, attachments}) => {
  // sender 
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS
    }
  })

  
  try {
    await transporter.verify();
    console.log('Server is ready to take messages');
  } catch (error) {
    console.error('Error verifying transporter:', error);
    return false; // Return false if verification fails
  }


  //reciever

  try {
    const emailInfo = await transporter.sendMail({
      from: `'Ramzy Company' <${process.env.EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log('Email sent:', emailInfo);
    return emailInfo.accepted.length > 0; // Return true if email sent
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Return false if sending fails
  }
};