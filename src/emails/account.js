const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    from: 'rmcguire@antelecom.net',
    to: email,
    subject: 'Thanks for joining the task manager family.',
    text: `Welcome to the task manager app, ${name}. Let me know how you get along with the app.`
  })
}

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    from: 'rmcguire@antelecom.net',
    to: email,
    subject: 'Sorry to see you go.',
    text: `Sorry to see you delete your user account with us, ${name}. If there is anything we can do to change your mind please respond to this email.`
  })
}
module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
