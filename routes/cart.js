const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
  }))
}

function computePrice(courses) {
  return courses.reduce((total, courses)=>{
    return total += courses.price * courses.count;
  }, 0)
}
router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: courses,
    price: computePrice(courses)
  })
})

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course)
  res.redirect('/cart');
})

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();
  const courses = mapCartItems(user.cart);
  const cart = {
    courses,
    price: computePrice(courses)
  }
  res.status(200).json(cart);
})

module.exports = router;