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
      if (this.started) {
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
    window.cancelAnimationFrame(this.landingId);
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
        window.cancelAnimationFrame(gameView.deadId);
        setTimeout(function() {
          gameView.showHighScores(game.score);
        }, 1000);
      } else {
        gameView.deadId = window.requestAnimationFrame(renderDead);
        gameView.ctx.clearRect(0, 0, gameView.ctx.canvas.width, gameView.ctx.canvas.height);
        game.step();
        game.draw();
        
        gameView.renderScore(game.score);
      }
    })();
  };

  GameView.prototype.showScoreForm = function () {
    var gameView = this;
    var numTableRows = document.getElementsByTagName('tr').length;
    $('#score-form-container').show();
    $('#input-score').val(gameView.game.score);
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
      gameView.landingId = window.requestAnimationFrame(renderLanding);
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

  GameView.prototype.showRestart = function () {
    $('.restart').show();
    var gameView = this;
    $('.restart').on('click', function () {
      $('#score-form').off();
      gameView.started = false;
      gameView.allowInput = true;
      window.cancelAnimationFrame(gameView.landingId);
      gameView.showLanding();
    });
  };

  GameView.prototype.start = function () {
    $('.landing').hide();

    var options = { ctx: this.ctx };

    this.game = new CrappyBird.Game(options, true);

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
