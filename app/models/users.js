'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    twitter:{
        id: String,
        displayName: String,
        username: String,
        token: String
    },
    pins: [{
        type: Schema.Types.ObjectId,
        ref: 'Pin'
    }]
});

module.exports = mongoose.model('User', User);