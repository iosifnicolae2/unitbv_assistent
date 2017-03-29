var express = require('express');
var router = express.Router();
var request = require('request');
var Orar = require('../module/orar');

var student = require('../module/student');


const zile = ['','l','m','mi','j','v'];
const intervale_zile = ['','\u0020\u00208,00-\u0020\u00209,50',	'10,00-11,50',	'12,00-13,50',	'14,00-15,50'	,'16,00-17,50'	,'18,00-19,50',	'20,00-21,50'];
const sem2_1 = new Date(2017, 2, 27);
const sem2_2 = new Date(2017, 4, 24);
const zile_string = ['','Luni','Marti','Miercuri','Joi','Vineri'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.send('Login page');
});


router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === '7abf67ab6f7a6bf78b6af76a8f76a87sfb687asf6b87af') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  });


  router.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {
      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;

        // Iterate over each messaging event
        entry.messaging.forEach(function(event) {
          if (event.message&&!event.message.is_echo) {
            console.log("Message received:  ",event);
            receivedMessage(event);
          } else {
            //console.log("Webhook received unknown event: ", event);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know
      // you've successfully received the callback. Otherwise, the request
      // will time out and we will keep trying to resend.
      res.sendStatus(200);
    }
  });


  function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  // console.log("Received message for user %d and page %d at %d with message:",
  //   senderID, recipientID, timeOfMessage);
  // console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

var u = userSetupAccount(senderID);
if(u>=0){
  console.log("User is in setup process");

  return setup_user(senderID,++user_setups[u].step,u,messageText);
}

console.log(" getStudentFb: ",senderID)
student.getStudentFb(senderID,function(err,user){
  console.log("Getting user.. ");
  if(user==null){
    console.log("User is NULL ",senderID);
    user_setups.push({id:senderID,step:0});
      setup_user(senderID);
  }else{
    console.log("User found: ",user);
    process_message(messageText,senderID,messageAttachments,user);
  }
})


}

function process_message(messageText,senderID,messageAttachments,user){
  if (messageText) {
    messageText = messageText.toLowerCase();
    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;
    case 'orar':
            sendOrarMessage(senderID,false,user);
    break;
    case 'setup':
    user_setups.push({id:senderID,step:0});
            setup_user(senderID);
    break;
    case 'ajutor':
          sendTextMessage(senderID, `Salut.😊\nTastati orar pentru a afisa orarul pentru ziua curenta.\nTastati  orar  luni pentru a afisa orarul pentru ziua de Luni.\nTastati anunt: <aici este mesajul> pentru a-ti anunta grupa de un eveniment.`);
    break;
    case 'ajut':
          sendTextMessage(senderID, `Multumesc ca vrei sa ma ajuti sa ma dezvolt 😀.\nScrie-mi un email aici: iosifnicolae2@gmail.com`);
    break;
    break;

      default:
      if(messageText.indexOf('orar')==0)
      return sendOrarMessage(senderID,messageText,user);

      if(messageText.indexOf('anunt:')==0){
        console.log("Send anunt ",messageText)
        return sendMessageGrupa(senderID,messageText,user);
      }

          sendTextMessage(senderID, "Interesanta comanda..");
        sendTextMessage(senderID, "Imi pare rau. Aceasta comanda nu imi este cunoscuta.😞\nScrie  ajut  ca sa ma inveti ce inseamna aceasta comanda.");
    }


  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}
function sendGenericMessage(senderID, messageText) {
  sendTextMessage(senderID, "Salut.");
  setup_user(senderID);
}

function sendMessageGrupa(senderID,messageText,user){
  var messageData = {
    recipient: {
      id: ''
    },
    message: {
      text: "Mesaj de la "+user.username+": "+messageText.substring(6)
    }
  };


  student.getStudentsGroup(user.grupa,function(err,data){

    for(let i=0;i<data.length;i++){
      messageData.recipient.id = data[i].fb_id;
      callSendAPI(messageData);
    }
  })

}

