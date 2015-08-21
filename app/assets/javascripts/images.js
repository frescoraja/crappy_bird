(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Images = CrappyBird.Images = function () {
    this.landing = new Image();
    this.landing.src = "landing.png";
    this.sky = new Image();
    this.sky.src = "sky.png";
    this.birdy0 = new Image();
    this.birdy1 = new Image();
    this.birdy2 = new Image();
    this.birdy3 = new Image();
    this.birdy4 = new Image();
    this.birdy5 = new Image();
    this.birdy0.src = "flappy-birdup1.png";
    this.birdy1.src = "flappy-bird.png";
    this.birdy2.src = "flappy-birddown1.png";
    this.birdy3.src = "flappy-birddown2.png";
    this.birdy4.src = "flappy-birddown3.png";
    this.birdy5.src = "deadbirdy.png";
    this.birdies = [this.birdy0,
                    this.birdy1,
                    this.birdy2,
                    this.birdy3,
                    this.birdy4,
                    this.birdy5];
    this.ground = new Image();
    this.ground.src = "assets/ground.png";
    this.pipeTop = new Image();
    this.pipeTop.src = "assets/pipetop.png";
    this.pipeBottom = new Image();
    this.pipeBottom.src = "assets/pipebottom.png";
    this.pipes = [this.pipeTop, this.pipeBottom];
    this.dudu = new Image();
    this.dudu.src = "assets/dudu.png";
  };
})();
