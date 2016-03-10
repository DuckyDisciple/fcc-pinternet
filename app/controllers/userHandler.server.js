"use strict";

var Users = require("../models/users.js");
var Pins = require("../models/pins.js");

var mongoose = require('mongoose');

function UserHandler(){
    
    this.newPin = function(req,res){
        var newId = mongoose.Types.ObjectId();
        var newPin = new Pins({
            _id: newId,
            title: req.body.title,
            url: req.body.url
        });
        Users.findOneAndUpdate({'twitter.id': req.user.twitter.id},{$push: {pins: newId}})
            .exec(function(err, user) {
                if(err) throw err;
                newPin._owner = user._id;
                newPin.save(function(err2,pin){
                    if(err2) throw err2;
                    res.redirect('/library');
                });
            });
    };
    
    this.forwardToMyLibrary = function(req,res){
        Users.findOne({'twitter.id':req.user.twitter.id})
            .exec(function(err, user) {
                if(err) throw err;
                res.redirect('/library/'+user._id);
            });
    };
    
    this.populateLibrary = function(req,res){
        Users.findOne({_id:req.params.id})
            .populate('pins')
            .exec(function(err,user){
                if(err) throw err;
                if(req.user){
                    Users.findOne({'twitter.id':req.user.twitter.id})
                        .exec(function(err, curUser) {
                            if(err) throw err;
                            var isOwner = false;
                            if(req.params.id === curUser._id.toString()) isOwner=true;
                            res.render('library',{
                                name: user.twitter.displayName,
                                pins: user.pins,
                                owner: isOwner
                            });
                        });
                }else{
                    res.render('library',{
                        name: user.twitter.displayName,
                        pins: user.pins,
                        owner: false
                    });
                }
                
                
            });
    };
    
    this.populateHome = function(req,res){
        Pins.find({})
            .populate('_owner')
            .exec(function(err,pins){
                if(err) throw err;
                var pinData = [];
                for(var i in pins){
                    var newPin = {
                        title: pins[i].title,
                        url: pins[i].url,
                        owner: {
                            name: pins[i]._owner.twitter.displayName,
                            id: pins[i]._owner._id
                        }
                    };
                    pinData.push(newPin);
                }
                res.render('index',{pins: pinData});
            });
    };
    
    this.removePin = function(req,res){
        Users.findOneAndUpdate({'twitter.id': req.user.twitter.id}, {$pull: {pins: req.params.id}})
            .exec(function(err, user) {
                if(err) throw err;
                Pins.findOne({_id: req.params.id})
                    .remove()
                    .exec(function(err,pin){
                        if(err) throw err;
                        res.json({status:"removed"});
                    });
            });
    };
}

module.exports = UserHandler;