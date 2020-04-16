const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);
const path = require('path');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const csrf = require('csurf');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const pageNotFound = require('./middleware/notFound');
const keys = require('./keys')


const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helper'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

app.use(pageNotFound);

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
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