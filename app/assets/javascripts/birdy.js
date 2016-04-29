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
  
  Birdy.prototype.collisionDetect = function(obstacle, side) {
    var offset = side === 'left' ? 0 : obstacle.width;
    var topCorner = [obstacle.pos[0] + offset, obstacle.topOpening],
        bottomCorner = [obstacle.pos[0] + offset, obstacle.bottomOpening], 
        birdCtr = this.centerPt(),
    
        difX = Math.abs(birdCtr[0] - topCorner[0]),
        difYTop = Math.abs(birdCtr[1] - topCorner[1]),
        difYBtm = Math.abs(birdCtr[1] - bottomCorner[1]),

        distToTop = Math.sqrt(Math.pow(difX, 2) + Math.pow(difYTop, 2)),
        distToBtm = Math.sqrt(Math.pow(difX, 2) + Math.pow(difYBtm, 2));

    return (distToTop < (this.width / 2) || distToBtm < (this.width / 2));       
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
