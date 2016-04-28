(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var GameView = CrappyBird.GameView = function (ctx) {
    this.ctx = ctx;
    this.started = false;
    this.allowInput = true;
    this.showLanding();
    this.bindHandlers();
  };

  GameView.prototype.bindHandlers = function () {
    var $startBtn = $('.press-start'),
        $canvas = $('#game-canvas');

    key('space', this.flyBirdOrStart.bind(this));

    $canvas.click(this.flyBirdOrStart.bind(this));

    $startBtn.click(this.startGame.bind(this));
  };

  GameView.prototype.flyBirdOrStart = function() {
    if (this.allowInput) {
      if (this.started) {
        this.game.flyBird();
      } else {
        this.startGame();
      }
    }
  };

  GameView.prototype.startGame = function() {
    window.cancelAnimationFrame(this.landingId);
    this.started = true;
    this.start();
  };

  GameView.prototype.handleGameOver = function () {
    this.allowInput = false;
    this.sounds.die.play();
    var gameView = this,
        game = this.game,
        birdy = this.game.birdy;
    bird.vel = [0,.3];
    (function renderDead () {
      if (birdy.hitGround(game.ground.height)) {
        game.sounds.hit.play();
        window.cancelAnimationFrame(gameView.deadId);
        setTimeout(gameView.showHighScores.bind(this), 750);
      } else {
        gameView.deadId = window.requestAnimationFrame(renderDead);
        game.draw();
        gameView.renderScore(game.score);
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
      gameView.landingId = window.cancelAnimationFrame(gameView.landingId);
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
    var dudu = { img: this.images.dudu,
                 posX: 165,
                 posY: 230,
                 vel: 2,
                 poo: this.sounds.poo
               };
    var options = {
      birdyVel: [0, 1],
      skyVel: [-0.5, 0],
      groundVel: [-1, 0],
      dudu: dudu,
      ctx: this.ctx
    };
    var view = this;
    var ctx = this.ctx;
    var ground = this.images.ground;
    var birdyImg = birdy.img[3];
    this.game = new CrappyBird.game(options);
    this.started = false;
    (function renderLanding () {
      view.landingId = window.requestAnimationFrame(renderLanding);
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      ctx.drawImage(birdyImg, birdy.posX, birdy.posY, 50, 45);
      ctx.drawImage(dudu.img, dudu.posX, dudu.posY, 15, 15);

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

  GameView.prototype.renderScore = function () {
    this.ctx.fillText(this.game.score, this.dimX/2, 60);
    this.ctx.strokeText(this.game.score, this.dimX/2, 60);
  };

  GameView.prototype.start = function () {
    $('.landing').hide();
    options = { ctx: this.ctx };
    this.game = new CrappyBird.Game(options);
    var gameView = this,
        ctx = this.ctx,
        game = this.game;

    (function renderGame() {
      gameView.gameId = window.requestAnimationFrame(renderGame);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      game.step().draw();
      gameView.renderScore();

      if (game.over) {
        window.cancelAnimationFrame(gameView.gameId); 
        gameView.handleGameOver();
      } 
    })();
  };
})();
