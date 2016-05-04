(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var GameView = CrappyBird.GameView = function (ctx) {
    this.ctx = ctx;
    this.started = false;
    this.showLanding();
    this.bindHandlers();
  };

  GameView.prototype.bindHandlers = function () {
    var $startBtn = $('.press-start'),
        $canvas = $('#game-canvas'),
        gameView = this;
    key('space', function(event) {
      event.preventDefault();
      gameView.flyBirdOrStart();  
    });

    key('f', function(event) {
      event.preventDefault();
      gameView.dropBomb();
    });

    $canvas.click(function(event) {
      event.preventDefault();
      gameView.flyBirdOrStart();
    });

    $startBtn.click(function(event) {
      gameView.startGame(); 
    });
  };

  GameView.prototype.flyBirdOrStart = function() {
    if (this.allowInput) {
      if (this.game.over) {
        $('.restart').click();
      } else if (this.started) {
        this.game.flyBird();
      } else {
        this.startGame();
      }
    } 
  };

  GameView.prototype.dropBomb = function() {
    if (!this.allowInput) return;
    this.game.addDudu();
  };

  GameView.prototype.startGame = function() {
    window.cancelAnimationFrame(window.animateId);
    $('.landing').hide();
    this.started = true;
    this.start();
  };

  GameView.prototype.handleGameOver = function () {
    this.allowInput = false;
    var gameView = this,
        game = this.game,
        birdy = this.game.birdy;
    game.drawGameOver();
    (function renderDead () {
      if (birdy.hitGround(game.ground.height)) {
        window.cancelAnimationFrame(window.animateId);
        setTimeout(function() {
          gameView.showHighScores(game.score);
        }, 1000);
      } else {
        window.animateId = window.requestAnimationFrame(renderDead);
        gameView.ctx.clearRect(0, 0, gameView.ctx.canvas.width, gameView.ctx.canvas.height);
        game.step();
        game.draw();
        
        gameView.renderScore(game.score);
      }
    })();
  };

  GameView.prototype.showHighScores = function (score) {
    var gameView = this,
        $scoreBoard     = $('.scoreboard'),
        $scoreBoardCtnr = $('#scoreboard-container'),
        $score          = $('#score'),
        $nameInput      = $('#input-name');

    $score.text(score);
    $scoreBoardCtnr.show();
    $scoreBoard.html('<th colspan="2">High Scores</th>');

    $.ajax({
      url: '/high_scores',
      success: function (res) {
        if (res.length === 0) {
          if (score > 0) {
            gameView.showScoreForm(score);
          } else {
            gameView.showRestart();
          }
        } else {
          res.forEach(function (highScore) {
            var $tableRow = $('<tr>').append($('<td>').text(highScore.name));
            $tableRow.append($('<td>').text(highScore.score));
            $scoreBoard.append($tableRow);
          });
          var lowScore = parseInt(res[res.length - 1].score);
          if (score >= lowScore || (res.length < 10 && score > 0)) {
            gameView.showScoreForm(score);
          } else {
            gameView.showRestart();
          }
        }
      }
     });
  };

  GameView.prototype.showScoreForm = function () {
    var gameView       = this,
        numTableRows   = document.getElementsByTagName('tr').length,
        $scoreFormCtnr = $('#score-form-container'),
        $scoreInput    = $('#input-score'),
        $scoreForm     = $('#score-form'),
        $nameInput     = $('#input-name'),
        $errors        = $('.errors'),
        $scoreBoard    = $('.scoreboard');

    $scoreFormCtnr.show();
    $scoreInput.val(gameView.game.score);
    $nameInput.prop("disabled", false).focus();

    $scoreForm.submit(function (e) {
      e.preventDefault();
      var newScoreData = $scoreForm.serializeJSON();
      $nameInput.prop('disabled', true);

      $.ajax({
        type: 'POST',
        url: '/high_scores',
        dataType: 'json',
        data: newScoreData,
        success: function (res) {
          $errors.empty();
          $nameInput.val('');
          $scoreInput.val('');
          $scoreFormCtnr.hide();
          var $newTableData = $('<tr><td>' + res.name + '</td><td>' + res.score + '</td></tr>');
          if (numTableRows >= 10) {
            $('tr').last().remove();
          }
          $('tr').each(function(i, row) {
            var rowScore = Number($(row).text().slice(-4));
            if (rowScore < res.score) {
              $(row).before($newTableData);
              $newTableData = "";
            }
          });
          if ($newTableData) $scoreBoard.append($newTableData);
          gameView.showRestart();
        },
        error: function (res) {
          $errors.text(res.responseText);
          $nameInput.prop("disabled", false);
          $nameInput.focus();
        }
      });
    });
  };

  GameView.prototype.showRestart = function () {
    var gameView        = this,
        $restartBtn     = $('.restart'),
        $scoreForm      = $('#score-form'),
        $scoreBoardCtnr = $('#scoreboard-container');

    gameView.allowInput = true;
    $restartBtn.show();
    $restartBtn.on('click', function () {
      $scoreForm.off();
      $scoreBoardCtnr.hide();
      $restartBtn.hide();
      gameView.showLanding();
    });
  };

  GameView.prototype.showLanding = function () {
    this.allowInput = true;
    $('.landing').show();
    window.cancelAnimationFrame(window.animateId);
    var birdyOptions = {
      vel: [0, -0.5],
      acc: [0, 0],
      imageIndices: [0, 3, 5],
    };
    var skyOptions = {
      vel: [-0.5, 0],
    };
    var groundOptions = {
      vel: [-1, 0],
    };
    var gameView = this,
        ctx = this.ctx,
        options = {
          ctx: ctx,
          birdyOpts: birdyOptions,
          groundOpts: groundOptions,
          skyOpts: skyOptions
        };
    this.game = new CrappyBird.Game(options, false);
    var birdy = this.game.birdy;
    var game = this.game;
    this.started = false;
    (function renderLanding () {
      window.animateId = window.requestAnimationFrame(renderLanding);
      if (birdy.pos[1] < Math.floor((ctx.canvas.height / 3) - (birdy.height / 2))) {
        if (birdy.vel[1] < 0 ) {
          game.addDudu();
        }
        birdy.vel = [0, 2];
      } else if (birdy.pos[1] > Math.floor((ctx.canvas.height / 3) - (birdy.height / 2) + 200)) {
        birdy.vel = [0, -2];
      }

      ctx.clearRect(0, 0, ctx.width, ctx.height);
      game.draw();
      game.step();
    })();
  };

  GameView.prototype.renderScore = function () {
    var dimX = this.ctx.canvas.width / 2;
    this.ctx.fillText(this.game.score, dimX, 60);
    this.ctx.strokeText(this.game.score, dimX, 60);
  };


  GameView.prototype.start = function () {
    var options = { ctx: this.ctx };

    this.game = new CrappyBird.Game(options, true);

    var gameView = this,
        ctx = this.ctx,
        game = this.game;

    (function renderGame() {
      window.animateId = window.requestAnimationFrame(renderGame);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      game.step().draw();
      gameView.renderScore();

      if (game.over) {
        window.cancelAnimationFrame(window.animateId); 
        gameView.handleGameOver();
      } 
    })();
  };
})();
