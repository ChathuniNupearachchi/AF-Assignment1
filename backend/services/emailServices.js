const nodemailer = require('nodemailer');

// Function to send email
async function sendEmail(to, subject, text) {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user:process.env.SENDER_EMAIL,
                pass:process.env.SENDER_PASSWORD,// Your email password or app-specific password
            },
        });

        // Send mail with defined transport object

        const info = await transporter.sendMail({
            from:process.env.SENDER_EMAIL, // Sender email address
            to: to, 
            subject: subject,
            text: text,  
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = sendEmail;
