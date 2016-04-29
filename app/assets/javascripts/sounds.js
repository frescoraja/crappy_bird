(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Sounds = CrappyBird.Sounds = function () {
    this.fly = new Audio("assets/sfx_wing.mov");
    this.point = new Audio("assets/sfx_point.mov");
    this.hit = new Audio("assets/sfx_hit.mov");
    this.swooshing = new Audio("assets/sfx_swooshing.mov");
    this.die = new Audio("assets/sfx_die.mov");
    this.poo = new Audio("assets/fart.mov");
  };
})();
