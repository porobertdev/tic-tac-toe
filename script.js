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