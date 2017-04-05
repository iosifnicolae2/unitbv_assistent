var Orar = require('../model/Orar.js');

module.exports = {
  insertOrar : function(orar,done){

    Orar.insertMany(orar)
    .then(function(mongooseDocuments) {
         done(false,mongooseDocuments)
    })
    .catch(function(err) {
        done(err);
    });

  },
  getOrarGrupa : function(grupa, sgr,saptamana_para,done){
console.log("Search for: ",grupa,sgr,saptamana_para)

    Orar.findOne({
    grupa: grupa,
    sgr: sgr,
    saptamana_para:saptamana_para
  }).then(data => {
    done(false,data);
  }).catch(err =>{
    console.log(err);
    done(err);
  })
  }
}
