(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Images = CrappyBird.Images = function () {
    this.landing = new Image();
    this.landing.src = "assets/landing.png";
    this.sky = new Image();
    this.sky.src = "assets/sky.gif";
    this.birdy0 = new Image();
    this.birdy1 = new Image();
    this.birdy2 = new Image();
    this.birdy3 = new Image();
    this.birdy4 = new Image();
    this.birdy5 = new Image();
    this.birdy0.src = "assets/flappy-birdup1.png";
    this.birdy1.src = "assets/flappy-bird.png";
    this.birdy2.src = "assets/flappy-birddown1.png";
    this.birdy3.src = "assets/flappy-birddown2.png";
    this.birdy4.src = "assets/flappy-birddown3.png";
    this.birdy5.src = "assets/deadbirdy.png";
    this.birdies = [this.birdy0,
                    this.birdy1,
                    this.birdy2,
                    this.birdy3,
                    this.birdy4,
                    this.birdy5];
    this.ground = new Image();
    this.ground.src = "assets/ground.gif";
    this.pipeTop = new Image();
    this.pipeTop.src = "assets/pipetop.png";
    this.pipeBottom = new Image();
    this.pipeBottom.src = "assets/pipebottom.png";
    this.pipes = [this.pipeTop, this.pipeBottom];
    this.dudu = new Image();
    this.dudu.src = "assets/dudu.png";
  };
})();
