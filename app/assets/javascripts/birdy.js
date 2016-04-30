(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy = CrappyBird.Birdy = function(options) {
    CrappyBird.MovingObject.call(this, options);
    this.fly_vel = options.fly_vel;
    this.images = options.images;
    this.imageIndices = options.imageIndices;
    this.setBirdyImages();
    this.dead = false;
    this._FF = options.ff;
  };
  
  CrappyBird.Utils.inherits(Birdy, CrappyBird.MovingObject);

  Birdy.prototype.centerPt = function() {
    var centerX = Math.floor(this.pos[0] + (this.width / 2)),
        centerY = Math.floor(this.pos[1] + (this.height / 2));

    return [centerX, centerY];
  };

  Birdy.prototype.fly = function() {
    this.vel[1] = this.fly_vel;
  };
  
  Birdy.prototype.falling = function() {
    return (this.vel[1] > 0);
  };
  
  Birdy.prototype.hitGround = function(groundHeight) {
    return this.pos[1] + this.height >= (this.ctx.canvas.height - groundHeight);
  };

  Birdy.prototype.intersects = function(obstacle) {
    var center = this.centerPt(),
        closestX = (center[0] < obstacle.pos[0] ? obstacle.pos[0] : (center[0] > obstacle.pos[0] + obstacle.width ? obstacle.pos[0] + obstacle.width : center[0])),
        closestYtop = (center[1] < obstacle.pos[1] ? obstacle.pos[1] : (center[1] > obstacle.topOpening ? obstacle.topOpening : center[1])),
        closestYbtm = (center[1] < obstacle.bottomOpening ? obstacle.bottomOpening : (center[1] > obstacle.bottomOpening + obstacle.bottomHeight ? obstacle.bottomOpening + obstacle.bottomHeight : center[1])),
        dx = closestX - center[0],
        dyt = closestYtop - center[1];
        dyb = closestYbtm - center[1];

    return (( dx * dx + dyt * dyt ) < (Math.pow(this.width / 2, 2) - this._FF) || 
            (dx * dx + dyb * dyb ) < (Math.pow(this.width / 2, 2)) - this._FF);
  };

  Birdy.prototype.draw = function () {
    if (this.dead) {
      this.image = this.deadImg;
    } else if (this.falling()) {
      this.image = this.fallingImg;
    } else {
      this.image = this.flyingImg;
    }

    CrappyBird.MovingObject.prototype.draw.call(this);
  };

  Birdy.prototype.setBirdyImages = function() {
    this.deadImg = this.images[this.imageIndices[2]];
    this.fallingImg = this.images[this.imageIndices[1]];
    this.flyingImg = this.images[this.imageIndices[0]];
  };
})();
