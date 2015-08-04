(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  function randomColor () {
    var hexDigits = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 3; i++) {
      color += hexDigits[Math.floor((Math.random() * 16))];
    }

    return color;
  }

  var Obstacle = CrappyBird.Obstacle = function (options) {
    this.color = randomColor();
    this.pipes = new CrappyBird.Images().pipes;
    this.top = this.pipes[0];
    this.bottom = this.pipes[1];
    this.pos = options.pos;
    this.height = options.height;
    this.width = options.width;
    this.gap = options.gap;
    this.openingTop = this.height;
    this.openingBottom = this.height + this.gap;
    this.speed = options.speed;
    this.game = options.game;
  };

  Obstacle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0] + 8, 0, this.width - 16, this.height - 56);
    ctx.fillRect(this.pos[0], this.height - 56, this.width, 56);
    ctx.drawImage(this.top,
                  0, CrappyBird.Game.DIM_Y - this.height,
                  this.width, this.height,
                  this.pos[0], 0,
                  this.width,
                  this.height);
    ctx.fillRect(this.pos[0], this.openingBottom, this.width, 56);
    ctx.fillRect(this.pos[0] + 8,
                 this.gap + this.height + 56,
                 this.width - 16,
                 CrappyBird.Game.DIM_Y - (this.height + this.gap + 56));
    ctx.drawImage(this.bottom,
                  0, 0, this.width, CrappyBird.Game.DIM_Y - (this.height + this.gap),
                  this.pos[0],
                  this.gap + this.height,
                  this.width,
                  CrappyBird.Game.DIM_Y - (this.height + this.gap));
  };

  Obstacle.prototype.move = function () {
    if (this.pos[0] + this.width < 0) {
      this.remove();
    }
    if (this.pos[0] >= 500 && this.pos[0] < 501) {
      this.game.addObstacle();
    }
    this.pos[0] += this.speed;
  };

  Obstacle.prototype.remove = function () {
    this.game.remove(this);
  };
})();
