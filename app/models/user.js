// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    firstname: String, 
    lastname: String,
    //
    admin: { type: String, default: '' },
    studentid: String,
    school: String,
    active: {
        type: Boolean,
        default: false
    },
    //studentid: Number,
    local            : {
        email        : String,
        password     : String,
        //admin        : Boolean,
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
