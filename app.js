var game = {
  human: '',
  computer: '',
  board: [0,1,2,3,4,5,6,7,8],
  setPlayer: function(symbol) {
    this.human = symbol;
    if ( symbol === 'X' ) {
      this.computer = 'O';
    } else {
      this.computer = 'X';
    }
  },
  drawBoard: function() {
    var $board = $("#board");
    var row1 = "<tr>", row2 = "<tr>", row3 = "<tr>";

    $board.empty();

    this.board.forEach(function(v, i) {
      if (typeof v === 'number' ) { v = '' }

      if ( i < 3 ) {
        row1 += "<td id=sqr_" + i + ">" + v + "</td>"
      } else if ( i < 6 ) {
        row2 += "<td id=sqr_" + i + ">" + v + "</td>"
      } else {
        row3 += "<td id=sqr_" + i + ">" + v + "</td>"
      }
    });

    $board.append(row1 + "</tr>" + row2 + "</tr>" + row3 + "</tr>");
  },
  computerTurn: function() {
    var sqr = AI.minimax(this.board, this.computer).index;
    this.board[sqr] = this.computer;
    this.drawBoard();

    if ( AI.winning(game.board, game.computer) || AI.open(game.board).length == 0) {
      _.delay(game.over, 100);
    }
  },
  humanTurn: function(e) {
    sqr = +$(e.target).attr('id').replace('sqr_', '');

    if ( game.board[sqr] === 'O' || game.board[sqr] === 'X' ) { return; }

    game.board[sqr] = game.human;
    game.drawBoard();

    if ( AI.winning(game.board, game.human) || AI.open(game.board).length == 0) {
      _.delay(game.over, 100)
    } else {
      game.computerTurn();
    }
  },
  over: function() {
    var msg;
    if ( AI.winning(game.board, game.human) ) {
      msg = 'You won!';
    } else if ( AI.winning(game.board, game.computer) ) {
      msg = 'Computer won!';
    } else {
      msg = "It's a tie!";
    }

    alert(msg);
    game.board = [0,1,2,3,4,5,6,7,8];
    game.drawBoard();
  },
  bindEvents: function() {
    //choose X or O
    $('.btn').on('click', function() {
      var symbol = $(this).html();
      game.setPlayer(symbol);
      $("#modal").fadeOut(700);
    });

    //Choose square
    $('#board').on('click', 'td', this.humanTurn);
  },
  init: function() {
    this.bindEvents();
    this.drawBoard();
  }
}

var AI = {
  winning: function(board, player) {
    if (
     (board[0] == player && board[1] == player && board[2] == player) ||
     (board[3] == player && board[4] == player && board[5] == player) ||
     (board[6] == player && board[7] == player && board[8] == player) ||
     (board[0] == player && board[3] == player && board[6] == player) ||
     (board[1] == player && board[4] == player && board[7] == player) ||
     (board[2] == player && board[5] == player && board[8] == player) ||
     (board[0] == player && board[4] == player && board[8] == player) ||
     (board[2] == player && board[4] == player && board[6] == player)
    ) {
     return true;
    } else {
     return false;
    }
  },
  open: function(board) {
    //returns an array of open squars by index
    return board.filter(function(el, i) {
      return el !== 'X' && el !== 'O';
    });
  },
  minimax: function(newBoard, player) {

    var openSquares = this.open(newBoard);

    if ( this.winning(newBoard, game.computer) ) {
      return { score: 10 };
    } else if ( this.winning(newBoard, game.human) ) {
      return { score: -10 };
    } else if ( openSquares.length === 0 ) {
      return { score: 0 };
    }

    var moves = [];

    for ( var i = 0; i < openSquares.length; i++ ) {
      var move = {};
      move.index = openSquares[i];
      newBoard[openSquares[i]] = player;

      if (player === game.computer ) {
        var result = this.minimax(newBoard, game.human);

        move.score = result.score;
      } else {
        var result = this.minimax(newBoard, game.computer);
        move.score = result.score;
      }

      newBoard[openSquares[i]] = move.index;
      moves.push(move);
    }

    var bestMove;

    if (player === game.computer ) {
      var bestScore = -1000;
      for (var n = 0; n < moves.length; n++) {
        if (moves[n].score > bestScore ) {
          bestScore = moves[n].score;
          bestMove = moves[n];
        }
      }
    } else {
      var bestScore = 1000;
      for (var n = 0; n < moves.length; n++ ) {
        if (moves[n].score < bestScore) {
          bestScore = moves[n].score;
          bestMove = moves[n];
        }
      }
    }

    return bestMove;
  }
}
