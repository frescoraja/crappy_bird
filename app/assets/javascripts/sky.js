(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Sky = CrappyBird.Sky = function(options) {
    CrappyBird.MovingObject.call(this, options);
  };

  CrappyBird.Utils.inherits(Sky, CrappyBird.MovingObject);

  Sky.prototype.draw = function() {
    var posX = this.image.width - Math.abs(this.pos[0]);
    if (Math.abs(this.pos[0]) >= this.image.width) {
      this.pos[0] = 0;
    }

    this.ctx.drawImage(this.image, this.pos[0], this.pos[1]);
    this.ctx.drawImage(this.image, posX, this.pos[1]);
  };
})();
