import { auth } from "./src/lib/auth.ts"; 
import { toNodeHandler } from "better-auth/node";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');

var app = express();


app.use(logger('dev'));
// Mount better-auth handler BEFORE express.json() middleware
app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // return JSON error response
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
      ...(req.app.get('env') === 'development' && { stack: err.stack })
    }
  });
});

module.exports = app;
