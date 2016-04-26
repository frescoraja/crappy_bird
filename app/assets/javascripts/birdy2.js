(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy2 = CrappyBird.Birdy2 = function(options) {
    CrappyBird.MovingObject.call(this, options);
    this.fly_vel = options.fly_vel;
    this.images = new CrappyBird.Images().birdies;
    this.dead = false;
  };
  
  CrappyBird.Utils.inherits(Birdy2, CrappyBird.MovingObject);

  Birdy2.prototype.fly = function() {
    this.vel[1] = this.fly_vel;
  };
  
  Birdy2.prototype.falling = function() {
    return (this.vel[1] > 0);
  };

  Birdy2.prototype.draw = function () {
    if (this.falling()) {
      this.image = this.images[4];
    } else if (this.dead) {
      this.image = this.images[5];
    } else {
      this.image = this.images[0];
    }

    CrappyBird.MovingObject.prototype.draw.call(this);
  };
})();
