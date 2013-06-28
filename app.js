
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('ripplesuperlongkey'));
app.use(express.session({
  cookie:{maxAge: null}
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


http.globalAgent.maxSockets = 1000;



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



// hook connection
mongoose.connect('mongodb://localhost/ripple');

// hook models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// hook routes
require('./config/routes')(app);




var server = http.createServer(app)



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


  


//socketio
//require('./routes/msgRoute')(server);

//map route
require('./routes/mapRoute')(server);