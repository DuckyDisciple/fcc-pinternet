"use strict";

var path = process.cwd();

var UserHandler = require(process.cwd() + "/app/controllers/userHandler.server.js");

module.exports=function(app, passport){
    
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/login');
        }
    }
    
    var userHandler = new UserHandler();
    
    app.route('/')
        .get(userHandler.populateHome);
        
    app.route('/login')
        .get(function(req,res){
            res.render('login',{});
        });
    
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    app.route('/new')
        .get(isLoggedIn, function(req,res){
            res.render('new',{});
        });
    
    app.route('/library')
        .get(isLoggedIn, userHandler.forwardToMyLibrary);
        
    app.route('/library/:id')
        .get(userHandler.populateLibrary);
        
    app.route('/create')
        .post(isLoggedIn, userHandler.newPin);
    
    app.route('/delete/:id')
        .post(isLoggedIn, userHandler.removePin);
    
    app.route('/api/user')
        .get(isLoggedIn, function(req, res){
            res.json(req.user.twitter);
        });
    
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));
    
    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter',{
            successRedirect: '/library',
            failureRedirect: '/login'
        }));
};