// load the things we need
var mongoose = require('mongoose');

// define the schema for our visit model
var visitSchema = mongoose.Schema({
    userid: String,
    firstname: String, 
    lastname: String,
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


// create the model for visits and expose it to our app
module.exports = mongoose.model('Visit', visitSchema);
