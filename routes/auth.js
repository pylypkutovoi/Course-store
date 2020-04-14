const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
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

module.exports = router;
