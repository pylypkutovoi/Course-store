const keys = require('../keys');

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration',
    html: `
      <h1>Welcome</h1>
      <p>Registration completed successfully - ${email}</p>
      <h/>
      <a href="${keys.BASE_URL}">Course store</a>
    `
  }
}