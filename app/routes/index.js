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
    
    app.route('/new')
        .get(isLoggedIn, function(req,res){
            res.render('new',{});
        });
    
    app.route('/library')
        .get(isLoggedIn, userHandler.forwardToMyLibrary);
        
    app.route('/library/:id')
        .get(isLoggedIn, userHandler.populateLibrary);
        
    app.route('/book/:id')
        .get(userHandler.getBook);
    
    app.route('/create')
        .post(isLoggedIn, userHandler.newPin);
    
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