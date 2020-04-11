const { Router } = require('express');
const User = require('../models/user');
const router = Router();


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('5e8f614f04851f0694a9cb7a');
  req.session.user = user
  req.session.isAuthenticated = true;
  req.session.save(err => {
    if (err) {
      throw err
    }
  })
  res.redirect('/');
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  })
  
})

module.exports = router;
