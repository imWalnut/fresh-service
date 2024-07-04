let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const adminAuth = require('./middlewares/admin-auth');
require('dotenv').config();

let indexRouter = require('./routes/index');
let apiUsersRouter = require('./routes/api/users');
let apiProductsRouter = require('./routes/api/products');
let apiAuthRouter = require('./routes/api/auth');
let apiCartRouter = require('./routes/api/carts');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', adminAuth, apiUsersRouter);
app.use('/api/products', adminAuth, apiProductsRouter);
app.use('/api/carts', adminAuth, apiCartRouter);
app.use('/api/auth', apiAuthRouter);

module.exports = app;
