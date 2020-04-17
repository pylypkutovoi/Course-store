const { Router } = require('express');
const auth = require('../middleware/AuthGuard');
const router = Router();

router.get('/', async (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    user: req.user.toObject()
  })
})

router.post('/', (req, res) => {
  
})

module.exports = router;