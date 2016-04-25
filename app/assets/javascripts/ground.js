(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Ground = CrappyBird.Ground = function(options) {
    CrappyBird.MovingObject.call(this, options);  
  };

  CrappyBird.Utils.inherits(Ground, CrappyBird.MovingObject);

  Ground.prototype.draw = function() {
    var posY = this.ctx.canvas.height - this.image.height,
        posX = this.ctx.canvas.width - Math.abs(this.pos[0]);
    if (Math.abs(this.pos[0]) >= this.image.width) {
      this.pos[0] = 0;
    }
    this.ctx.drawImage(this.image, this.pos[0], posY);
    this.ctx.drawImage(this.image, posX, posY);
  };
})();



        //ctx.drawImage(ground, groundX, groundHeight);
        //ctx.drawImage(ground, gameView.dimX - Math.abs(groundX), groundHeight);
        //
        //if (Math.abs(skyX) > 966) {
          //skyX = 0;
        //}
        //if (Math.abs(groundX) > ground.width) {
          //groundX = 0;
        //}
        //groundX -= 3;
        //skyX -= 0.75;
