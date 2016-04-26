(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy = CrappyBird.Birdy = function(options) {
    CrappyBird.MovingObject.call(this, options);
    this.fly_vel = options.fly_vel;
    this.images = new CrappyBird.Images().birdies;
    this.dead = false;
  };
  
  CrappyBird.Utils.inherits(Birdy, CrappyBird.MovingObject);

  Birdy.prototype.fly = function() {
    this.vel[1] = this.fly_vel;
  };
  
  Birdy.prototype.falling = function() {
    return (this.vel[1] > 0);
  };

  Birdy.prototype.draw = function () {
    if (this.dead) {
      this.image = this.images[5];
    } else if (this.falling()) {
      this.image = this.images[4];
    } else {
      this.image = this.images[0];
    }

    CrappyBird.MovingObject.prototype.draw.call(this);
  };
})();
