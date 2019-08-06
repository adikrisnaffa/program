var express = require('express');
var r = express.Router();


let fs = require("./sdk/fs.js")


r.post('/add_point', function(req, res){
  let dt = {
        "First_name": req.body.First_name,
        "Last_name": req.body.Last_name,
        "Asal_Sekolah": req.body.Asal_Sekolah,
        "Umur": req.body.Umur,
        "Tinggi_Badan": req.body.Tinggi_Badan,
        "Berat_Badan": req.body.Berat_Badan,
      //   "point": req.body.point

    }
    fs.collection("DATA INDIVIDU")
      .add(dt).then((s)=>{
        s.update({key : s.id});
        res.json(Object.assign({"key":s.id, "data": dt}))
      })
});


r.get('/get_point_data', function(req, res){
  fs.collection("DATA INDIVIDU")
    .get().then((s)=>{
      a=0;
      dt = [];
      s.forEach((v)=>{
        a++;
        dt.push(Object.assign({"key": v.id, "data": v.data()}));
        if(a == s.size){
          res.json(dt)
        }
      });
    })
});


r.get('/get_point_data_by_key/:key', function(req, res){
  fs.collection("DATA INDIVIDU")
    .doc(req.params.key)
    .get().then((s)=>{
      res.json(s.data())
    })
});


module.exports = r;