var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var cookieSession = require('cookie-session');
// router.use(function(req,res,next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

function games() {
  return knex('games');
}

function gamesUsers() {
  return knex('games_users');
}
/* GET home page. */

// list of open games
router.get('/', function(req, res, next) {
  console.log('in here');
  games().select().then(function(data) {
    console.log(data);
    res.json(data);
  });
});

// get game with id
router.get('/:gameId', function(req, res, next) {
  games().select().where('id', req.params.gameId).then(function(data) {
    console.log(data);
    res.json(data);
  });
});

// set a game to be started
router.put('/start/:gameId', function(req, res, next) {
  games().where('id', req.params.gameId).update('isStarted', true).then(function(data) {
    res.json(data);
  });
});

// when a players makes a new game create the game table and insert that user into the game
router.post('/:playerId', function(req, res, next) {
  console.log(req.body);
  games().insert({level: req.body.level, name: req.body.name, password: req.body.password, isStarted: false}).returning('*')
  .then(function(data) {
    gamesUsers().insert({gameId: data[0].id, playerId: req.params.playerId, gameOwner: true, isActive: true}).returning('*')
    .then(function(dataTwo) {
      res.json({player: dataTwo, game: data});
    });
  });
});

// delete a game from the lobby as room owner
router.delete('/:playerId/:gameId', function(req, res, next) {
  gamesUsers().select().where({playerId: req.params.playerId, gameId: req.params.gameId}).returning('gameOwner')
  .then(function(data) {
    if (data[0].gameOwner === true) {
      gamesUsers().select().where('gameId', req.params.gameId).del()
      .then(function(dataTwo) {
        games().select().where('id', req.params.gameId).del()
        .then(function(dataThree) {
          res.json(dataThree);
        });
      });
    } else {
      res.json(data);
    }
  });
});

// insert a player into an existing game
router.put('/add/:gameId', function(req, res, next) {
  console.log(req.body);
  gamesUsers().insert({gameId: req.params.gameId, playerId: req.body.id, gameOwner: false, isActive: false})
  .then(function(data) {
    gamesUsers().select().where('gameId', req.params.gameId).then(function(dataTwo) {
      res.json(dataTwo);
    });
  });
});

// get player data for the specific room
router.get('/gamesPlayers/:gameId', function(req, res, next) {
  console.log(req.params);
  gamesUsers().select().where('gameId', req.params.gameId).innerJoin('players', 'games_users.playerId', 'players.id')
  .then(function(data) {
    console.log(data);
    res.json(data);
  });
});

// update the screen when players move
router.put('/playerMove/:gameId', function(req,res,next) {
  console.log(req.body);
  console.log(req.body.kitten);
  console.log(req.body.turret);
  gamesUsers().where({gameId: req.params.gameId, playerId: req.body.playerId}).update({kittenX: req.body.kitten.x, kittenY: req.body.kitten.y, kittenAngle: req.body.kitten.angle, turretX: req.body.turret.x, turretY: req.body.turret.y, turretAngle: req.body.turret.angle,
  health: req.body.health, healthTextX: req.body.healthText.x, healthTextY: req.body.healthText.y, direction: req.body.direction}).returning('*')
  .then(function(data) {
    console.log(data);
    res.json(data);
  });
});

router.get('/activePlayer/:gameId', function(req, res, next) {
  gamesUsers().select().where({gameId: req.params.gameId, isActive: true}).then(function(data) {
    res.json(data);
  });
});

router.put('/changePlayer/:gameId', function(req, res, next) {
  gamesUsers().where({gameId: req.params.gameId, isActive: true}).update({isActive: false}).then(function(data) {
    console.log(data);
    gamesUsers().where({gameId: req.params.gameId, playerId: req.body.playerId}).update({isActive: true}).returning('playerId').then(function(dataTwo) {
      console.log(dataTwo);
      res.json(dataTwo);
    });
  });
});


module.exports = router;
