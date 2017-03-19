var Schedule = require('../model/Schedule.js');

module.exports = {
  insertInterval : function(data,done){
    /*
      data : {
      grupa: String,
      days:[{
        day:Number,//0 - sunday 6 saturday
        start:String,
        end:String,
        ref_id:    {type:ObjectIdSchema, default: function () { return new ObjectId()} }
      }]
      }
    */
    let interval = new Schedule(data);
    interval.save()
    .then(function(err,doc){
      // if(err)  done(err);
      // else done(false,doc);
      console.log("Fatal error insert schedule ",err);
    })
    .catch(function(err){
      console.log("Fatal error insert schedule ",err);
    })
  },
  getIntervalsGrupa:function(grupa,done){
    Schedule.find({grupa:grupa},done);
  }
}
