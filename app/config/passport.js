'use strict';

// var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../models/users.js");
var configAuth = require("./auth.js");

module.exports = function(passport){
    passport.serializeUser(function(user,done){
       done(null,user.id); 
    });
    
    passport.deserializeUser(function(id, done){
        User.findById(id,function(err,user){
            done(err, user);
        });
    });
    
    // passport.use(new GitHubStrategy({
    //     clientID: configAuth.gitHubAuth.clientID,
    //     clientSecret: configAuth.gitHubAuth.clientSecret,
    //     callbackURL: configAuth.gitHubAuth.callbackURL
    // },
    // function(token,refreshToken,profile,done){
    //     process.nextTick(function(){
    //         User.findOne({'github.id':profile.id},function(err,user){
    //             if(err) return done(err);
    //             if(user){
    //                 return done(null, user);
    //             }else{
    //                 var newUser = new User();
                    
    //                 newUser.github.id = profile.id;
    //                 newUser.github.displayName = profile.displayName;
    //                 newUser.github.username = profile.username;
    //                 newUser.github.publicRepos = profile._json.public_repos;
    //                 newUser.numClicks.clicks = 0;
                    
    //                 newUser.save(function(err){
    //                     if(err) throw err;
                        
    //                     return done(null, newUser);
    //                 });
    //             }
    //         });
    //     });
    // }));
    
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'google.id':profile.id}, function(err, user) {
                if(err) return done(err);
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();
                    
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.displayName = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.name = profile.displayName;
                    newUser.city = "";
                    newUser.state = "";
                    
                    newUser.save(function(err){
                        if(err) return err;
                        
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};