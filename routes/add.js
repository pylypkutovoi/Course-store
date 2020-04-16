const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/AuthGuard');
const { validationResult } = require('express-validator');
const { courseValidators } = require('../utils/validators');
const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add.hbs', {
    title: "Add course",
    isAdd: true
  });
})

router.post('/',  auth, courseValidators, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: "Add course",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image
      }
    })
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
    userId: req.user
  })

  try {
    await course.save();
    res.redirect('/courses');
  } catch (error) {
    console.log(error);
  }
})

module.exports = router