process.env.TZ = 'Europe/Bucharest';
var schedule = require('node-schedule');

//process.env.TZ = 'Europe/Bucharest'


/*var date = new Date();
date.setUTCHours(10);
date.setUTCMinutes(0);
*/

const rule = new schedule.RecurrenceRule();
rule.hour = 5;
rule.minute = 0;


var schedule_route = require('../routes/index');

module.exports = function(){

  var j = schedule.scheduleJob(rule, function(){
    console.log("Send orar Schedule");
    schedule_route.sendOrarSchedule();
  });
}
