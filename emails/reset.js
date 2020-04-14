const keys = require('../keys');
module.exports = function(email, token) {
    return {
      to: email,
      from: keys.EMAIL_FROM,
      subject: 'Reset Password',
      html: `
        <h1>Forgot password?</h1>
        <p>If you didn't request a password reset, ignore this message. </p>
        <p>To complete your request, please follow the link below:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset Password</a></p>
        <h/>
      `
    }
  }