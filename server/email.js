if (Meteor.isDevelopment && Meteor.settings.mail)
  process.env.MAIL_URL = Meteor.settings.mail;

export function sendAuthEmail(code, email) {
  Email.send({
    to: email,
    from: 'Whodis <access@whodis.email>',
    subject: 'Whodis Access Code',
    html: `Your Whodis access code for ${email} is <strong>${code}</strong>`
  });
}