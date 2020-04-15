const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
  body('email', 'Not a valid email address').isEmail().custom(async (value) => {
    try {
      const user = await User.findOne({email: value });
      if (user) {
        return Promise.reject('Email already exists')
      }
    } catch (error) {
      console.log(error);
    }
  }),
  body('password', 'Password must be at least 6 characters').isLength({min: 6}).isAlphanumeric(),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
  body('name', 'Name must be at least 3 characters').isLength({min: 3})

]