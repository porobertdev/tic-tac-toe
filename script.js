const gameBoard = (function (testBoard) {

    const rows = 3;
    const columns = 3;
    
    const board = (function() {
        if (testBoard) {
            return [
                ['X', 'O', 'X'],
                ['O', 'X', 'O'],
                ['O', 'O', 'X']
            ];
        } else {
            const arr = [];

            // create rows * columns board
            for (i = 0; i < rows; i++) {
                arr.push([]);
                for (j = 0; j < columns; j++) {
                    arr[i].push('');
                }
            }
            return arr;
        }
    })();

    const getBoard = () => board;

    const getEmptyCells = () => {
        // checks if any row of the board has empty cells
        return board.filter( row => row.includes('')).length;
    }

    return {
        getBoard,
        getEmptyCells
    };
})(true);

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

    function playRound(row, cell) {
        // row & cell required to play from the console

        if (gameBoard.getEmptyCells() == 0) {
            // game ends
        } else {
            // update player of the round
            currPlayer = (currPlayer == player1) ? player2 : player1;
            board[row][cell] = currPlayer.mark;
        }

        display(board);
    }

    return {playRound};
})();

function display(board) {
    for (row of board) {
        console.log(row.join(' | '));
    }
}