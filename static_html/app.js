'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);

var mongodb_config = require('./conf/mongodb');

var passport = require('./module/passport');

var redis_client = redis.createClient(6379, process.env.REDDISASISTENT_UNITBV_PORT_6379_TCP_ADDR);
redis_client.on('error', function(err) {
     console.log('Redis error: ' + err);
});


var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();




//mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect(mongodb_config.url);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('body-parser').json());
app.use(session({
    secret: 'uaiushfasf-asfh-asfha-hf-asfa-8sf8ha8sfha',
    cookie: { maxAge: 30*24*3600*1000*30 },//30 days on mobile we need to login user for more time..
    // create new redis store.
    store: new redisStore({ host: process.env.REDDISASISTENT_UNITBV_PORT_6379_TCP_ADDR, port: 6379, client: redis_client,logErrors:true,
    ttl: 30 * 24 * 60 * 60}),

    saveUninitialized: false,
    resave: false,
    name:'asistent_unitbv'
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000);
module.exports = app;
