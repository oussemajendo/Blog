const nodemailer = require('nodemailer') ;

module.exports  = async (userEmail,subject,htmlTemplate) => {
    try {
           // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL_ADDRESS,
          pass: process.env.APP_EMAIL_PASSWORD,
        }
      });
    // Prepare email data
    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log ('Email.sent:' + info.person);
 } catch (error) {
        throw new Error("Internal Server Error (Nodemailer)");
   }

}