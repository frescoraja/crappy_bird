(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Obstacle = CrappyBird.Obstacle = function (options) {
    CrappyBird.MovingObject.call(this, options);
    this.game = options.game;
    this.pipes = options.images;
    this.gap = options.gap;
    var heights = this.generateHeights();
    this.bottomHeight = heights[0];
    this.topHeight = heights[1];
    this.topOpening = this.topHeight;
    this.bottomOpening = this.topHeight + this.gap;
  };

  CrappyBird.Utils.inherits(Obstacle, CrappyBird.MovingObject);

  Obstacle.prototype.generateHeights = function () {
    var aboveGround = this.ctx.canvas.height - this.game.ground.height;
    var pipeAbleSpace = aboveGround - this.gap;
    var minHeight =  pipeAbleSpace * 0.1;
    var maxHeight = pipeAbleSpace * 0.9;

    var topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    var bottomHeight = pipeAbleSpace - topHeight;
    return [bottomHeight, topHeight];
  };
  
  Obstacle.prototype.draw = function () {
    this.ctx.drawImage(this.pipes[0],
                  this.pos[0], this.topHeight - this.ctx.canvas.height,
                  this.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.pipes[1],
                  0, 0,
                  this.pipes[1].width, (this.bottomHeight / this.ctx.canvas.height) * this.pipes[1].height,
                  this.pos[0], this.ctx.canvas.height - 100 - this.bottomHeight,
                  this.width, this.bottomHeight);
  };
})();
