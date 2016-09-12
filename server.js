var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

//  create an Express App
var app = express();

// use body-parser middleware to handle request bodies
app.use(bodyParser.json());

//  use static middleware to serve the static assets in public folder
app.use(express.static('public'));

//  function responsible for coordinating connection to database and running of HTTP server
var runServer = function(callback){
  
  // use mongoose to connect to the database using URL from config.js 
  mongoose.connect(config.DATABASE_URL, function(err){
    
    if(err && callback){
      return callback(err);
    }
    
    //  listen for new connections on configured port
    app.listen(config.PORT, function(){
      
      console.log('Listening on localhost:' + config.PORT);
      
      // if successful, call optional callback function to signale everything is up and running
      if(callback){
        callback();
      }
      
    });
  });
};

//  useful trick for making this file both an executable script and a module
//  if the script is run directly ...aka node server.js ... then runServer function will be called
if(require.main === module){
  runServer(function(err){
    
    //  but if the file is included from somewhere else ... aka require('./server')... 
    //  then the function wont be called, allowing the server to be started at a different point
    if(err){
      console.error('48', err);
    }
  });
};


var Item = require('./models/item');


//  get endpoint fetches list of all items from database using Item.find & returns them as JSON
app.get('/items', function(req, res){
  Item.find(function(err, items){
    if(err){
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.json(items);
  });
});

//  post endpoint creates new item using Item.create, taking the item name from request body, 
//  and returning a 201 Created status
app.post('/items', function(req, res){
  
  
  Item.create({
    name: req.body.name
  }, function(err, item){
    
    //  if there is an error, with the database, returns a 500 error w/ JSOn error message 
    //  indicating something has gone wrong
    if(err){
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(201).json(item);
  });
});


app.put('/items/:id', function(req, res){

  Item.findOneAndUpdate({_id: req.body.id}, {$set: {name: req.body.name}}, function(err, item){
    if(err){
      return res.status(500).json({message: 'Internal Server Error'});
    }
    res.json(item);
  });
})

app.delete('/items/:id', function(req, res){
  console.log(req.params.id);

  Item.findOneAndRemove({_id: req.params.id}, function(err, item){
    if(err){
      console.log(err)
      res.send('error deleting');
    }else{
      res.json(item);
    }
  })
})


//  a catch-all endpoint which will server a 404 message if neither 
//  of the endpoints were hit by a request
app.use('*', function(req, res){
  res.status(404).json({
    message: 'Not Found'
  });
});



exports.app = app;
exports.runServer = runServer;








