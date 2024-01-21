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

    const getSize = () => {
        return {rows, columns};
    }

    const getEmptyCells = () => {
        // checks if any row of the board has empty cells
        return board.filter( row => row.includes('')).length;
    }

    return {
        getBoard,
        getEmptyCells,
        getSize
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
    const boardSize = gameBoard.getSize().columns;
    let combos;
    let markCount;

    function playRound(row, cell) {
        // row & cell required to play from the console

        if (gameBoard.getEmptyCells() == 0) {
            // game ends
        } else {
            // update player of the round
            board[row][cell] = currPlayer.mark;
        }

        console.log(board);
        display(board);
        checkWinner(row, cell);
        currPlayer = (currPlayer == player1) ? player2 : player1;
    }

    function checkWinner(row, cell) {

        console.log(`current mark: ${currPlayer.mark}`)
        for (direction of ['row', 'column', 'diagonal-r', 'diagonal-l']) {
            // reset for the new iteration
            combos = '';
            markCount = 0;
            
            for (i = 0; i < boardSize; i++) {
                switch (true) {
                    case (direction == 'row'):
                        combos += board[row][i];
                        break;
                    case (direction == 'column'):
                        combos += board[i][cell];
                        break;
                    case (direction == 'diagonal-r'):
                        combos += board[i][i];
                        break;
                    case (direction == 'diagonal-l'):
                        // boardSize - 1 because index starts from 0
                        combos += board[i][boardSize - 1 - i];
                    }
            }

            // check how many marks are in the current direction
            markCount = combos.split('').filter( mark => mark == currPlayer.mark).length;

            console.log(`combos: ${combos} - direction: ${direction} - markCount: ${markCount}`);
            
            if (markCount == boardSize) {
                alert('YOU WON');
                return;
            }
        }
    }

    return {playRound};
})();

function display(board) {
    for (row of board) {
        console.log(row.join(' | '));
    }
}