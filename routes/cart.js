const { Router } = require('express');
const Cart = require('../models/cart');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const cart = await Cart.fetch();
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: cart.courses,
    price: cart.price
  })
})

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);

  await Cart.add(course);
  res.redirect('/cart');
})


module.exports = router;