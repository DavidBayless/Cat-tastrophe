app.controller('TankController', ['$scope', '$rootScope', '$http', '$window', 'isLoggedInService', 'allGamesService', 'players', 'maps', TankController]);

function TankController($scope, $rootScope, $http, $window, isLoggedInService, allGamesService, players, maps) {
  if ($window.location.hash.split('/')[1] !== 'games') {
    var vm = this;
    // console.log(vm.player);
    // if (typeof vm.player == 'undefined') {
    //   vm.player = '';
    // }
    vm.gameOwner = 0;
    vm.levels = [1, 2, 3, 4];
    vm.game = vm.game || {};
    vm.gameStarted = false;
    console.log($window.sessionStorage.token);
    console.log($window.location);
    if ($window.sessionStorage.token) {
      vm.playerToken = JSON.parse(window.atob($window.sessionStorage.token.split('.')[1])).id;
    } else {
      vm.playerToken = 0;
    }

    console.log(vm.playerToken);
    function checkingHref() {
      if (!$window.sessionStorage.token && ($window.location.hash != '#/login' && $window.location.hash != '#/signup')) {
        $window.location.href = '#/login';
      }
      var rootHash = $window.location.hash.split('/')
      console.log(rootHash);
      var possibleId = rootHash[2];
      rootHash = rootHash[0] + '/' + rootHash[1];
      console.log(possibleId);
      console.log(typeof vm.game.id);
      if (typeof vm.game.id === 'undefined') {
        console.log("It's happening!");
        vm.game.id = possibleId;
      }
      console.log(rootHash);
      if (rootHash === '#/gameRoom') {
        console.log('roothash is accurate');
        console.log(vm.game.id);
        $http.get('//lvh.me:3000/games/gamesPlayers/' + vm.game.id).then(function(data) {
          console.log(data.data);
          if (vm.gamePlayers !== data.data) {
            vm.gamePlayers = data.data;
            players.players = [];
            vm.gamePlayers.forEach(function(player) {
              players.addPlayers(player);
            });
          }
          vm.gameOwner = data.data[0].playerId;
        }).catch(function(err) {
          console.log('this is an error: ' + err);
        });

        $http.get('//lvh.me:3000/games/' + possibleId).then(function(data) {
          console.log(data.data[0]);
          if (data.data[0].isStarted === true) {
            // console.log(vm.gamePlayers);
            $window.location.href='#/games/' + possibleId;
          }
        }).catch(function(err) {
          console.log(err);
        });
      }
      if (vm.gameStarted ) {

      }
      if ($window.location.hash.split('/')[1] !== 'games') {
        window.setTimeout(checkingHref, 1000);
      }
    }

    // console.log(window.atob($window.sessionStorage.token.split('.')[1]));
    // $http.get('//lvh.me:3000/games/gamesPlayers/3').then(function(stuff) {
    //   console.log(stuff);
    // });
    window.setTimeout(checkingHref, 1000);
    // console.log($window.location.pathname);
    vm.gamePlayers = [];
    vm.games = [];
    vm.login = function(user) {
      // console.log('hello world');
      $http.post('//lvh.me:3000/users', user).then(function(data) {
        $window.location.href='/';
        console.log(data.data);
        $window.sessionStorage.token = data.data;
        // isLoggedInService(data.data[0].username)();
      }).catch(function(err) {
        console.log(err);
      });
    };

    vm.signup = function(user) {
      console.log(user);
      $http.post('//lvh.me:3000/users/new', user).then(function(data) {
        $window.location.href='#/login';
        console.log(data);
        // isLoggedInService(data.data[0].username)();
      }).catch(function (data) {
        delete $window.sessionStorage.token;
      });
    };

    allGamesService.then(function(data) {
      console.log('Im here');
      vm.games = data.data;
    }).catch(function(err) {
      console.log(err);
    });
    // window.setTimeout($scope.$apply(), 1000);

    vm.enterGameRoom = function(game) {
      console.log(game);
      $http.put('//lvh.me:3000/games/add/' + game.id, window.atob($window.sessionStorage.token.split('.')[1]))
      .then(function(data) {
        vm.game = game;
        console.log(data.data);
        vm.gamePlayers = data.data;
        $window.location.href='#/gameRoom/' + game.id;
      }).catch(function(err) {
        console.log(err);
      });
    };

    vm.createRoom = function(game) {
      console.log(game);
      game.level = parseInt(game.level);
      game.password = '';
      $http.post('//lvh.me:3000/games/' + JSON.parse(window.atob($window.sessionStorage.token.split('.')[1])).id, game).then(function(data) {
        console.log(data.data.game);
        vm.gamePlayers = data.data.player;
        vm.game = game;
        $window.location.href='#/gameRoom/' + data.data.game[0].id;
      }).catch(function(err) {
        console.log(err);
      });
    };

    vm.numPlayers = '2';
    vm.getNumber = function(num) {
      if (typeof num === 'number') {
        return new Array(num);
      } else {
        num = parseInt(num);
        return new Array(num);
      }
    };

    vm.createLocalGame = function(game) {
      console.log(game);
      for (var i = 0; i < game.players.length; i++) {
        players.addPlayers(game.players[i]);
      }
      maps.select(parseInt(game.map));
      $window.location.href='#/gamesLocal';
    };

    vm.startGame = function(players) {
      console.log(players);
      $http.put('//lvh.me:3000/games/start/' + vm.game.id).then(function(data) {
        console.log(data);
      }).catch(function(err) {
        console.log(err);
      });
    };
  }
}
