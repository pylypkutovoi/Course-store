const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'))


app.get('/', (req, res) => {

  res.render('index.hbs', {
    title: 'Home page',
    isHome: true
  });
})

app.get('/courses', (req, res) => {

  res.render('courses.hbs', {
    title: 'Courses',
    isCourses: true
  });
})

app.get('/add', (req, res) => {

  res.render('add.hbs', {
    title: "Add course",
    isAdd: true
  });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);

})