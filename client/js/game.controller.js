app.controller('GameController', ['$http', 'players', '$window', 'gameStartService', 'server', GameController]);

function GameController($http, players, $window, gameStartService, server) {
  var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'phaser-example');
  console.log(game);
  console.log(Phaser);
  var PhaserGame = function(game) {

    this.kitten = null;
    this.turret = null;
    this.flame = null;
    this.bullet = null;
    this.playerOne = null;
    this.playerTwo = null;

    this.background = null;
    this.targets = null;
    this.land = null;
    this.emitter = null;

    this.power = 300;
    this.powerText = null;

    this.cursors = null;
    this.fireButton = null;
    this.moveLeftButton = null;
    this.moveRightButton = null;

  };

  PhaserGame.prototype = {
    init: function() {

      this.game.renderer.renderSession.roundPixels = true;
      this.game.world.setBounds(0, 0, 980, 480);
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.arcade.gravity.y = 200;
    },

    preload: function() {
      // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue001/';
      // this.load.crossOrigin = 'anonymous';

      this.load.image('kitten', '../static/playerKitty.png');
      this.load.image('kittenTwo', '../static/playerKitty2.png');
      this.load.image('turret', '../static/Zooka.png');
      this.load.image('bullet', '../static/neon.png');
      this.load.image('background', '../static/background.png');
      this.load.image('flame', '../static/flame.png');
      this.load.image('target', '../static/target.png');
      this.load.image('land', '../static/land.png');

      //  Note: Graphics from Amiga Tanx Copyright 1991 Gary Roberts

    },

    create: function() {
      this.background = this.add.sprite(0, 0, 'background');
      this.token = JSON.parse(window.atob($window.sessionStorage.token.split('.')[1])).id;
      this.gameRoom = $window.location.hash.split('/')[2];
      console.log(this.gameRoom);
      this.startUpdating = false;
      this.updateCounter = 0;

      this.targets = this.add.group(this.game.world, 'targets', false, true, Phaser.Physics.ARCADE);

      this.targets.create(284, 378, 'target');
      this.targets.create(456, 153, 'target');
      this.targets.create(545, 305, 'target');
      this.targets.create(726, 391, 'target');
      this.targets.create(972, 74, 'target');

      this.targets.setAll('body.allowGravity', false);

      this.land = this.add.bitmapData(2048, 768);
      this.land.draw('land');
      this.land.update();
      this.land.addToWorld();


      this.emitter = this.add.emitter(0, 0, 30);
      this.emitter.makeParticles('flame');
      this.emitter.setXSpeed(-120, 120);
      this.emitter.setYSpeed(-100, -200);
      this.emitter.setRotation();


      this.bullet = this.add.sprite(0, 0, 'bullet');
      this.bullet.exists = false;
      this.physics.arcade.enable(this.bullet);
      console.log(players.players);
      // this.players = ['playerOne', 'playerTwo'];
      this.playersIterator = 0;
      this.players = players.players;
      console.log(this.players);
      // this.playerOne = {};
      // this.playerTwo = {};
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].kitten = this.add.sprite(40, 423, 'kitten');
        this.players[i].kitten.anchor.setTo(0.5, 1);
        this.players[i].direction = 'right';
        this.players[i].lastSprite = true;
        this.players[i].pixelCounter = 0;
        this.players[i].turret = this.add.sprite(this.players[i].kitten.x - 12, this.players[i].kitten.y - 42, 'turret');
        this.players[i].power = 300;
        this.players[i].kitten.health = 100;
        this.players[i].kitten.healthText = this.add.text(this.players[i].kitten.x - 20, this.players[i].kitten.y - 60, 'Health: ' + this.players[i].kitten.health, { fontSize: '10px', fill: '#efefef'});
        console.log(this.players[i]);

        // var body = {};
        // body.kitten = {};
        // body.turret = {};
        // body.kitten.x = this.players[i].kitten.x;
        // body.kitten.y = this.players[i].kitten.y;
        // body.kitten.angle = this.players[i].kitten.angle;
        // body.turret.x = this.players[i].turret.x;
        // body.turret.y = this.players[i].turret.y;
        // body.turret.angle = this.players[i].turret.angle;
        // console.log(body);
        // this.updateCounter++;
        // this.startUpdating = updateInit(this.players, this.updateCounter, this.gameRoom, body);
      }
      this.gameStarter = gameStartService(this.players, this.gameRoom);
      console.log(this.gameStarter);
      this.gameStarter.load();
      this.playersIterator = 0;
      // this['players[i]'].kitten = this.add.sprite(40, 423, 'kitten');
      // this['playerTwo'].kitten = this.add.sprite(40, 423, 'kitten');
      // this.playerOne.kitten.anchor.setTo(0.5, 1);
      // this.playerTwo.kitten.anchor.setTo(0.5, 1);
      // this.playerOne.direction = 'right';
      // this.playerTwo.direction = 'right';
      // this.playerOne.lastSprite = true;
      // this.playerTwo.lastSprite = true;
      // this.playerOne.pixelCounter = 0;
      // this.playerTwo.pixelCounter = 0;

      // this.playerOne.turret = this.add.sprite(this.playerOne.kitten.x - 12, this.playerOne.kitten.y - 42, 'turret');
      // this.playerTwo.turret = this.add.sprite(this.playerTwo.kitten.x - 12, this.playerTwo.kitten.y - 42, 'turret');

      this.bulletPixelCounter = 0;
      // this.kittens = this.add.group(this.game.world, 'kittens', false, true, Phaser.Physics.ARCADE);
      // this.kittens.add(this.playerOne.kitten);
      // this.kittens.add(this.playerTwo.kitten);

      // console.log(this.kittens);
      // console.log(this.targets);

      this.flame = this.add.sprite(0, 0, 'flame');
      this.flame.anchor.set(0.5);
      this.flame.visible = false;

      // this.playerOne.power = 300;
      // this.playerTwo.power = 300;
      this.powerText = this.add.text(8, 8, 'Power: 300', {
        font: "18px Arial",
        fill: "#ffffff"
      });
      this.powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
      this.powerText.fixedToCamera = true;

      // this.playerOne.kitten.health = 100;
      // this.playerTwo.kitten.health = 100;
      // this.playerOne.kitten.healthText = this.add.text(this.playerOne.kitten.x - 20, this.playerOne.kitten.y - 60, 'Health: ' + this.playerOne.kitten.health, { fontSize: '10px', fill: '#efefef'});
      // this.playerTwo.kitten.healthText = this.add.text(this.playerTwo.kitten.x - 20, this.playerTwo.kitten.y - 60, 'Health: ' + this.playerTwo.kitten.health, { fontSize: '10px', fill: '#efefef'});

      this.cursors = this.input.keyboard.createCursorKeys();

      this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.fireButton.onDown.add(this.fire, this);

      this.moveLeftButton = this.input.keyboard.addKey(Phaser.Keyboard.A);
      this.moveRightButton = this.input.keyboard.addKey(Phaser.Keyboard.D);
      // this.moveLeftButton.onDown.add(this.moveLeft, this);
      // this.moveRightButton.onDown.add(this.moveRight, this);
      // console.log(this.moveLeftButton);
    },

    win: function(player) {
      console.log(player + ' Wins!!!');
      this.winText = null;
      this.winText = this.add.text(this.game.width/2, this.game.height/2, player + ' Wins!!!', { fontSize: '64px', fill: '#efefef', align: "center"});
      this.winText.anchor.set(0.5);
    },

    die: function(kitten) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].kitten === kitten) {
          this.players[i].turret.kill();
          this.players[i].kitten.healthText.kill();
          kitten.kill();
          console.log(this.players);
          console.log(this.players[i]);
          this.players.splice(i, 1);
          console.log(this.players);
          if (this.players.length == 1) {
            this.win(this.players[0]);
          } else if (this.players.length == 0) {
            console.log("It's a draw.");
          }
        }
      }
    },

    hitKitten: function(bullet, kitten) {
      console.log(this.players[this.playersIterator]);
      this.bulletPixelCounter = 0;
      kitten.health -= 40;
      kitten.healthText.text = "Health: " + kitten.health;
      this.removeBullet();
    },

    bulletVsLand: function() {
      if (this.bullet.x < 0 || this.bullet.x > this.game.world.width || this.bullet.y > this.game.height) {
        this.removeBullet();
        return;
      }

      var x = Math.floor(this.bullet.x);
      var y = Math.floor(this.bullet.y);
      var rgba = this.land.getPixel(x, y);
      // console.log(rgba);
      // console.log(x);
      // console.log(y);

      if (rgba.a > 0) {
        this.land.blendDestinationOut();
        this.land.circle(x, y, 26, 'rgba(0, 0, 0, 255)');
        this.land.blendReset();
        this.land.update();
        this.fall();
        this.bulletPixelCounter = 0;
        this.removeBullet();
      }
    },

    fall: function() {
      for (var i = 0; i < this.players.length; i++) {
        var x = this.players[i].kitten.x;
        var y = this.players[i].kitten.y;
        var rgba = this.land.getPixel(x, y - 1);
        while (rgba.a === 0) {
          y++;
          rgba = this.land.getPixel(x, y);
        }
        this.players[i].kitten.y = y;
        this.players[i].turret.y = y - 42;
        this.players[i].kitten.healthText.y = y - 60;
      }
    },

    jump: function() {
      this[thisplayers[this.playersIterator]].kitten
    },

    move: function(direction) {
      if (this.players[this.playersIterator].lastSprite === true) {
        this.players[this.playersIterator].kitten.loadTexture('kittenTwo', 0);
      } else {
        this.players[this.playersIterator].kitten.loadTexture('kitten', 0);
      }
      if (this.players[this.playersIterator].pixelCounter >= 8) {
        this.players[this.playersIterator].pixelCounter = 0;
        this.players[this.playersIterator].lastSprite = !this.players[this.playersIterator].lastSprite;
      } else {
        this.players[this.playersIterator].pixelCounter++;
      }
      var checkingSurfaceLevel = true;
      var y = this.players[this.playersIterator].kitten.y;
      var x = Math.floor(this.players[this.playersIterator].kitten.x);
      var currAngle = this.players[this.playersIterator].kitten.angle;
      this.players[this.playersIterator].kitten.angle = 0;
      var yTwo = y;
      var counterWall = 0;
      var groundKitty = false;
      while (checkingSurfaceLevel) {
        var rgba = this.land.getPixel(x, y);
        // find lowest y value above land
        if ((rgba.a > 0 || typeof rgba.a == 'undefined') && groundKitty === false) {
          y--;
          yTwo = y;
          // find front of the kitten and space just in front of it
        } else if (rgba.a === 0) {
          y++;
          yTwo = y;
          groundKitty = true;
        } else {
          var rgbaTwo = this.land.getPixel(this.players[this.playersIterator].kitten.x + 35, yTwo);
          var rgbaThree = this.land.getPixel(this.players[this.playersIterator].kitten.x + 36, y - 60);
          // console.log(rgbaThree);
          if (rgbaThree.a > 0 && counterWall == 0) {
            this.players[this.playersIterator].kitten.angle = currAngle;
            counterWall++;
          } else if (rgbaTwo.a > 0 && counterWall == 0) {
            this.players[this.playersIterator].kitten.angle -= 1;
            yTwo--;

          } else {
            // console.log(y);
            // console.log(this.players[this.playersIterator].kitten.y);
            if (y - this.players[this.playersIterator].kitten.y >= -6) {
              // console.log('this is y: ' + y);
              this.players[this.playersIterator].kitten.y = y + 1;
              this.players[this.playersIterator].kitten.healthText.position.x = this.players[this.playersIterator].kitten.x - 20;
              this.players[this.playersIterator].kitten.healthText.position.y = this.players[this.playersIterator].kitten.y - 60;
              //  this.turret.y = y + this.kitten.angle/2;
              //  this.turret.x = this.turret.x - this.kitten.angle/2 + 1;
              this.setPlayerPositions(this.players, this.gameRoom);
              checkingSurfaceLevel = false;
            } else if (direction === 'left') {
              this.players[this.playersIterator].kitten.x++;
              checkingSurfaceLevel = false;
            } else if (direction === 'right') {
              this.players[this.playersIterator].kitten.x--;
              checkingSurfaceLevel = false;
            }
          }
        }
      }
    },

    fire: function() {
      if (this.bullet.exists) {
        return;
      }

      this.bullet.reset(this.players[this.playersIterator].turret.x, this.players[this.playersIterator].turret.y);
      var p = new Phaser.Point(this.players[this.playersIterator].turret.x, this.players[this.playersIterator].turret.y);
      p.rotate(p.x, p.y, this.players[this.playersIterator].turret.rotation, false, 34);

      this.flame.x = p.x;
      this.flame.y = p.y;
      this.flame.alpha = 1;
      this.flame.visible = true;

      this.add.tween(this.flame).to({
        alpha: 0
      }, 100, "Linear", true);

      this.camera.follow(this.bullet);

      this.physics.arcade.velocityFromRotation(this.players[this.playersIterator].turret.rotation, this.players[this.playersIterator].power, this.bullet.body.velocity);
    },

    hitTarget: function(bullet, target) {
      this.emitter.at(target);
      this.emitter.explode(2000, 10);
      target.kill();
      this.removeBullet();
    },

    splashDamage: function(kitten) {
      var checkCircle = new Phaser.Circle(this.bullet.x, this.bullet.y, 35)
      for (var i = 0; i < this.players.length; i++) {
        console.log('Here goes checkOverlap');
        if (this.players[i].kitten != kitten && checkOverlap(checkCircle, this.players[i].kitten)) {
          this.players[i].kitten.health -= 20;
          this.players[i].kitten.healthText.text = "Health: " + this.players[i].kitten.health;
        }
      }
    },

    removeBullet: function() {
      this.splashDamage(this.players[this.playersIterator].kitten);
      this.bullet.kill();
      this.camera.follow();
      if (this.players[this.playersIterator + 1]) {
        this.add.tween(this.camera).to({
          x: (this.players[this.playersIterator + 1].kitten.x) - this.game.width / 2
        }, 1000, "Quint", true, 1000);
      } else {
        this.add.tween(this.camera).to({
          x: (this.players[this.playersIterator].kitten.x) - this.game.width / 2
        }, 1000, "Quint", true, 1000);
      }
      this.bulletPixelCounter = 0;
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].kitten.health <= 0) {
          this.die(this.players[i].kitten);
        }
      }
      if (this.playersIterator >= this.players.length - 1) {
        this.playersIterator = 0;
      } else {
        this.playersIterator++;
      }
    },

    getPlayerPositions: function(allPlayers) {
      $http.get('//lvh.me:3000/games/gamesPlayers/' + this.gameRoom).then(function(data) {
        console.log(data);
        console.log(allPlayers);
        for (var i = 0; i < data.data.length; i++) {
          for (var j = 0; j < allPlayers.length; j++) {
            console.log(data.data[i]);
            if (allPlayers[j].playerId === data.data[i].playerId) {
              allPlayers[j].kitten.x = data.data[i].kittenX;
              allPlayers[j].kitten.y = data.data[i].kittenY;
              allPlayers[j].kitten.angle = data.data[i].kittenAngle;
              allPlayers[j].turret.x = data.data[i].turretX;
              allPlayers[j].turret.y = data.data[i].turretY;
              allPlayers[j].turret.angle = data.data[i].turretAngle;
              allPlayers[j].kitten.health = data.data[i].health;
              allPlayers[j].kitten.healthText.position.x = data.data[i].healthTextX;
              allPlayers[j].kitten.healthText.position.y = data.data[i].healthTextY;
              allPlayers[j].direction = data.data[i].direction;
            }
            console.log(allPlayers);
          }
        }
      });
    },

    setPlayerPositions: function(allPlayers, gameRoom) {
      var promArr = [];
      for (var i = 0; i < allPlayers.length; i++) {
        console.log(allPlayers[i]);
        var body = {};
        body.kitten = {};
        body.turret = {};
        body.kitten.x = allPlayers[i].kitten.x;
        body.kitten.y = allPlayers[i].kitten.y;
        body.kitten.angle = allPlayers[i].kitten.angle;
        body.turret.x = allPlayers[i].turret.x;
        body.turret.y = allPlayers[i].turret.y;
        body.turret.angle = allPlayers[i].turret.angle;
        body.playerId = allPlayers[i].playerId;
        body.health = allPlayers[i].kitten.health;
        body.healthText = {};
        body.healthText.x = allPlayers[i].kitten.healthText.position.x;
        body.healthText.y = allPlayers[i].kitten.healthText.position.y;
        body.direction = allPlayers[i].direction;
        promArr.push($http.put('//lvh.me:3000/games/playerMove/' + gameRoom, body));
      }
      Promise.all(promArr).then(function(data) {
        console.log('hello');
      });

    },

    update: function() {
      // Code for turning and facing left
      if (this.moveLeftButton.isDown && this.bullet.exists !== true && this.token === this.players[this.playersIterator].playerId) {
        this.players[this.playersIterator].kitten.x--;
        var prevDir = this.players[this.playersIterator].direction;
        this.players[this.playersIterator].direction = 'left';
        this.move(this.players[this.playersIterator].direction);
        this.camera.follow(this.players[this.playersIterator].kitten);
        this.players[this.playersIterator].kitten.scale.setTo(-1, 1);
        var turrAngle = this.players[this.playersIterator].turret.angle;
        this.players[this.playersIterator].turret.kill();
        this.players[this.playersIterator].turret = this.add.sprite(this.players[this.playersIterator].kitten.x + 12 + this.players[this.playersIterator].kitten.angle / 1.5, this.players[this.playersIterator].kitten.y - 42 - this.players[this.playersIterator].kitten.angle / 16, 'turret');
        this.players[this.playersIterator].turret.scale.setTo(1, -1);
        this.setPlayerPositions(this.players, this.gameRoom);
        if (prevDir === this.players[this.playersIterator].direction) {
          this.players[this.playersIterator].turret.angle = turrAngle;
        } else {
          this.players[this.playersIterator].turret.angle = -turrAngle + 180;
        }

        // Code for turning and facing left
      } else if (this.moveRightButton.isDown && this.bullet.exists != true && this.token === this.players[this.playersIterator].playerId) {
        this.players[this.playersIterator].kitten.x++;
        var prevDir = this.players[this.playersIterator].direction;
        this.players[this.playersIterator].direction = 'right';
        this.move(this.players[this.playersIterator].direction);
        this.camera.follow(this.players[this.playersIterator].kitten);
        this.players[this.playersIterator].kitten.scale.setTo(1, 1);
        var turrAngle = this.players[this.playersIterator].turret.angle;
        this.players[this.playersIterator].turret.kill();
        if (this.players[this.playersIterator].kitten.angle >= -46) {
          this.players[this.playersIterator].turret = this.add.sprite(this.players[this.playersIterator].kitten.x - 12 + this.players[this.playersIterator].kitten.angle / 1.7, this.players[this.playersIterator].kitten.y - 42 - this.players[this.playersIterator].kitten.angle / 2.3, 'turret');
        } else if (this.players[this.playersIterator].kitten.angle >= -52) {
          this.players[this.playersIterator].turret = this.add.sprite(this.players[this.playersIterator].kitten.x - 12 + this.players[this.playersIterator].kitten.angle / 1.9, this.players[this.playersIterator].kitten.y - 42 - this.players[this.playersIterator].kitten.angle / 2.1, 'turret');
        } else {
          this.players[this.playersIterator].turret = this.add.sprite(this.players[this.playersIterator].kitten.x - 12 + this.players[this.playersIterator].kitten.angle / 2, this.players[this.playersIterator].kitten.y - 42 - this.players[this.playersIterator].kitten.angle / 2, 'turret');
        }
        this.players[this.playersIterator].turret.scale.setTo(1, 1);
        this.setPlayerPositions(this.players, this.gameRoom);
        if (prevDir === this.players[this.playersIterator].direction) {
          this.players[this.playersIterator].turret.angle = turrAngle;
        } else {
          this.players[this.playersIterator].turret.angle = -turrAngle + 180;
        }
      }

      // Ensures kitten sprite is on top of the turret and bugfix for turret angle
      this.players[this.playersIterator].kitten.bringToTop();
      this.players[this.playersIterator].turret.angle = Math.ceil(this.players[this.playersIterator].turret.angle);
      if (this.players[this.playersIterator].turret.angle % 2 !== 0) {
        this.players[this.playersIterator].turret.angle -= 1;
      }

      // Code to ensure turret is always in an acceptable range based on the kitten angle
      if (this.players[this.playersIterator].turret.angle < this.players[this.playersIterator].kitten.angle - 90 && this.players[this.playersIterator].direction === 'right' && this.token === this.players[this.playersIterator].playerId) {
        this.players[this.playersIterator].turret.angle = this.players[this.playersIterator].kitten.angle - 90;
      } else if (this.players[this.playersIterator].turret.angle > this.players[this.playersIterator].kitten.angle && this.players[this.playersIterator].direction === 'right' && this.token === this.players[this.playersIterator].playerId) {
        this.players[this.playersIterator].turret.angle = this.players[this.playersIterator].kitten.angle;
      } else if (Math.ceil(this.players[this.playersIterator].turret.angle) < (180 + this.players[this.playersIterator].kitten.angle) && Math.ceil(this.players[this.playersIterator].turret.angle) > this.players[this.playersIterator].kitten.angle - 90 && this.players[this.playersIterator].direction == 'left' && this.token === this.players[this.playersIterator].playerId) {
        this.players[this.playersIterator].turret.angle = 180 + this.players[this.playersIterator].kitten.angle;
      }

      // If the bullet is flying through the air
      if (this.bullet.exists) {
        this.bulletPixelCounter++;
        for (var i = 0; i < this.players.length; i++) {
          if (this.bulletPixelCounter > 35 - (this.players[this.playersIterator].power/25) || this.players[this.playersIterator].kitten != this.players[i].kitten) {
            if (checkOverlap(this.bullet, this.players[i].kitten)) {
              this.hitKitten(this.bullet, this.players[i].kitten);
            }
          }
        }
        this.physics.arcade.overlap(this.bullet, this.targets, this.hitTarget, null, this);
        this.bulletVsLand();
      } else {
        if (this.cursors.left.isDown && this.players[this.playersIterator].power > 100) {
          this.players[this.playersIterator].power -= 2;
        } else if (this.cursors.right.isDown && this.players[this.playersIterator].power < 600) {
          this.players[this.playersIterator].power += 2;
        }

        // Code to change turret angle
        if (this.cursors.up.isDown && this.players[this.playersIterator].turret.angle > this.players[this.playersIterator].kitten.angle - 90 && this.players[this.playersIterator].direction === 'right' && this.token === this.players[this.playersIterator].playerId) {
          this.players[this.playersIterator].turret.angle -= 2;
          this.setPlayerPositions(this.players, this.gameRoom);
        } else if (this.cursors.down.isDown && this.players[this.playersIterator].turret.angle < this.players[this.playersIterator].kitten.angle && this.players[this.playersIterator].direction === 'right' && this.token === this.players[this.playersIterator].playerId) {
          this.players[this.playersIterator].turret.angle += 2;
          this.setPlayerPositions(this.players, this.gameRoom);
        } else if (this.cursors.up.isDown && this.players[this.playersIterator].turret.angle < this.players[this.playersIterator].kitten.angle - 92 && this.players[this.playersIterator].direction === 'left' && this.token === this.players[this.playersIterator].playerId) {
          this.players[this.playersIterator].turret.angle += 2;
          this.setPlayerPositions(this.players, this.gameRoom);
        } else if (this.cursors.down.isDown && this.players[this.playersIterator].turret.angle > this.players[this.playersIterator].kitten.angle - 180 && this.players[this.playersIterator].direction === 'left' && this.token === this.players[this.playersIterator].playerId) {
          this.players[this.playersIterator].turret.angle -= 2;
          this.setPlayerPositions(this.players, this.gameRoom);
        } else if (this.cursors.up.isDown && this.players[this.playersIterator].turret.angle >= (180 + this.players[this.playersIterator].kitten.angle) && this.players[this.playersIterator].direction === 'left' && this.token === this.players[this.playersIterator].playerId) {
          this.players[this.playersIterator].turret.angle += 2;
          this.setPlayerPositions(this.players, this.gameRoom);
        }
        this.powerText.text = 'Power: ' + this.players[this.playersIterator].power;
      }
      console.log(this.gameStarter.started);
      console.log('token: ' + this.token);
      console.log('playerID: ' + this.players[this.playersIterator].playerId);
      this.updateCounter++;
      if (this.gameStarter.started === true && this.token !== this.players[this.playersIterator].playerId && this.updateCounter >= 30) {
        this.getPlayerPositions(this.players);
        this.updateCounter = 0;
      }
      // for (var i = 0; i < this.players.length; i++) {
      //   if (this.players[i].direction === 'right' && this.players[i].prevDir === 'left') {
      //
      //   }
      // }
    }
  };

  // function for checking whether a bullet is hitting a kitten
  function checkOverlap(bullet, kitten) {
    var boundsA = bullet.getBounds();
    var boundsB = kitten.getBounds();

    console.log(Phaser.Rectangle.intersects(boundsA, boundsB));
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  // function updateInit(players, updateCounter, gameRoom, body, updating) {
  //   $http.put('//lvh.me:3000/games/playerMove/' + gameRoom, body).then(function(data) {
  //     console.log(data);
  //     updateCounter += 1;
  //     console.log('updateCounter: ' + updateCounter);
  //     if (updateCounter === players.length) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }).catch(function(err) {
  //     console.log('THIS IS AN ERROR', err);
  //   });
  // }

  game.state.add('Game', PhaserGame, true);

}
