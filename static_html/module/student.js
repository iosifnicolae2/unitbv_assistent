var Student = require('../model/Student.js');

module.exports = {
  insertStudent : function(data,done){
    /*
      data : {
        grupa: String,
        details: {
          name:String,
          email:String,
          unique_id:String
        }
      }
    */
    //console.log("inserting user ",data);
    let student = new Student(data);

     student.save()
    .then(function(elm) {
        //savedPerson will be the person
        //you may omit the second argument if you don't care about it
        done(null,elm);
      //  console.log(JSON.stringify(elm)," num: ");
    })
    .catch(function(err){
        console.error(err);
        done(err);
    })

  },
  getStudents:function(done){
    Student.find({}).exec().then(function(docs){
      done(false,docs);
    })
    .catch(function(err) {
      console.error(err);
      done(err);
    });
  },
  getStudentsGroup:function(grupa,done){
    Student.find({grupa:grupa}).exec().then(function(docs){
      done(false,docs);
    })
    .catch(function(err) {
        console.error(err);
        done(err);
    });
  },
    getStudent:function(uid,done){
      Student.findOne({_id:uid}).exec().then(function(docs){
        done(false,docs);
      })
      .catch(function(err) {
        console.error(err);
        done(err);
      });
    },
      getStudentFb:function(fb_id,done){
        Student.findOne({fb_id:fb_id}).exec().then(function(docs){
          done(false,docs);
        })
        .catch(function(err) {
          console.log(err);
          done(err);
        });
      },

    update_user:function(user,done){
      console.log("Updating user",user);
      Student.findOne({fb_id:user.id}).exec()
      .then(function(u){


          if(u==null)
          u = new Student();
          //u.facebook_id = user.id;
          u.fb_id = user.id;
          u.username = user.username;
          u.grupa = user.grupa;
          u.save();
          done(user.id,false,"Am actualizat informatiile contului dumneavoastra!\nTastati ajutor pentru mai multe informatii.")

      },function(err){
          console.error("Update user err: ",err);
          done(user.id,false,"A aparut o eroare necunoscuta db!"+err)

      })
    }
}
