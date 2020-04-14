const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: {api_key: keys.SENDGRID_API_KEY}
}));


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
    logError: req.flash('logError'),
    regError: req.flash('regError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const isEqual = await bcrypt.compare(password, candidate.password);
      if (isEqual) {
        const user = candidate;
        req.session.user = user
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) {
            throw err
          }
        })
        res.redirect('/');
      } else {
        req.flash('logError', 'Incorrect password');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('logError', 'User does not exist');
      res.redirect('/auth/login#login');
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, name, password, confirm} = req.body;
    const candidate = await User.findOne({email});
    if (candidate) {
      req.flash('regError', 'Email already exists');
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPassword, cart: {items: []}
      })
      await user.save();
      await transporter.sendMail(regEmail(email));
      res.redirect('/auth/login#login');
    }
    
  } catch (error) {
    console.log(error);
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot password?',
    error: req.flash('error')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Restore password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (error) {
    console.log(error);
  }

})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong, try again later')
        return res.redirect('/auth/reset');
      }
      const token = buffer.toString('hex');

      const candidate = await User.findOne({email: req.body.email});

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 3600 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Email not found');
        res.redirect('/auth/reset');
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
    _id: req.body.userId, 
    resetToken: req.body.token,
    resetTokenExp: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Reset token expired');
      res.redirect('/auth/login');
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
