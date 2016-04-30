(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }
  
  var Dudu = CrappyBird.Dudu = function(options) {
    this.birdy =  options.birdy;
    CrappyBird.MovingObject.call(this, options);
  };

  CrappyBird.Utils.inherits(Dudu, CrappyBird.MovingObject);
  
  Dudu.prototype.hitGround = function(groundHeight) {
    return (this.pos[1] + this.height >= this.ctx.canvas.height - groundHeight);
  };

  Dudu.prototype.hitPipes = function(pipes) {
    for (var i = 0; i < pipes.length; i++) {
      if ((this.pos[0] > pipes[i].pos[0] && 
            this.pos[0] + this.width < pipes[i].pos[0] + pipes[i].width) &&
          (this.pos[1] + this.height > pipes[i].bottomOpening)) {
        return true;
      }
    }
    return false;
  };
})();
