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
})(false);

const gameController = (function() {

    // get board
    const board = gameBoard.getBoard();

    const domBoard = Array.from(document.querySelectorAll('.cell'));

    // create nested arrays to match rows * columns board
    for (i = 0; i < 3; i++) {
        domBoard.splice(i, 3, domBoard.slice(i, i + 3))
    }

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
    manageEvent('add');

    function playRound(row, cell, dom) {

        if (gameBoard.getEmptyCells() == 0) {
            // game ends
        } else {
            // draw the marks in console and DOM
            board[row][cell] = currPlayer.mark;
            if (dom) {
                const img = document.createElement('img');
                img.setAttribute('src', `./assets/${currPlayer.mark.toLowerCase()}-icon.svg`);
                event.target.appendChild(img);
            }
        }

        console.log(board);
        display(board);
        checkWinner(row, cell);
        currPlayer = (currPlayer == player1) ? player2 : player1;
    }

    function manageEvent(type) {

        domBoard.forEach( subArr => {

            subArr.forEach( cell => {
                if (type == 'add') {
                    cell.addEventListener('click', eventHandler);
                } else if (type == 'remove') {
                    cell.removeEventListener('click', eventHandler);
                }
            });
        });

        function eventHandler(e) {
            // find where the click was done
            for (i = 0; i < domBoard.length; i++) {
                if (domBoard[i].includes(e.srcElement)) {
                    row = i;
                    cell = domBoard[i].indexOf(e.srcElement);
                    break;
                }
            }

            playRound(row, cell, true);
        }
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
                    console.log(combos);
            }

            // check how many marks are in the current direction
            markCount = combos.split('').filter( mark => mark == currPlayer.mark).length;

            console.log(`combos: ${combos} - direction: ${direction} - markCount: ${markCount}`);
            
            if (markCount == boardSize) {
                alert('YOU WON');
                manageEvent('remove');
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