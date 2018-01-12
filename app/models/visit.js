// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var visitSchema = mongoose.Schema({
    userid: String,
    date: String,
    activitylist: String,
    presession: String,
    health: String,
    bestpart: String,
    worstpart: String,
    postsession: String,
    approved: {
        type: Boolean,
        default: false
    }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Visit', visitSchema);
