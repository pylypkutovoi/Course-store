const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('courses.hbs', {
    title: 'Courses',
    isCourses: true
  });
})

module.exports = router