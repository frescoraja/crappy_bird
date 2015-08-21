(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Sounds = CrappyBird.Sounds = function () {
    this.fly = new Audio("assets/sfx_wing.mp3");
    this.point = new Audio("assets/sfx_point.mp3");
    this.hit = new Audio("assets/sfx_hit.mp3");
    this.swooshing = new Audio("assets/sfx_swooshing.mp3");
    this.die = new Audio("assets/sfx_die.mp3");
    this.poo = new Audio("assets/fart.mp3");
  };
})();
