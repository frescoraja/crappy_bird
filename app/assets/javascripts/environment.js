(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Environment = CrappyBird.Environment = function(options) {
    CrappyBird.MovingObject.call(this, options);
  };
  
  CrappyBird.Utils.inherits(Environment, CrappyBird.MovingObject);

  Environment.prototype.draw = function() {
    this.ctx.drawImage(this.image, this.pos[0], this.image.height);
    this.ctx.drawImage(this.image, this.ctx.width - Math.abs(this.pos[0]), this.image.height);
  };
})();
