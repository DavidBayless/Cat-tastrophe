app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '../views/home.html',
      controller: 'TankController as TC'
    })
    .when('/login', {
      templateUrl: '../views/login.html',
      controller: 'TankController as TC'
    })
    .when('/signup', {
      templateUrl: '../views/signup.html',
      controller: 'TankController as TC'
    })
    .when('/lobby', {
      templateUrl: '../views/lobby.html',
      controller: 'TankController as TC'
    })
    .when('/gameRoom/:id', {
      templateUrl: '../views/gameRoom.html',
      controller: 'TankController as TC'
    })
    .when('/makeGame', {
      templateUrl: '../views/makeGame.html',
      controller: 'TankController as TC'
    })
    .when('/games/:gameId', {
      templateUrl: '../views/games.html',
      controller: 'GameController as GC'
    })
    .when('/gameType', {
      templateUrl: '../views/gameType.html',
      controller: 'TankController as TC'
    })
    .when('/gamesLocal', {
      templateUrl: '../views/games.html',
      controller: 'GameLocalController as GLC'
    })
    .when('/localLobby', {
      templateUrl: '../views/localLobby.html',
      controller: 'TankController as TC'
    });
});
