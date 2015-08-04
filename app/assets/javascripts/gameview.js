(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var GameView = CrappyBird.GameView = function (game, ctx) {
    this.images = new CrappyBird.Images();
    this.game = game;
    this.ctx = ctx;
    this.dimX = ctx.width;
    this.dimY = ctx.height;
    this.birdy = this.game.addBirdy();
    this.game.addObstacle();
    this.timerId = null;
    this.isPaused = false;
    this.landing = this.images.landing;
    this.bg = this.images.bg;
    this.showLanding(true);
    this.bindKeyHandlers();
    this.bindEventHandlers();
  };

  GameView.prototype.bindKeyHandlers = function () {
    var birdy = this.birdy;
    var gameView = this;
    key('space', function () {
      $('.landing').hide();
      this.showLanding(false);
      gameView.start();
    });
    key('up', function () {
      birdy.fly();
    });
  };

  GameView.prototype.bindEventHandlers = function () {
    $('.press-start').click(this.start.bind(this));
  };

  GameView.prototype.showLanding = function (state) {
    var posY = 250;
    var dPosY = 265;
    var vel = 1;
    var view = this;
    var img = this.birdy.images[4];
    var dudu = new CrappyBird.Images().dudu;
    var poo = new CrappyBird.Sounds().poo;
    var duduVel = 3;
    (function renderLanding (state) {
      window.requestAnimationFrame(renderLanding);
      view.ctx.clearRect(0, 0, 432, 644);
      view.ctx.drawImage(view.bg, 0, 0, 966, 644);
      posY += vel;
      dPosY += duduVel;
      view.ctx.drawImage(img, 175 , posY, 45, 45);
      view.ctx.drawImage(dudu, 165 , dPosY, 15, 15);
      if (posY >= 300) {
        vel = -1;
        img = view.birdy.images[0];
      } else if (posY <= 215) {
        vel = 1;
        img = view.birdy.images[3];
      }
      if (dPosY >= 630) {
        dPosY = posY + 15;
      }
    })();
  };

  GameView.prototype.start = function () {
    var vx = 0;
    var gameView = this;
    var img = this.bg;
    (function renderGame() {
      window.requestAnimationFrame(renderGame);
      gameView.ctx.clearRect(0,0, 432, 644);

      gameView.ctx.drawImage(img, vx, 0);
      gameView.ctx.drawImage(img, img.width-Math.abs(vx), 0);
      if (Math.abs(vx) > img.width) {
        vx = 0;
      }
      vx -= 2;
    })();
  };


  // GameView.prototype.start = function (start) {
  //   this.bindKeyHandlers();

    //   (function renderGame() {
    //   window.requestAnimationFrame(renderGame);
    //   gameView.ctx.clearRect(0,0, gameView.game.DIM_X, gameView.game.DIM_Y);
    //
    //   gameView.ctx.drawImage(img, vx, 0);
    //   gameView.ctx.drawImage(img, img.width-Math.abs(vx), 0);
    //   if (Math.abs(vx) > img.width) {
    //     vx = 0;
    //   }
    //   vx -= 2;
    // })();

  // };
})();
