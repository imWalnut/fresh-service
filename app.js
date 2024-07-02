let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let apiUsersRouter = require('./routes/api/users');
let apiProductsRouter = require('./routes/api/products');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/products', apiProductsRouter);

module.exports = app;
