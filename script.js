const gameBoard = (function () {

    const rows = 3;
    const columns = 3;
    const board = [];

    // create rows * columns board
    for (i = 0; i < rows; i++) {
        board.push([]);
        for (j = 0; j < columns; j++) {
            board[i].push('');
        }
    }

    const getBoard = () => board;

    return {
        getBoard
    };
})();

const gameController = (function() {

    // get board
    const board = gameBoard.getBoard();

    // create players
    function createPlayer(name, mark) {
        return {name, mark};
    }

    const player1 = createPlayer('player1', 'X');
    const player2 = createPlayer('player2', 'O');

    // set first player
    let currPlayer = player1;
})();