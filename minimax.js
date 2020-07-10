var boardGame;
var PresentPlayTag = $("#PresentTurn");
var MultiPlayer = false;
var player = 'X';
var player_2 = 'O';
var PresentTurn = player;
var EndOfGame = 1;
var maxDepth = 10;
var depth;
var alpha = Number.MIN_SAFE_INTEGER;
var beta = Number.MAX_SAFE_INTEGER;
const WinningCombs = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

const cells = $(".cell");

function SetLevelOne() {
    maxDepth = 1;
}

function SetLevelTwo() {
    maxDepth = 2;
}

function SetLevelThree() {
    maxDepth = 3;
}

function SetLevelInf() {
    maxDepth = 9;
}
$('.button').on('click', function() {
    $(".btn-group").addClass('noHover');
    $(this).css('color', '#723267');

});

function startGame() {
    maxDepth = 10;
    $('.button').css('color', 'white')
    $("table").animate({
        opacity: "1"
    });
    if (MultiPlayer == false) {
        $(".btn-group").removeClass("disabled");
        $(".btn-group").removeClass("noHover");
    }
    if (MultiPlayer == false) {
        player = player;
        PresentTurn = player;
        PresentPlayTag = $("#PresentTurn");
        $("#f1").text(PresentTurn);
        $("#f2").text(PresentTurn == 'X' ? "O" : "X");
    }
    PresentPlayTag = $("#PresentTurn");
    cells.on('click', PresentTurnClick);
    EndOfGame = 0;
    $(".end-game").value = "none";
    boardGame = Array.from(Array(9).keys());
    ClearTicTacToe();
}

function endGame() {
    $("table").animate({
        opacity: "0.4"
    });
    EndOfGame = 1;
    ClearTicTacToe();
    PresentPlayTag.text("- - - - - - - -");
    cells.off('click');
    $(".btn-group").addClass("disabled");
    maxDepth = 10;
    $('.button').css('color', 'white');

}

function PresentTurnClick(square) {
    if (typeof(boardGame[square.target.id]) == "number") {

        turn(square.target.id, PresentTurn);
        if (!CheckForWin(boardGame, player) && !CheckForTie()) {
            if (MultiPlayer === false) {
                cells.off('click');
                setTimeout(function() {
                    PresentPlayTag.text("Your Turn : ");
                    cells.on('click', PresentTurnClick);
                    turn(bestChoice(), player_2);
                }, 700);
            }
        }
    }
}

function turn(boxId, player) {
    currentPlayer = player == 'X' ? 'O' : 'X';
    if (MultiPlayer == false) {
        if (currentPlayer != player_2)
            PresentPlayTag.text("You Play Next: " + currentPlayer);
        else

            PresentPlayTag.text("AI's turn " + currentPlayer);
    } else PresentPlayTag.text("You Play Next: " + currentPlayer);
    boardGame[boxId] = player;
    $("#" + boxId).text(player);
    let gameFinished = CheckForWin(boardGame, player) || CheckForTie();
    if (gameFinished) {
        gameOver(gameFinished);
    }

    PresentTurn = PresentTurn == 'X' ? 'O' : 'X';
}

