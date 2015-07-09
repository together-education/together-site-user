
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
  url: "mongodb://localhost/session",
  interval: 120000
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'vamcc'}));
app.use(express.session({
  secret: 'vamcc',
  store: store,
  cookie: {maxAge: 900000}
}));
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  var success = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err)
    res.locals.message = '<div class="alert alert-warning">    ' + err + '</div>';
  else if (success)
    res.locals.message = '<div class="alert alert-success">    ' + success + '</div>';
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