function getDay(messageText){
  if(messageText){
    if(messageText.indexOf('luni')>0){
        return 1;
    }
    if(messageText.indexOf('marti')>0){
        return 2;
    }
    if(messageText.indexOf('miercuri')>0){
        return 3;
    }
    if(messageText.indexOf('joi')>0){
        return 4;
    }
    if(messageText.indexOf('vineri')>0){
        return 5;
    }
  }
    return 1;

}

function sendOrarSchedule(){
  student.getStudents(function(err,students){
    for(let i=0;i<students.length;i++)
    setTimeout((function(){
      sendOrarMessage(students[i].fb_id,"",students[i],"Buna dimineata")
    }).bind(null,i,students),0);
  })
}

function sendOrarMessage(recipientId, messageText ,user,welcome_message) {


  var date = new Date();
  var zi = date.getDay();
  var today;
  var afiseaza_luni = false;
  if(typeof date.getDay == 'undefined'||date.getDay()>5||date.getDay()==0)
  afiseaza_luni = true;
  else today =zile[date.getDay()]

  var saptamana_para = true;
  var dif1 = sem2_1-date;
  var dif2 = sem2_2-date;


  if(dif2<0){
    //sem2_1
    //TODO vezi ce e prima saptamana de dupa vacanta, aici cred ca se schimba, avem vacanta o saptamana..
      saptamana_para = new Date(dif2).getDay()%2==0;
  }else{
    saptamana_para = new Date(dif1).getDay()%2==1;
  }
console.log("Initial saptamana este ",saptamana_para)

var orar_string = 'Orarul dumneavoastra de astazi este: \n' ;
  if(afiseaza_luni){
  //  saptamana_para=!saptamana_para;
    orar_string = 'Iti afisam orarul de luni: \n';
    zi = 1;
  }
  if(messageText){
    var zi_d = getDay(messageText);
    if(zi_d<zi){
      saptamana_para=!saptamana_para;
      console.log("Afisam pentru saptamna urmatoare.")
    }
    zi = zi_d;
    orar_string = 'Orarul dumneavoastra din ziua de '+zile_string[zi]+' este:\n';
  }
  Orar.getOrarGrupa(user.grupa.slice(0, -1),user.grupa[user.grupa.length-1],saptamana_para,function(err,data){
console.log("Afisam orarul pentru: ",zi,zile[zi],data," saptaman : ",saptamana_para)
if(typeof data!='undefined')
  for(let i=1;i<8;i++)
  if(typeof data[zile[zi]+i]!='undefined'&&data[zile[zi]+i].replace(/\s/g, '').length>0){
        orar_string+=intervale_zile[i]+" -> "+data[zile[zi]+i]+"\n";
  }else{
    orar_string+=intervale_zile[i]+" -> "+'FREE\n'
  }

orar_string = "Buna dimineata. \n" + orar_string;

    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: orar_string
      }
    };

      callSendAPI(messageData);
  })
}

