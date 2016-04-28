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
  };
  
  CrappyBird.Utils.inherits(Birdy, CrappyBird.MovingObject);

  Birdy.prototype.fly = function() {
    this.vel[1] = this.fly_vel;
  };
  
  Birdy.prototype.falling = function() {
    return (this.vel[1] > 0);
  };
  
  Birdy.prototype.hitGround = function(groundHeight) {
    return this.pos[1] + this.height >= (this.ctx.canvas.height - groundHeight);
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
