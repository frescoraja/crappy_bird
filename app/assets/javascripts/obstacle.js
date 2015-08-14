(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Obstacle = CrappyBird.Obstacle = function (game, startX) {
    this.game = game;
    this.pipes = new CrappyBird.Images().pipes;
    var heights = this.generateHeights();
    this.bottomHeight = heights[0];
    this.topHeight = heights[1];
    this.width = 80;
    this.pos = startX || this.game.dimX;
    this.topOpening = this.topHeight;
    this.bottomOpening = this.topHeight + 130;
    this.point = new CrappyBird.Sounds().point;
    this.gavePoint = false;
  };

  Obstacle.prototype.generateHeights = function () {
    var gapSize = 130;
    var aboveGround = this.game.dimY - 100;
    var pipeAbleSpace = aboveGround - gapSize;
    var minHeight =  pipeAbleSpace * 0.1;
    var maxHeight = pipeAbleSpace * 0.9;

    var topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    var bottomHeight = pipeAbleSpace - topHeight;
    return [bottomHeight, topHeight];
  };

  Obstacle.prototype.draw = function (ctx) {
    ctx.drawImage(this.pipes[0],
                  this.pos, this.topHeight - this.game.dimY,
                  this.width, this.game.dimY);
    ctx.drawImage(this.pipes[1],
                  0, 0,
                  this.pipes[1].width, (this.bottomHeight / this.game.dimY) * this.pipes[1].height,
                  this.pos, this.game.dimY - 100 - this.bottomHeight,
                  this.width, this.bottomHeight);
  };

  Obstacle.prototype.move = function () {
    if (this.pos + this.width < 0) {
      this.remove();
    }
    if (this.pos >= 90 && this.pos < 92) {
      this.game.addObstacle();
    }
    this.pos += -3;
    if (this.pos + this.width <= this.game.birdy.pos[0]) {
      if (!this.gavePoint) {
        this.gavePoint = true;
        this.game.score += 1;
        this.point.play();
      }
    }
  };

  Obstacle.prototype.remove = function () {
    this.game.remove(this);
  };
})();
