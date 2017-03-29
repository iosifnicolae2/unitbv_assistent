var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

var schema = new mongoose.Schema({
  fb_id:String,
  username: String,
  password: String,
   grupa: String,
   facebook_id:String,
   details: {
     name:String,
     email:String,
     unique_id:String
   },
   notifications : {
     //here we will store unique_id of different notifications
     whitelist:[String],
     blacklist:[String],
   },
   facebook:{
     id:String,
     token:String,
     name:String,
     email:String
   }
});
module.exports = mongoose.model('Student', schema);
