(function() {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Birdy = CrappyBird.Birdy = function (options) {
    this.images = new CrappyBird.Images().birdies;
    this.flySound = new CrappyBird.Sounds().fly;
    this.pos = options.pos;
    this.game = options.game;
    this.height = 45;
    this.width = 50;
    this.vel = 0;
    this.acc = 0.9;
    this.died = false;
  };

  Birdy.prototype.dead = function () {
    if (this.pos[1] + this.height > this.game.dimY - 100) {
      this.vel = 0;
      // this.game.showLeaderBoard();
    } else {
      this.vel = 5;
    }
    this.pos[1] += this.vel;
    this.died = true;
  };

  Birdy.prototype.draw = function (ctx) {
    if (this.vel < 0) {
      this.image = this.images[0];
    } else {
      this.image = this.images[4];
    }
    if (this.died) {
      this.image = this.images[5];
    }
    ctx.drawImage(this.image, this.pos[0], this.pos[1], this.width, this.height);
  };

  Birdy.prototype.fly = function () {
    this.vel = -10;
    this.flySound.play();
  };

  Birdy.prototype.move = function () {
    this.pos[1] += this.vel;
    this.vel += this.acc;
  };
})();
