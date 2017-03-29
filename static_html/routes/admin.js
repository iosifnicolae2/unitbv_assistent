var express = require('express');
var router = express.Router();
var passport = require('passport');

var student = require('../module/student');
var schedule = require('../module/schedule');
var shortid = require('shortid');
var bcrypt = require('bcryptjs');


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/admin/login');
}

router.get('/login',function(req,res){
    res.render('login',{});
})

router.get('/profile', function(req, res, next) {
  res.json(req.user);
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/admin/profile',
            failureRedirect : '/admin/login'
        }));

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


/* GET users listing. */
router.get('/insert_user_sample', function(req, res, next) {

  for(let i=1;i<50;i++)
  student.insertStudent({
    grupa: "4LF462B",
    details: {
      name:"User-"+shortid.generate(),
      email:"u"+shortid.generate()+"@email.com"
    }
  },function(err,data){
    console.log("done inserting ",err,data);
    if(err){
      console.log("Error insert student: ",err);
    //  res.json({status:500,error:err});
    }else{
    //  res.json({status:202,data:data});
    }
  })
});

router.get('/insert_intervals_sample', function(req, res, next) {
  for(let i=1;i<50;i++)
  schedule.insertInterval({
    grupa: "4LF4"+getRandomInteger(4,6)+getRandomInteger(1,3)+"B",
    days:[
      {
        day:getRandomInteger(0,6),
        start:""+getRandomInteger(0,24)+":"+getRandomInteger(0,60),
        end:""+getRandomInteger(0,24)+":"+getRandomInteger(0,60)
      }
    ]
  },function(err,data){
    if(err){
      console.log("Error insert schedule: ",err,data);
    //  res.json({status:500,error:err});
    }else{
    //  res.json({status:202,data:data});
    }
  })
});

router.get('/',isLoggedIn,function(req,res){
    res.redirect('/admin/students')
})

var http = require('https');
var fs = require('fs');
const download_orar_url = "https://unitbv.mailo.ml/static/orar_csv/orar.csv";
const orar_scv_path = "orar.csv";

const csv=require('csvtojson')


// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : process.env.MYSQLASISTENT_UNITBV_PORT_3306_TCP_ADDR,
//   user     : 'root',
//   password : process.env.MYSQLASISTENT_UNITBV_ENV_MYSQL_ROOT_PASSWORD,
//   database : 'orar'
// });

var orar = require('../module/orar');
router.get('/update_orar',function(req,res){
  var r = [];
  new Promise((resolve, reject) => {
  //  resolve(orar_scv_path)
  http.get(download_orar_url, response => {
      const statusCode = response.statusCode;

      if (statusCode !== 200) {
          return reject('Download error!');
      }

      const writeStream = fs.createWriteStream(orar_scv_path);
      response.pipe(writeStream);

      writeStream.on('error', () => reject('Error writing to file!'));
      writeStream.on('finish', () => {
         writeStream.close();
         resolve(orar_scv_path)
      });
  });
  })
  // .then(orar_scv_path => {
  //   return new Promise(function(resolve, reject) {
  //       fs.readFile(orar_scv_path, function(err, data){
  //           if (err)
  //               reject(err);
  //           else
  //               resolve(data);
  //       });
  //   });
  // })
  .then(path => {
    var stream = fs.createReadStream(path);
    csv({
      delimiter:'|',
      noheader: false,
      headers: ['an','spec','grupa','sgr',
      'l1','l2','l3','l4','l5','l6','l7',
      'm1','m2','m3','m4','m5','m6','m7',
      'mi1','mi2','mi3','mi4','mi5','mi6','mi7',
      'j1','j2','j3','j4','j5','j6','j7',
      'v1','v2','v3','v4','v5','v6','v7'
    ]
    })
    .fromStream(stream)
    .on('json',(jsonObj,l)=>{
      jsonObj.saptamana_para = l%2;
      r.push(jsonObj);
    })
    .on('done',(error)=>{
        console.log('end')

        r.shift();
        r.shift();
        r.shift();
        orar.insertOrar(r,function(err,data){
          res.json({errorCsv:error,err:err,data:data});
        })
    })

  })
  .catch(err => console.error(err));
})
router.get('/students',isLoggedIn,function(req,res){
  student.getStudents(function(err,users){
      res.render('admin_students',{menu:'students',users:users,error:err});
  })
})

router.get('/edit/student/:uid',isLoggedIn,function(req,res){
  student.getStudent(req.params.uid,function(err,student){
    console.log(student)
    res.render('admin_add_student',{menu:'students',student:student});
  })
});


router.get('/add/student',isLoggedIn,function(req,res){
  res.render('admin_add_student',{menu:'students',student:{
    "grupa": "4LF462B",
    "username":"popescu",
    "notifications": {
        "blacklist": [],
        "whitelist": []
    },
    "details": {
        "name": "Ionel Popescu",
        "email": "ionel.popescu@student.unitbv.ro"
    },
    "__v": 0
}});
})


router.post('/add/student',isLoggedIn,function(req,res){
  console.log(req.body);

if(req.body.password!=req.body.confirm_password) return res.json({error:"Passwords doesn't match",code:901});

  bcrypt.hash(req.body.password, 10)
  .then(function(hashed_password){
    student.insertStudent({
      grupa: req.body.grupa,
      details: {
        name:req.body['details.name'],
        email:req.body['details.email'],
      },
      username:req.body.username,
      password:hashed_password,
      whitelist:req.body['whitelist[]'],
      blacklist:req.body['blacklist[]'],
    },function(err,data){
      console.log("done inserting ",err,data);
      if(err){
        console.log("Error insert student: ",err);
      //  res.json({status:500,error:err});
      return res.redirect('/admin/students?ok=false');
      }else{
      //  res.json({status:202,data:data});
      return res.redirect('/admin/students?ok=true');
      }
    })
  });

})
router.get('/notifications',isLoggedIn,function(req,res){
    res.render('admin_notifications',{menu:'notifications'});
})
router.get('/schedule',function(req,res){
    res.render('schedule',{menu:'schedule'});
})
router.get('/schedule/:grupa',function(req,res){
  schedule.getIntervalsGrupa(req.params.grupa,function(err,intervals){

      res.render('schedule',{menu:'schedule',error:err,intervals:intervals});
  })
})



function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;