var user_setups = [] ;
function setup_user(recipientId,step = 0,u=null,value = null) {
  console.log("Setup user ",recipientId,step)
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: ''
    }
  };

  switch(step){
    case 0:
    messageData.message.text = 'Introduceti username-ul dumneavoastra: '
    break;
      case 1:
      user_setups[u].username = value;
      messageData.message.text = "Tastati Departamentul ( et, aia, iec, etti, calc, ti, ro,sati, seci, sea, ea, tstc)";
      break;
        case 2:

        user_setups[u].studiu = "L";

        let dep_id = 0;
        switch (value) {
        case "et":
            dep_id = 1;
        break;
        case "aia":
            dep_id = 4;
        break;
        case "iec":
            dep_id = 5;
        break;
        case "etti":
            dep_id = 6;
        break;
        case "calc":
            dep_id = 9;
        break;
        case "ti":
            dep_id = 3;
        break;
        case "ro":
            dep_id = 8;
        break;
        case "sati":
            dep_id = 7;
            user_setups[u].studiu = "M";

        break;
        case "seci":
            dep_id = 7;
            user_setups[u].studiu = "M";

        break;
        case "sea":
            dep_id = 7;
            user_setups[u].studiu = "m";

        break;
        case "ea":
            dep_id = 2;
        break;
        case "tstc":
            dep_id = 6;
        break;

        }
        user_setups[u].departament = dep_id;
        messageData.message.text = "Tastati Anul dumneavoastra:";
        break;

        case 3:
          user_setups[u].an = value;
          messageData.message.text = "Tastati Grupa:";
        break;
        case 4:
          user_setups[u].grupa = value;
          messageData.message.text = "Tastati Semigrupa (a,b):";
        break;
      default:
        user_setups[u].semigrupa = value;


//todo ar trebui verificat mai mult urmatorul cod..
        var zz = new Date(), year = 0;
        if(zz.getMonth()<10){
          year = (zz.getYear() % 10)- user_setups[u].an;
        }else{
          year = (zz.getYear() % 10)- user_setups[u].an+1;
        }

        console.log("default setup completed",user_setups[u]);

        user_setups[u].grupa = "4"+user_setups[u].studiu+"F"+user_setups[u].departament+year+user_setups[u].grupa+user_setups[u].semigrupa.toUpperCase();
        console.log("default setup completed2",user_setups[u]);

      student.update_user(user_setups[u],update_user_callback);
      console.log("user_setups initial",user_setups);
      user_setups.splice(u, 1);
      console.log("user_setups final",user_setups);
      break;
  }

//console.log("setup process ",user_setups[u]," text: ",text)

if(messageData.message.text&&messageData.message.text.length>0||typeof messageData.message.attachment!='undefined')
    callSendAPI(messageData);
}

function update_user_callback(u_id,err,msg){
//  console.log("update_user_callback ",msg);
  var text = msg;
  var messageData = {
    recipient: {
      id: u_id
    },
    message: {
      text: text
    }
  };
if(err){
  text = 'A aparut o eroare: '+err;
}

if(text&&text.length>0)
    callSendAPI(messageData);

}

function userSetupAccount(user_id){
  if(user_setups.length>0){
    for(let i=0;i<user_setups.length;i++){
      if(typeof user_setups[i]!='undefined'&&user_setups[i].id === user_id)
      return i;
    }
  }
  return -1;
}





function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  var err = new Error();
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAX4wjfoXawBAHg4ny3Me5KjkI5zdnZCAs7LEdZCVeHZB4liIFYKP7XCE3d55eZCtZBMagILLmZCgR3CGkeXRcW3jJwLLt4VreaLGy1On1fTx0MjCYVlFx4fliwqPk9wdj8ciQrop2ZBsJMBYhMPzzoYEyJGXZCq72zZB0ZAvMJhj23wZDZD" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

  //    console.log("Successfully sent generic message with id %s to recipient %s",
        // messageId, recipientId);
    } else {
      console.error("Unable to send message.",err.stack);
      console.error(error)

       console.error(response.body);
      // console.error(error);
    }
  });
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  // console.log("Received postback for user %d and page %d with payload '%s' " +
  //   "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}

// function sendGenericMessage(recipientId) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "generic",
//           elements: [{
//             title: "rift",
//             subtitle: "Next-generation virtual reality",
//             item_url: "https://www.oculus.com/en-us/rift/",
//             image_url: "http://messengerdemo.parseapp.com/img/rift.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/rift/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for first bubble",
//             }],
//           }, {
//             title: "touch",
//             subtitle: "Your Hands, Now in VR",
//             item_url: "https://www.oculus.com/en-us/touch/",
//             image_url: "http://messengerdemo.parseapp.com/img/touch.png",
//             buttons: [{
//               type: "web_url",
//               url: "https://www.oculus.com/en-us/touch/",
//               title: "Open Web URL"
//             }, {
//               type: "postback",
//               title: "Call Postback",
//               payload: "Payload for second bubble",
//             }]
//           }]
//         }
//       }
//     }
//   };
//
//   callSendAPI(messageData);
// }
module.exports = router;
module.exports.sendOrarSchedule = sendOrarSchedule;
