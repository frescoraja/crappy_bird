(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy2 = CrappyBird.Birdy2 = function(options) {
    CrappyBird.MovingObject.call(this, options);
    this.images = new CrappyBird.Images().birdies;
  }
  
  CrappyBird.Utils.inherits(Birdy2, CrappyBird.MovingObject);

  Birdy2.prototype.fly = function() {
    this.vel[1] = -10;
  }
  
  Birdy2.prototype.falling = function() {
    return (this.vel[1] > 0);
  }

  Birdy2.prototype.draw = function () {
    if (this.falling()) {
      this.image = this.images[4];
    } else if (this.dead) {
      this.image = this.images[5];
    } else {
      this.image = this.images[0];
    }

    CrappyBird.MovingObject.prototype.draw.call(this);
  }
})();
