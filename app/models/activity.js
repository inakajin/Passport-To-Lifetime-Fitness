// load the things we need
var mongoose = require('mongoose');

// define the schema for our school model
var activitySchema = mongoose.Schema({
    activity: String,
});

// create the model for schools and expose it to our app
module.exports = mongoose.model('Activity', activitySchema);
