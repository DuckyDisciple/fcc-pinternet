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
        Users.findOne({'twitter.id':req.user.twitter.id})
            .populate('pins')
            .exec(function(err,user){
                if(err) throw err;
                var isOwner = false;
                if(req.params.id === user._id.toString()) isOwner=true;
                res.render('library',{
                    name: user.twitter.displayName,
                    pins: user.pins,
                    owner: isOwner
                });
            });
    };
    
    this.getBook = function(req,res){
        Books.findOne({_id:req.params.id})
            .populate('_owner')
            .exec(function(err,data){
                if(err) throw err;
                var city = data._owner.city;
                var state = data._owner.state;
                var location = "No location data provided";
                if(city !== "" && state != ""){
                    location = city + ", " + state;
                }else if(city !== ""){
                    location = city;
                }else if(state !== ""){
                    location = state;
                }
                res.render('book',{book: data, location: location});
            });
    };
    
    this.deleteBook = function(req, res){
        Books.findOne({_id: req.params.id})
            .remove()
            .exec(function(err,book){
                if(err) throw err;
                Users.findOneAndUpdate({'google.id':req.user.google.id},{$pull: {books: req.params.id}})
                    .exec(function(err2, user){
                        if(err){
                            res.json({error:err2});
                        }
                        res.json({success:"success"});
                    });
            });
    };
    
    this.displayProfile = function(req, res){
        Users.findOne({'google.id':req.user.google.id})
            .exec(function(err, data) {
                if (err) throw err;
                res.render('profile',{
                    name: data.name,
                    city: data.city,
                    state: data.state
                });
            });
    };
    
    this.updateProfile = function(req, res){
        Users.findOneAndUpdate({'google.id':req.user.google.id},
            {$set: {
                name: req.body.name,
                city: req.body.city,
                state: req.body.state
            }},
            {new:true})
            .exec(function(err, data) {
                if(err) throw err;
                res.render('profile',{
                    name: data.name,
                    city: data.city,
                    state: data.state
                });
            });
    };
    
    this.search = function(req,res){
        Books.aggregate([
            {$match: {$text: {$search: req.query.query}}},
            {$project: {title: 1, description: 1}}
        ])
        .exec(function(err,data){
            if(err) throw err;
            res.render('search', {results: data});
        });
    };
    
    this.requestBook = function(req,res){
        Users.findOne({'google.id': req.user.google.id})
            .exec(function(err,user){
                if(err) throw err;
                Books.findOneAndUpdate({_id: req.params.id}, {$set: {requestedBy: user._id}})
                    .exec(function(err2, book) {
                        if(err2) throw err2;
                        res.json(book);
                    });
            });
    };
    
    this.cancelRequest = function(req,res){
        Books.findOneAndUpdate({_id: req.params.id}, {$set: {requestedBy: null}})
            .exec(function(err,book){
                if(err) throw err;
                res.json(book);
            });
    };
    
    this.acceptRequest = function(req,res){
        Books.findOne({_id: req.params.id})
            .populate('_owner')
            .exec(function(err,book){
                if(err) throw err;
                Users.findOneAndUpdate({_id: book.requestedBy}, {$push: {books: book._id}})
                    .exec(function(uErr,user){
                        if(uErr) throw uErr;
                        Users.findOneAndUpdate({_id: book._owner._id}, {$pull: {books: book._id}})
                            .exec(function(uErr2,user2){
                                Books.findOneAndUpdate({_id: book._id},
                                    {$set: {
                                        _owner: book.requestedBy,
                                        requestedBy: null
                                    }})
                                    .exec(function(err2,book2){
                                        if(err2) throw err2;
                                        res.json(book2);
                                    });
                            });
                    });
            });
    };
    
    this.getUserStatus = function(req,res){
        var status = {};
        status.loggedIn = req.user !== undefined;
        Books.findOne({_id: req.params.bookId})
            .populate('_owner')
            .exec(function(err,book){
                if(err) throw err;
                status.requested = book.requestedBy !== null;
                if(!status.loggedIn){
                    status.owner = false;
                    status.requester = false;
                    res.json(status);
                }else{
                    Users.findOne({'google.id':req.user.google.id})
                        .exec(function(err,user){
                            if(err) throw err;
                            var userId = user._id.toString();
                            status.owner = book._owner._id.toString() === userId;
                            status.requester = book.requestedBy === userId;
                            res.json(status);
                        });
                }
            });
    };
    
    this.getAllRequests = function(req,res){
        Users.findOne({'google.id':req.user.google.id})
            .populate('books')
            .exec(function(err,data){
                var requestedBookIds = [];
                for(var i in data.books){
                    if(data.books[i].requestedBy !== null){
                        requestedBookIds.push(data.books[i]._id.toString());
                    }
                }
                res.json(requestedBookIds);
            });
    };
    
    this.getRequestCount = function(req,res){
        Users.findOne({'google.id':req.user.google.id})
            .populate('books')
            .exec(function(err, user) {
                if(err) throw err;
                var count = 0;
                for(var i in user.books){
                    if(user.books[i].requestedBy !== null){
                        count++;
                    }
                }
                res.json({count:count});
            });
    };
    
    // this.watchStock = function(req,res){
    //     var myStock = {symbol:req.params.symbol,name:req.params.name};
    //     Users.findOneAndUpdate({'google.id': req.user.google.id},{$addToSet: {stocks: myStock}})
    //         .exec(function(err,data){
    //             if(err) throw err;
                
    //             res.json(data);
    //         });
    // };
    
    // this.getStocks = function(req,res){
    //     Users.findOne({'google.id':req.user.google.id},{_id:0})
    //         .exec(function(err, data) {
    //             if(err) throw err;
                
    //             var fullName = req.user.google.displayName;
    //             var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
                
    //             res.render('profile', {name: firstName, stocks: data.stocks});
    //         });
    // };
    
    // this.unwatchStock = function(req,res){
    //     Users.findOneAndUpdate(
    //         {'google.id':req.user.google.id},
    //         {$pull: {stocks: {symbol:req.params.symbol}}})
    //         .exec(function(err, data) {
    //             if(err) throw err;
                
    //             res.json(data);
    //         });
    // };
    
    // this.getWatchers = function(req,res){
    //     Users.find({'stocks.symbol':req.params.symbol})
    //         .exec(function(err,data){
    //             if(err) return res.json(err);
    //             var users = data.map(function(doc){
    //                 return doc.google.displayName;
    //             });
    //             return res.json(users);
    //         });
    // };
    
    // this.isWatching = function(req,res){
    //     Users.find({'google.id':req.user.google.id,'stocks.symbol':req.params.symbol})
    //         .exec(function(err, data) {
    //             if(err) res.json({found:false});
    //             if(data.length>0){
    //                 res.json({found:true});
    //             }else{
    //                 res.json({found:false});
    //             }
    //         });
    // };
}

module.exports = UserHandler;