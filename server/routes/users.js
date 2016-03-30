var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

router.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function players() {
  return knex('players');
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  // players().select().where({username: req.body.username, password: req.body.password})
  // .then(function(data) {
  //   // console.log(data[0]);
  //   if (typeof data != 'undefined') {
  //     // res.json(data);
  //     data[0].password = null;
  //     var token = jwt.sign(data[0], 'secret', { expiresInMinutes: 60*5});
  //     console.log(token);
  //     res.json(token);
  //   } else {
  //     res.json(data + 'Incorrect login');
  //   }
  // });
  players().select().where({username: req.body.username}).then(function(data) {
    bcrypt.compare(req.body.password, data[0].password, function(err, resp) {
      if (err) {
        console.log(err);
      }
      if (resp === true) {
        data[0].password = null;
        var token = jwt.sign(data[0], 'secret', { expiresInMinutes: 60*5});
        res.json(token);
      } else {
        res.json(err);
      }
    });
  });
});

router.post('/new', function(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {return(err);}
    players().insert({username: req.body.username, email: req.body.email, password: hash, wins: 0, losses: 0, win_loss_ratio: 0}).returning('*')
    .then(function(data) {
      console.log(data[0]);
      res.json(data);
    });
  });
});

module.exports = router;