function MinMax(PresentGameBoard, currentPlayer, alpha, beta, depth) {
    var availableMoves = AvailableMoves();

    if (CheckForWin(PresentGameBoard, player)) {
        return {
            score: -100 + depth
        };
    } else if (CheckForWin(PresentGameBoard, player_2)) {
        return {
            score: 100 - depth
        };
    } else if (availableMoves.length === 0 || depth == maxDepth) {
        return {
            score: 0
        };
    }

    
    var bestChoice={
        score,
        index
    };
    if (currentPlayer === player_2) {
        for (var i = 0; i < availableMoves.length; i++) {
            var move = {};
        move.index = PresentGameBoard[availableMoves[i]];
        PresentGameBoard[availableMoves[i]] = currentPlayer;
        var bestScore = -10000;
        var maxScoreIndex = MinMax(PresentGameBoard, player, alpha, beta, depth + 1);
            move.score = maxScoreIndex.score;
    
            if (move.score > bestScore) {
                bestScore = move.score;}
            
                alpha = Math.max(bestScore,alpha);

                if (beta <= alpha){
                    break;
                }
                bestChoice.score=bestScore;
                bestChoice.index=move.bestScore.index;

            }
           
    } else {
       
        
            for (var i = 0; i < availableMoves.length; i++) {
                var move = {};
            move.index = PresentGameBoard[availableMoves[i]];
            PresentGameBoard[availableMoves[i]] = currentPlayer;
            var bestScore = 10000;
            var maxScoreIndex = MinMax(PresentGameBoard, player_2, alpha, beta, depth + 1);
            move.score = maxScoreIndex.score;
           
            if (move.score < bestScore) {
                bestScore = move.score;}
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                  break;
                }
    
                bestChoice.score=bestScore;
                bestChoice.index=move.bestScore.index;
            }
           
        }
       
    

    return bestChoice;
}

function CheckForWin(board, player) {
    let plays = board.reduce(
        (acc, elem, index) => (elem === player) ? acc.concat(index) : acc, []);
    let gameFinished = null;
    for (let [index, win] of WinningCombs.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameFinished = {
                index: index,
                player: player
            };
            break;
        }
    }
    return gameFinished;
}

function gameOver(gameFinished) {
    EndOfGame = 1;
    maxDepth = 10;
    cells.off('click');
    cells.animate({
        opacity: '0.4'
    });
    for (let index of WinningCombs[gameFinished.index]) {
        setTimeout(function() {
            $("#" + index).css("background-color", "green");
            $("#" + index).animate({
                opacity: '1'
            });
            $("#PresentTurn").text(gameFinished.player + " WINS");
        }, 500);
    }
}

function AvailableMoves() {
    return boardGame.filter(s => typeof s == 'number');
}

function CheckForTie() {
    if (AvailableMoves().length === 0) {
        EndOfGame = 1;
        cells.off('click');
        cells.animate({
            opacity: '0.4'
        });
        PresentPlayTag.text("TIE GAME!");

        return true;
    }
    return false;
}

function bestChoice() {
    return MinMax(boardGame, player_2, alpha, beta, 0).index;
}

function ClearTicTacToe() {
    for (var i = 0; i < cells.length; i++) {
        $("#" + i).text("");
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].value = '';
        cells[i].style.removeProperty('background-color');
        cells[i].style.removeProperty('opacity');
        cells.on('click', PresentTurnClick);
    }
    PresentPlayTag.text("You Play Next: " + player);
}

function ReverseIt() {
    if (EndOfGame === 1 && MultiPlayer == true) {
        PresentTurn = PresentTurn == player ? player_2 : player;
        player = player == 'X' ? 'O' : 'X';
        player_2 = player_2 == 'X' ? 'O' : 'X';
        PresentFigureCh = $("#f1").text();
        $("#f1").animate({
            opacity: "0"
        });
        $("#f2").animate({
            opacity: "0"
        });
        setTimeout(function() {
            $("#f1").text(PresentFigureCh = PresentFigureCh == 'X' ? 'O' : 'X');
            $("#f2").text(PresentFigureCh = PresentFigureCh == 'X' ? 'O' : 'X');
        }, 500);
        $("#f1").animate({
            opacity: "1"
        });
        $("#f2").animate({
            opacity: "1"
        });
    }
}

function activeMultiPlayer() {
    if (EndOfGame === 1) {
        if (MultiPlayer) {
            $("#p2").animate({
                opacity: "0.3"
            });
        } else {
            $("#p2").animate({
                opacity: "1"
            });
        }
        MultiPlayer = MultiPlayer == true ? false : true;
    }
}