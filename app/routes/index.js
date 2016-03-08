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
        .get(function(req,res){
            res.render('index',{});
        });
        
    app.route('/login')
        .get(function(req,res){
            res.sendFile(path+"/client/login.html");
        });
    
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    app.route('/add')
        .get(isLoggedIn, function(req,res){
            res.render('add',{});
        });
        
    app.route('/library')
        .get(isLoggedIn, userHandler.populateLibrary);
        
    app.route('/book/:id')
        .get(userHandler.getBook);
    
    app.route('/create')
        .post(isLoggedIn, userHandler.addBook);
    
    app.route('/search')
        .get(userHandler.search);
        
    app.route('/book/delete/:id')
        .post(isLoggedIn, userHandler.deleteBook);
    
    app.route('/profile')
        .get(isLoggedIn, userHandler.displayProfile)
        .post(isLoggedIn, userHandler.updateProfile);
    
    app.route('/request/book/:id')
        .post(isLoggedIn, userHandler.requestBook);
        
    app.route('/request/user/:bookId')
        .get(userHandler.getUserStatus);
    
    app.route('/request/cancel/:id')
        .post(isLoggedIn, userHandler.cancelRequest);
    
    app.route('/request/accept/:id')
        .post(isLoggedIn, userHandler.acceptRequest);
        
    app.route('/library/requests')
        .get(isLoggedIn, userHandler.getAllRequests);
    
    app.route('/requests/count')
        .get(isLoggedIn, userHandler.getRequestCount);
    
    app.route('/api/:id')
        .get(isLoggedIn, function(req, res){
            res.json(req.user.google);
        });
    
    app.route('/auth/google')
        .get(passport.authenticate('google',{ scope: ['profile','email'] }));
    
    app.route('/auth/google/callback')
        .get(passport.authenticate('google',{
            successRedirect: '/library',
            failureRedirect: '/login'
        }));
};