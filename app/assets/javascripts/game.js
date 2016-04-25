(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }
  
  BIRDY_HEIGHT = 45;
  BIRDY_WIDTH = 50;
  BIRDY_VEL = [0, 10];
  BIRDY_ACC = [0, 0.8];
  
  GROUND_HEIGHT = 100;

  var Game = CrappyBird.Game = function (ctx) {
    this.ctx = ctx;
    this.birdy = this.addBirdy();
    this.obstacles = [];
    this.currentObstacle = null;
    this.score = 0;
    this.addObstacle(1000);
    this.sounds = new CrappyBird.Sounds();
    this.over = false;
  };

  Game.prototype.addBirdy = function () {
    var startX = (this.ctx.canvas.width / 2) - (BIRDY_WIDTH / 2), 
        startY = (this.ctx.canvas.height / 2) - (BIRDY_HEIGHT / 2),
        birdy = new CrappyBird.Birdy2({
                    pos: [startX, startY],
                    vel: BIRDY_VEL,
                    acc: BIRDY_ACC,
                    width: BIRDY_WIDTH,
                    height: BIRDY_HEIGHT,
                    ctx: this.ctx
                });
    return birdy;
  };

  Game.prototype.addObstacle = function (startX) {
    var obstacle = new CrappyBird.Obstacle(this, startX);
    this.obstacles.push(obstacle);
    return obstacle;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.obstacles, this.birdy);
  };

  Game.prototype.checkCollision = function () {
    var birdy = this.birdy;
    var game = this;
    this.obstacles.forEach(function (obstacle){
      if (birdy.pos[1] + birdy.height >= game.dimY - 100) {
        game.over = true;
        birdy.dead = true;
      }
      if (birdy.pos[0] + birdy.width >= obstacle.pos &&
          birdy.pos[0] <= obstacle.pos + obstacle.width) {
        if (birdy.pos[1] <= obstacle.topOpening ||
            birdy.pos[1] + birdy.height >= obstacle.bottomOpening) {
          game.over = true;
          birdy.dead = true;
        }
      }
    });
  };

  Game.prototype.draw = function (ctx) {
    this.allObjects().forEach(function (obj) {
      obj.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (obj) {
      obj.move();
    });
  };

  Game.prototype.remove = function (obj) {
    this.obstacles.splice(this.obstacles.indexOf(obj), 1);
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollision();

    return this;
  };
})();
