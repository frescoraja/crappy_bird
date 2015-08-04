(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy = CrappyBird.Birdy = function (options) {
    this.images = new CrappyBird.Images().birdies;
    this.pos = options.pos;
    this.game = options.game;
    this.height = 50;
    this.width = 60;
    this.vel = 0;
    this.acc = 1;
    this.flySound = new CrappyBird.Sounds().fly;
  };

  Birdy.prototype.draw = function (ctx) {
    if (this.vel < 0) {
      this.image = this.images[0];
    } else {
      this.image = this.images[4];
    }
    ctx.drawImage(this.image, this.pos[0], this.pos[1], this.width, this.height);
  };

  Birdy.prototype.fly = function () {
    this.vel = -14;
    this.flySound.play();
  };

  Birdy.prototype.move = function () {
    this.pos[1] += this.vel;
    this.vel += this.acc;
  };
})();
