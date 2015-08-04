(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Game = CrappyBird.Game = function () {
    this.obstacles = [];
    this.craps = [];
    this.backgrounds = [];
    this.currentObstacle = null;
    this.score = 0;
  };

  Game.SPEED = -3;
  Game.GAP = 180;
  Game.PIPEWIDTH = 120;

  Game.prototype.add = function (object) {
    if (object instanceof CrappyBird.Obstacle) {
      this.obstacles.push(object);
    } else if (object instanceof CrappyBird.Background) {
      this.backgrounds.push(object);
    }
  };

  Game.prototype.addBackground = function (pos) {
    var bg = new CrappyBird.Background({
      pos: pos,
      speed: Game.SPEED,
      game: this
    });
    this.add(bg);
    return bg;
  };

  Game.prototype.addBirdy = function () {
    var birdy = new CrappyBird.Birdy({
      pos: [160, 290],
      game: this
    });
    this.birdy = birdy;
    return birdy;
  };

  Game.prototype.addObstacle = function () {
    var obstacle = new CrappyBird.Obstacle({
      pos: [Game.DIM_X, 0],
      height: Math.floor(Math.random() * (Game.DIM_Y - Game.GAP)),
      width: Game.PIPEWIDTH,
      gap: Game.GAP,
      speed: Game.SPEED,
      game: this
    });
    this.add(obstacle);
    return obstacle;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.obstacles, this.craps, this.birdy);
  };

  Game.prototype.checkCollision = function () {
    var birdy = this.birdy;
    this.obstacles.forEach(function (obstacle) {
      if (birdy.pos[0] + birdy.width >= obstacle.pos[0] &&
          birdy.pos[0] <= obstacle.pos[0] + obstacle.width) {
        if (birdy.pos[1] <= obstacle.openingTop ||
            birdy.pos[1] + birdy.height >= obstacle.openingBottom) {
          console.log("you dieded!");
        }
      }
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function (obj) {
      obj.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.backgrounds.forEach(function (bg) {
      bg.move();
    });
    this.allObjects().forEach (function (object) {
      object.move();
    });
  };

  Game.prototype.remove = function (obj) {
    if (obj instanceof CrappyBird.Obstacle) {
      this.obstacles.splice(this.obstacles.indexOf(obj), 1);
    } else if (obj instanceof CrappyBird.Background) {
      this.backgrounds.splice(this.backgrounds.indexOf(obj), 1);
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollision();
    return this;
  };
})();
