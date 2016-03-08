//
// # Bookswap
//
// Continued use of auth and sockets for a book trading app
//
'use strict';

var express = require('express');
var app = express();
require("dotenv").load();

var routes = require("./app/routes/index.js");
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var parser = require('body-parser');

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log("A user connected");
  
  socket.on("request",function(msg){
    console.log("Requested book: "+msg);
    io.emit("requested", msg);
  });
  
  socket.on("unrequest",function(msg){
    console.log("Cancelled request: "+msg);
    io.emit("requested", msg);
  });
  
  socket.on("accepted",function(msg){
    console.log("Accepted request: "+msg);
    io.emit("requested", msg);
  });
});

require('./app/config/passport')(passport);

// var mongooseUrl = "mongodb://"+process.env.IP+":27017/bars";
var mongooseUrl = process.env.MONGOLAB_URI;
mongoose.connect(mongooseUrl);
  
app.use('/client', express.static(process.cwd()+"/client"));  
app.use('/controllers', express.static(process.cwd()+'/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/views', express.static(process.cwd() + '/app/views'));

app.use(parser.json());
app.use(parser.urlencoded({extended:true}));

app.set('views', process.cwd()+'/app/views');
app.set('view engine','jade');

app.use(session({
  secret: 'secretGudetama',
  resave: false,
  saveUninitialized: true
}));
  
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.use(function(req,res,next){
  res.status(404);
  res.render('error',{});
});

var port = process.env.PORT || 8080;
http.listen(port, function(){
  console.log("Listening on port " + port);
});