(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Sounds = CrappyBird.Sounds = function () {
    this.fly = new Audio("assets/sfx_wing.ogg");
    this.point = new Audio("assets/sfx_point.ogg");
    this.hit = new Audio("assets/sfx_hit.ogg");
    this.swooshing = new Audio("assets/sfx_swooshing.ogg");
    this.die = new Audio("assets/sfx_die.ogg");
    this.poo = new Audio("assets/fart.mp3");
  };
})();
