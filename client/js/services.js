app.service('isLoggedInService', [isLoggedInService]);

function isLoggedInService(playerName) {
  // return function() {
  //   this.playerName = playerName;
  //   this.isLoggedIn = true;
  // };
}

app.service('allGamesService', ['$http', allGamesService]);

function allGamesService($http) {
  console.log("I'm running");
  return $http.get('//lvh.me:3000/games/');
}

app.service('players', [players]);

function players() {
  var playerData = {};
  playerData.players = [];
  playerData.addPlayers = function(player) {
    playerData.players.push(player);
  };
  return playerData;
}

app.service('maps', [maps]);

function maps() {
  var map = {};
  map.selected = 1;
  map.select = function(num) {
    map.selected = num;
  };
  return map;
}

app.service('gameStartService', ['$http', gameStartService]);
//   var body = {};
//   body.kitten = {};
//   body.turret = {};
//   body.kitten.x = this.players[i].kitten.x;
//   body.kitten.y = this.players[i].kitten.y;
//   body.kitten.angle = this.players[i].kitten.angle;
//   body.turret.x = this.players[i].turret.x;
//   body.turret.y = this.players[i].turret.y;
//   body.turret.angle = this.players[i].turret.angle;
function gameStartService($http) {
  return function(players, gameRoom) {
    var startObj = {};
    startObj.started = false;
    startObj.start = function() {
      startObj.started = true;
    };
    startObj.players = players;
    startObj.gameRoom = gameRoom;
    startObj.load = function() {
      var promArr = [];
      for (var i = 0; i < startObj.players.length; i++) {
        var body = {};
        body.kitten = {};
        body.turret = {};
        body.kitten.x = startObj.players[i].kitten.x;
        body.kitten.y = startObj.players[i].kitten.y;
        body.kitten.angle = startObj.players[i].kitten.angle;
        body.turret.x = startObj.players[i].turret.x;
        body.turret.y = startObj.players[i].turret.y;
        body.turret.angle = startObj.players[i].turret.angle;
        body.playerId = startObj.players[i].playerId;
        body.health = startObj.players[i].kitten.health;
        body.healthText = {};
        body.healthText.x = startObj.players[i].kitten.healthText.position.x;
        body.healthText.y = startObj.players[i].kitten.healthText.position.y;
        body.direction = startObj.players[i].direction;
        console.log(body);
        promArr.push($http.put('//lvh.me:3000/games/playerMove/' + startObj.gameRoom, body));
      }
      return Promise.all(promArr).then(function(success) {
        startObj.start();
      });
    };
    return startObj;
  };
}

// app.service('localGameService', [localGameService]);

// function localGameService() {
//   return function(data) {
//     var game = {};
//     game.players = data;
//     return game;
//   };
// }
