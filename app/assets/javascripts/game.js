(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }
  
  BIRDY_HEIGHT      = 45;
  BIRDY_WIDTH       = 50;
  BIRDY_VEL         = [0, 1];
  BIRDY_FLY_VEL     = -5;
  BIRDY_ACC         = [0, .333];

  SKY_VEL           = [-1, 0];
  GROUND_VEL        = [-3, 0];

  FIRST_OBST_STARTX = 1000;

  PIPE_GAP_SIZE     = 130;
  PIPE_WIDTH        = 80;
  
  var Game = CrappyBird.Game = function (ctx) {
    this.ctx             = ctx;
    this.images          = new CrappyBird.Images();
    this.sounds          = new CrappyBird.Sounds();
    this.birdy           = this.addBirdy();
    this.sky             = this.addSky();
    this.ground          = this.addGround();
    this.obstacles       = [];
    this.currentObstacle = this.addObstacle(FIRST_OBST_STARTX);
    this.score           = 0;
    this.over            = false;
  };

  Game.prototype.addBirdy = function () {
    var startX = (this.ctx.canvas.width / 2) - (BIRDY_WIDTH / 2), 
        startY = (this.ctx.canvas.height / 3) - (BIRDY_HEIGHT / 2),
        birdy = new CrappyBird.Birdy2({
          pos: [startX, startY],
          vel: BIRDY_VEL,
          acc: BIRDY_ACC,
          fly_vel: BIRDY_FLY_VEL,
          width: BIRDY_WIDTH,
          height: BIRDY_HEIGHT,
          image: this.images.birdies[4],
          ctx: this.ctx
        });
    return birdy;
  };

  Game.prototype.addGround = function() {
    var options = {
      vel: GROUND_VEL,
      image: this.images.ground,
      ctx: this.ctx
    };

    return new CrappyBird.Ground(options);
  };
  
  Game.prototype.addSky = function() {
    var options = {
      vel: SKY_VEL,
      image: this.images.sky,
      ctx: this.ctx
    };

    return new CrappyBird.Sky(options);
  };

  Game.prototype.addObstacle = function (startX) {
    var options = {
          pos: [startX, 0],
          vel: GROUND_VEL,
          gap: PIPE_GAP_SIZE,
          height: "N/A",
          width: PIPE_WIDTH,
          ctx: this.ctx,
          game: this,
          images: this.images.pipes,
    };
    var obstacle = new CrappyBird.Obstacle(options);
    this.obstacles.push(obstacle);

    return obstacle;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.sky, this.ground, this.obstacles, this.birdy);
  };

  Game.prototype.awardPoint = function () {
    this.score += 1;
    this.sounds.point.play();
  };

  Game.prototype.birdyHitGround = function() {
    return (this.birdy.pos[1] + this.birdy.height) >= (this.ctx.canvas.height - this.ground.height);
  };
  
  Game.prototype.birdyHitObstacle = function(obstacle) {
    if ((this.birdy.pos[0] + this.birdy.width >= obstacle.pos[0] &&
          this.birdy.pos[0] <= obstacle.pos[0] + obstacle.width) &&
        (this.birdy.pos[1] <= obstacle.topOpening || 
         this.birdy.pos[1] + this.birdy.height >= obstacle.bottomOpening)) {
      return true;
    }

    return false; 
  };

  Game.prototype.checkCollision = function () {
    if (this.birdyHitGround() || this.birdyHitObstacle(this.currentObstacle)) {
      this.over = true;
      this.birdy.dead = true;
    }
  };

  Game.prototype.checkCurrentObstacle = function() {
    if (this.currentObstacle.pos[0] + this.currentObstacle.width < this.birdy.pos[0]) {
      this.currentObstacle = this.addObstacle(this.ctx.canvas.width);
      this.awardPoint();
    }
  };
  
  Game.prototype.checkObstaclePosition = function () {
    var obstacle;
    for (var idx = 0; idx < this.obstacles.length; idx++) {
      obstacle = this.obstacles[idx];
      if (obstacle.pos[0] + obstacle.width < 0) {
        this.remove(obstacle, idx);
      }  
    }
  };

  Game.prototype.draw = function (ctx) {
    this.allObjects().forEach(function (obj) {
      obj.draw();
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (obj) {
      obj.move();
    });
  };

  Game.prototype.remove = function (obj, idx) {
    this.obstacles.splice(idx, 1);
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollision();
    this.checkCurrentObstacle();
    this.checkObstaclePosition();

    return this;
  };
})();
