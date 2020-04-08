const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const path = require('path');
const mongoose = require('mongoose');
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cartRoutes = require("./routes/cart");
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/shop', {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (error) {
    console.log(error);
  }
}
start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
})