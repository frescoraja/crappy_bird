(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var GameView = CrappyBird.GameView = function (game, ctx) {
    this.images = new CrappyBird.Images();
    this.sounds = new CrappyBird.Sounds();
    this.game = game;
    this.ctx = ctx;
    this.dimX = ctx.canvas.width;
    this.dimY = ctx.canvas.height;
    this.allowInput = false;
    this.cancelKeys = false;
    this.showLanding();

    this.bindKeyHandlers();
  };

  GameView.prototype.bindKeyHandlers = function () {
    var birdy = this.game.birdy;
    var gameView = this;
    if (!this.cancelKeys) {
      key('space', function () {
        if (gameView.allowInput) {
          birdy.fly();
        } else {
          window.cancelAnimationFrame(landingId);
          $('.landing').hide();
          gameView.allowInput = true;
          gameView.start();
        }
      });
    }
  };

  GameView.prototype.handleGameOver = function (skyX, groundX) {
    this.allowInput = false;
    this.cancelKeys = true;
    this.sounds.die.play();
    var sky = this.images.sky;
    var ground = this.images.ground;
    var gameView = this;
    var groundHeight = this.dimY - 100;
    (function renderDead () {
      deadId = window.requestAnimationFrame(renderDead);

      gameView.ctx.clearRect(0, 0, gameView.dimX, gameView.dimY);
      gameView.ctx.drawImage(sky, skyX, 0, 966, gameView.dimY);
      gameView.ctx.drawImage(sky, 966-Math.abs(skyX), 0, 966, gameView.dimY);
      gameView.ctx.drawImage(ground, groundX, groundHeight);
      gameView.ctx.drawImage(ground, gameView.dimX - Math.abs(groundX), groundHeight);
      gameView.game.step();
      gameView.game.draw(gameView.ctx);
    })();

      gameView.sounds.hit.play();
  };

  GameView.prototype.showLanding = function () {
    var birdy = { img: this.images.birdies,
                  posX: 175,
                  posY: 215,
                  vel: 1};
    var dudu = { img: this.images.dudu,
                 posX: 165,
                 posY: 230,
                 vel: 2,
                 poo: this.sounds.poo
               };
    var view = this;
    var sky = this.images.sky;
    var ground = this.images.ground;
    var birdyImg = birdy.img[3];
    (function renderLanding () {
      landingId = window.requestAnimationFrame(renderLanding);
      view.ctx.clearRect(0, 0, view.dimX, view.dimY);
      view.ctx.drawImage(sky, 0, 0, 966, view.dimY);
      view.ctx.drawImage(ground, 0, view.dimY - 100);
      view.ctx.drawImage(birdyImg, birdy.posX, birdy.posY, 50, 45);
      view.ctx.drawImage(dudu.img, dudu.posX, dudu.posY, 15, 15);

      if (dudu.posY === birdy.posY + 15) {
        dudu.poo.play();
      }

      birdy.posY += birdy.vel;
      dudu.vel += 0.2;
      dudu.posY += dudu.vel;

      if (birdy.posY >= 300) {
        birdy.vel = -1;
        birdyImg = birdy.img[0];
      } else if (birdy.posY <= 215) {
        birdy.vel = 1;
        birdyImg = birdy.img[3];
        dudu.vel = 2;
        dudu.posY = birdy.posY + 15;
        dudu.poo.play();
      }
    })();
  };

  GameView.prototype.start = function () {
    var groundX = 0;
    var skyX = 0;
    var gameView = this;
    var ctx = this.ctx;
    var sky = this.images.sky;
    var ground = this.images.ground;
    var groundHeight = this.dimY - 100;
    (function renderGame() {
      if (gameView.game.gameOver) {
        window.cancelAnimationFrame(gameId);
        gameView.handleGameOver(skyX, groundX);
      } else {
        gameId = window.requestAnimationFrame(renderGame);
        ctx.clearRect(0,0, gameView.dimX, gameView.dimY);

        ctx.drawImage(sky, skyX, 0, 966, gameView.dimY);
        ctx.drawImage(sky, 966-Math.abs(skyX), 0, 966, gameView.dimY);
        ctx.drawImage(ground, groundX, groundHeight);
        ctx.drawImage(ground, gameView.dimX - Math.abs(groundX), groundHeight);
        gameView.game.step();
        gameView.game.draw(ctx);

        ctx.font = '28px "Press Start 2P"';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#3e2500";
        ctx.fillText(gameView.game.score, gameView.dimX/2, 60);
        ctx.strokeText(gameView.game.score, gameView.dimX/2, 60);

        if (Math.abs(skyX) > 966) {
          skyX = 0;
        }
        if (Math.abs(groundX) > ground.width) {
          groundX = 0;
        }
        groundX -= 3;
        skyX -= 0.75;
      }
    })();
  };
})();
