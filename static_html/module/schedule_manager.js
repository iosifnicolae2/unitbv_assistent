var schedule = require('node-schedule');

<<<<<<< HEAD
process.env.TZ = 'Europe/Bucharest'

=======
>>>>>>> f92d0ff36e2b2aad91f0e672fc2b594498dcd211
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
