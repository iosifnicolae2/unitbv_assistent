var schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
rule.hour = 7;
rule.minute = 0;

var schedule_route = require('../routes/index');

module.exports = function(){

  var j = schedule.scheduleJob(rule, function(){
    console.log("Send orar Schedule");
    schedule_route.sendOrarSchedule();
  });
}
