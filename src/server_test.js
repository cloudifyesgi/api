var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var api = express();

mongoose.connect('mongodb://localhost/test_projet_annuel', function(err) {
  if (err) { throw err; }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  firstname: String,
  password: String,
  phone_number: String,
  address: String,
  postal: String,
  city: String,
  is_deleted: Boolean,
  rang:Number,
  token:String
},{autoCreate: true});

var User = mongoose.model('User', userSchema);

api.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Cloudify api home ');
})
.get('/users', function(req, res) {

    User.find({},function(err,Users){
        if(err){
             return console.error(err);
        } else{
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(Users));
        }
    });
})
.post('/users',function(req,res){
    var user_test = new User({
      email: req.get('email'),
      name: req.get('name'),
      firstname: "Test",
      password: "Test",
      phone_number: "0606060606",
      address: "28 boulevard du test",
      postal: "75010",
      city: "Paris",
      is_deleted: 0
    });

    user_test.save(function (err, user_test) {
        if (err) return console.error(err);
        else console.log(user_test);
    });
    res.end('Done creating');
});


api.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

api.listen(8090);
