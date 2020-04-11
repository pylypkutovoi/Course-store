const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const path = require('path');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e8f614f04851f0694a9cb7a');
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/shop', {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'adm@gmail.com',
        name: 'admin',
        cart: {items: []}
      })
      await user.save();
    }
  } catch (error) {
    console.log(error);
  }
}
start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})