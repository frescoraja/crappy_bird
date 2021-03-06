(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var MovingObject = CrappyBird.MovingObject = function(options) {
    this.image = options.image || [];
    this.images = options.images || [];
    this.width = options.width || this.image.width;
    this.height = options.height || this.image.height;
    this.pos = options.pos || [0, 0];
    this.vel = options.vel || [0, 0];
    this.acc = options.acc || [0, 0];
    this.ctx = options.ctx;
  };
  
  MovingObject.prototype.move = function() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.vel[0] += this.acc[0];
    this.vel[1] += this.acc[1];
  };

  MovingObject.prototype.draw = function() {
    this.ctx.drawImage(
        this.image, 
        this.pos[0],
        this.pos[1],
        this.width,
        this.height);
  };

  MovingObject.prototype.onScreen = function(){
    return (this.pos[0] > 0 && 
            this.pos[0] + this.width < this.ctx.canvas.width && 
            this.pos[1] + this.height > 0 && 
            this.pos[1] < this.ctx.canvas.height);
  };
})();
