var mongoose = require('mongoose');
var shortId = require('shortid');
mongoose.Promise = require('bluebird');
// set Promise provider to bluebird
var schema = new mongoose.Schema({
   grupa: String,
   days:[{
     day:Number,//0 - sunday 6 saturday
     even_week:Boolean,
     start:String,
     end:String,
     ref_id:{
  	    type: String,
  	    unique: true,
  	    default: shortId.generate
  	}
   }]
});
module.exports = mongoose.model('Schedule', schema);
