(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }
  
  var Dudu = CrappyBird.Dudu = function(options) {
    this.birdy =  options.birdy;
    CrappyBird.MovingObject.call(this, options);
  };

  CrappyBird.Utils.inherits(Dudu, CrappyBird.MovingObject);

  Dudu.prototype.onScreen = function() { 
    return this.pos[1] < this.ctx.canvas.height;
  };
})();
