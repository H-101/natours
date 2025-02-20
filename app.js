const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/app.Error');
const globalErrorHandler = require('./Controllers/errorContoller');

const tourRouter = require('./Routes/tourRouter');
const userRouter = require('./Routes/userRouter');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingsRoute');
const viewRouter = require('./Routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Middlewares
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

//Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limmit req from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!'
});

app.use('/api', limiter);
//Body parser,reading datafeom body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSQL query Injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'Difficulty',
      'price'
    ]
  })
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://unpkg.com blob:; worker-src 'self' blob:;"
  );
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  /*const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;*/

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
