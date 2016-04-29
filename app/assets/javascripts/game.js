(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }
  
  // tweak these constants to adjust difficulty of the game
  // - make birdy larger, make gap between obstacles smaller,
  //   increase gravity, or increase flying velocity
  // - obstacle velocity is tied to ground velocity, the faster
  //   it moves, the harder the game!
  // check image.js for birdy image indices. alter at will!  
  var BIRDY_HEIGHT      = 45;
  var BIRDY_WIDTH       = 50;
  var BIRDY_VEL         = [0, 0];
  var BIRDY_FLY_VEL     = -10;
  var BIRDY_ACC         = [0, 0.8];
  var BIRDY_IMAGE_IDX   = [0, 4, 5];

  var DUDU_VEL          = [0, 0];
  var DUDU_ACC          = [0, 0.2];

  var SKY_VEL           = [-1, 0];
  var GROUND_VEL        = [-3, 0];

  var FIRST_OBST_STARTX = 1000;

  var PIPE_GAP_SIZE     = 130;
  var PIPE_WIDTH        = 80;
  
  var Game = CrappyBird.Game = function (options, makeObstacles) {
    this.ctx             = options.ctx;
    this.images          = new CrappyBird.Images();
    this.sounds          = new CrappyBird.Sounds();
    this.birdy           = this.addBirdy(options.birdyOpts);
    this.sky             = this.addSky(options.skyOpts);
    this.ground          = this.addGround(options.groundOpts);
    this.obstacles       = [];
    this.dudus           = [];
    this.score           = 0;
    this.over            = false;
    if (makeObstacles) {
      this.currentObstacle = this.addObstacle(FIRST_OBST_STARTX);
    }
  };

  Game.prototype.addBirdy = function (options) {
    var startX = Math.floor((this.ctx.canvas.width / 2) - (BIRDY_WIDTH / 2)), 
        startY = Math.floor((this.ctx.canvas.height / 3) - (BIRDY_HEIGHT / 2)),
        birdOptions = {
          pos: [startX, startY],
          acc: BIRDY_ACC,
          fly_vel: BIRDY_FLY_VEL,
          width: BIRDY_WIDTH,
          height: BIRDY_HEIGHT,
          imageIndices: BIRDY_IMAGE_IDX,
          images: this.images.birdies,
          ctx: this.ctx
        };
    
    CrappyBird.Utils.merge(birdOptions, options);

    return new CrappyBird.Birdy(birdOptions);
  };

  Game.prototype.addDudu = function() {
    var options = {
      ctx: this.ctx,
      birdy: this.birdy,
      pos: [].concat(this.birdy.pos),
      vel: [0, 3],
      acc: DUDU_ACC,
      image: this.images.dudu
    };
    
    var dudu = new CrappyBird.Dudu(options);
    this.sounds.poo.play();
    this.dudus.push(dudu);
  };

  Game.prototype.addGround = function(options) {
    var groundOptions = {
      vel: GROUND_VEL,
      image: this.images.ground,
      ctx: this.ctx
    };

    CrappyBird.Utils.merge(groundOptions, options);

    return new CrappyBird.Ground(groundOptions);
  };
  
  Game.prototype.addSky = function(options) {
    var skyOptions = {
      vel: SKY_VEL,
      image: this.images.sky,
      ctx: this.ctx
    };

    CrappyBird.Utils.merge(skyOptions, options);

    return new CrappyBird.Sky(skyOptions);
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
          images: this.images.pipes
    };
    var obstacle = new CrappyBird.Obstacle(options);
    this.obstacles.push(obstacle);

    return obstacle;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.sky,
        this.ground,
        this.obstacles,
        this.dudus,
        this.birdy);
  };

  Game.prototype.awardPoint = function () {
    this.score += 1;
    this.sounds.point.play();
  };

  Game.prototype.birdyHitGround = function() {
    if (this.birdy.hitGround(this.ground.height)) {
      this.sounds.hit.play();
      return true;
    }
    return false;
  };
  
  Game.prototype.birdyHitObstacle = function(obstacle) {
    if (!obstacle || this.over) return;
    if (this.birdy.intersects(obstacle)) {
      this.sounds.die.play();
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
    if (!this.currentObstacle) return;
    if (this.currentObstacle.pos[0] + this.currentObstacle.width < this.birdy.pos[0]) {
      this.currentObstacle = this.addObstacle(this.ctx.canvas.width);
      this.awardPoint();
    }
  };
  
  Game.prototype.checkDudu = function() {
    var dudu;
    for (var idx = 0; idx < this.dudus.length; idx++) {
      dudu = this.dudus[idx];
      if (!dudu.onScreen()) {
        this.removeDudu(dudu, idx);
      } else if (dudu.hitPipes(this.obstacles)) {
        this.score += 10;
        this.removeDudu(dudu, idx); 
      } else if (dudu.hitGround(this.ground.height)) {
        dudu.vel = this.ground.vel;
        dudu.acc = this.ground.acc;
      }
    }
  };

  Game.prototype.checkObstaclePosition = function () {
    var obstacle;
    for (var idx = 0; idx < this.obstacles.length; idx++) {
      obstacle = this.obstacles[idx];
      if (obstacle.pos[0] + obstacle.width < 0) {
        this.removeObstacle(obstacle, idx);
      }  
    }
  };

  Game.prototype.draw = function () {
    this.allObjects().forEach(function (obj) {
      obj.draw();
    });
  };

  Game.prototype.drawGameOver = function () {
    this.allObjects().forEach(function (obj) {
      if (!(obj instanceof CrappyBird.Birdy &&
          obj instanceof CrappyBird.Dudu)) {
        obj.vel = [0, 0];
      }
    });
  };

  Game.prototype.flyBird = function () {
    this.sounds.fly.play();
    this.birdy.fly();
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (obj) {
      obj.move();
    });
  };

  Game.prototype.removeDudu = function(dudu, idx) {
    this.dudus.splice(idx, 1);
  };

  Game.prototype.removeObstacle = function (obj, idx) {
    this.obstacles.splice(idx, 1);
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCurrentObstacle();
    this.checkObstaclePosition();
    this.checkDudu();
    this.checkCollision();

    return this;
  };
})();
