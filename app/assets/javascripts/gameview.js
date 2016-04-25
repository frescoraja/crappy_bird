(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var GameView = CrappyBird.GameView = function (ctx) {
    this.images = new CrappyBird.Images();
    this.sounds = new CrappyBird.Sounds();
    this.ctx = ctx;
    this.dimX = ctx.canvas.width;
    this.dimY = ctx.canvas.height;
    this.started = false;
    this.allowInput = true;
    this.showLanding();
    this.bindHandlers();
  };

  GameView.prototype.bindHandlers = function () {
    var gameView = this,
        $startBtn = $('.press-start'),
        $canvas = $('#game-canvas');

    key('space', function (event) {
      event.preventDefault();
      if (gameView.allowInput) {
        if (gameView.started) {
          gameView.birdy.fly();
        } else {
          window.cancelAnimationFrame(landingId);
          gameView.started = true;
          gameView.start();
        }
      }
    });

    $canvas.mousedown(function (event) {
      if (gameView.allowInput) {
        if (gameView.started) {
          gameView.birdy.fly();
        }
      }
    });

    $startBtn.click(function () {
      window.cancelAnimationFrame(landingId);
      gameView.started = true;
      gameView.start();
    });
  };

  GameView.prototype.handleGameOver = function (skyX, groundX, game) {
    var gameView = this;
    window.cancelAnimationFrame(gameId);
    this.allowInput = false;
    this.sounds.die.play();
    var sky = this.images.sky;
    var ground = this.images.ground;
    var groundHeight = this.dimY - 100;
    var birdy = this.birdy;
    birdy.image = birdy.images[5];
    (function renderDead () {
      if (birdy.vel === 0) {
        gameView.sounds.hit.play();
        window.cancelAnimationFrame(deadId);
        setTimeout(function () {
          gameView.showHighScores(game.score);
        }, 500);
      } else {
        deadId = window.requestAnimationFrame(renderDead);
        gameView.ctx.clearRect(0, 0, gameView.dimX, gameView.dimY);
        gameView.ctx.drawImage(sky, skyX, 0, 966, gameView.dimY);
        gameView.ctx.drawImage(sky, 966-Math.abs(skyX), 0, 966, gameView.dimY);
        gameView.ctx.drawImage(ground, groundX, groundHeight);
        gameView.ctx.drawImage(ground, gameView.dimX - Math.abs(groundX), groundHeight);
        birdy.move();
        game.draw(gameView.ctx);
        gameView.ctx.font = '28px "Press Start 2P"';
        gameView.ctx.fillStyle = "white";
        gameView.ctx.textAlign = "center";
        gameView.ctx.lineWidth = 2;
        gameView.ctx.strokeStyle = "#3e2500";
        gameView.ctx.fillText(game.score, gameView.dimX/2, 60);
        gameView.ctx.strokeText(game.score, gameView.dimX/2, 60);
      }
    })();
  };

  GameView.prototype.showScoreForm = function (score) {
    var gameView = this;
    var numTableRows = document.getElementsByTagName('tr').length;
    $('#score-form-container').show();
    $('#input-score').val(score);
    $('#score-form').submit(function (e) {
      e.preventDefault();
      var newScoreData = $('#score-form').serializeJSON();
      $('#input-name').prop('disabled', true);
      $.ajax({
        type: 'POST',
        url: '/high_scores',
        dataType: 'json',
        data: newScoreData,
        success: function (res) {
          $('.errors').empty();
          $('#input-name').val('');
          $('#input-score').val('');
          $('#score-form-container').hide();
          var name = res.name;
          var score = res.score;

          var $newTableData = $('<tr><td>' + name + '</td><td>' + score + '</td></tr>');
          if (numTableRows >= 10) {
            $('tr').last().remove();
          }
          $('.scoreboard').append($newTableData);
          gameView.showRestart();
        },
        error: function (res) {
          var msg = res.responseText;
          $('.errors').text(msg);
          $("#input-name").prop("disabled", false);
        }
      });
    });
  };

  GameView.prototype.showRestart = function () {
    $('.restart').show();
    var gameView = this;
    $('.restart').on('click', function () {
      $('#score-form').off();
      gameView.started = false;
      gameView.allowInput = true;
      landingId = window.cancelAnimationFrame(landingId);
      gameView.showLanding();
    });
  };

  GameView.prototype.showHighScores = function (score) {
    var gameView = this;
    $('#scoreboard-container').show();
    $('#score').text(score);
    $('.scoreboard').html('<th colspan="2">High Scores</th>');
    $.ajax({
      url: '/high_scores',
      success: function (res) {
        if (res.length === 0) {
          if (score > 0) {
            gameView.showScoreForm(score);
            $("#input-name").prop("disabled", false);
          } else {
            gameView.showRestart();
          }
        } else {
          res.forEach(function (highScore) {
            var name = highScore.name;
            var score = highScore.score;
            var $tableRow = $('<tr>').append($('<td>').text(name));
            $tableRow.append($('<td>').text(score));
            $('.scoreboard').append($tableRow);
          });
          var lowScore = parseInt(res.reverse()[0].score);
          if (score >= lowScore || (res.length < 10 && score > 0)) {
            gameView.showScoreForm(score);
          } else {
            gameView.showRestart();
          }
        }
      }
     });
  };

  GameView.prototype.showLanding = function () {
    $('#scoreboard-container').hide();
    $('.restart').hide();
    $('.landing').show();
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
    this.started = false;
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
    $('.landing').hide();
    var groundX = 0;
    var skyX = 0;
    var gameView = this;
    var ctx = this.ctx;
    var sky = this.images.sky;
    var game = new CrappyBird.Game(ctx);
    this.birdy = game.birdy;
    var ground = this.images.ground;
    var groundHeight = this.dimY - 100;
    (function renderGame() {
      if (game.over) {
        gameView.handleGameOver(skyX, groundX, game);
      } else {
        gameId = window.requestAnimationFrame(renderGame);
        ctx.clearRect(0,0, gameView.dimX, gameView.dimY);

        ctx.drawImage(sky, skyX, 0, 966, gameView.dimY);
        ctx.drawImage(sky, 966-Math.abs(skyX), 0, 966, gameView.dimY);
        ctx.drawImage(ground, groundX, groundHeight);
        ctx.drawImage(ground, gameView.dimX - Math.abs(groundX), groundHeight);
        game.step();
        game.draw(ctx);

        ctx.font = '28px "Press Start 2P"';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#3e2500";
        ctx.fillText(game.score, gameView.dimX/2, 60);
        ctx.strokeText(game.score, gameView.dimX/2, 60);

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
