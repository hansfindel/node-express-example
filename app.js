
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var helpers = require('express-helpers');

var app = module.exports = express.createServer();

// Configuration


app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/*
function useSlowHandler(){
  app.use(function slowHandler(req, res, next) { 
    var waitTime=Math.floor(Math.random()*250);
    console.log(req.url, " -> " ,waitTime);
    setTimeout(function() {
      return next();
    }, waitTime);
  });	
}
//useSlowHandler();
*/



// Routes
app.get('/', routes.index);
//app.get('/examples', routes.example);
app.get('/examples', function(req, res) {
	res.render('examples', { title: 'Express Examples' })
});

app.get('/json_callback', function(req, res){
	//console.log(req)//headers route url method
	console.log(req.route)
	console.log(req.headers)
	res.json({"hi": "holo"})
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
