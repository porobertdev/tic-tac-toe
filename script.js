const gameBoard = (function () {

    const rows = 3;
    const columns = 3;
    
    function createBoard(type) {

        const arr = (type == 'console') ? [] : Array.from(document.querySelectorAll('.cell'));

        // create rows * columns board
        for (i = 0; i < rows; i++) {

            if (type == 'console') {
                arr.push([]);
                for (j = 0; j < columns; j++) {
                    arr[i].push('');
                }
            } else if (type == 'dom') {
                // create nested arrays to match rows * columns board
                arr.splice(i, 3, arr.slice(i, i + 3))
            }
        }

        return arr;
    }

    const console = createBoard('console');
    const dom = createBoard('dom');

    const getSize = () => {
        return {rows, columns};
    }

    const getEmptyCells = () => {
        // checks if any row of the board has empty cells
        return console.filter( row => row.includes('')).length;
    }

    return {
        console,
        dom,
        getEmptyCells,
        getSize
    };
})();

const gameController = (function() {

    // create players
    function createPlayer(name, mark, score = 0) {

        // used to update the rectangle for `game-status`
        const pseudo = (mark == 'x') ? 'player1' : 'player2';

        const scoreElement = document.querySelector(`.score.${pseudo}`);
        // set initial score
        scoreElement.textContent = 0;

        function updateScore() {
            this.score += 1;
            scoreElement.textContent = this.score; // closure
        }
        return {name, pseudo, mark, score, updateScore};
    }

    // board info
    const board = gameBoard.console;
    const domBoard = gameBoard.dom;
    const boardSize = gameBoard.getSize().columns;

    // DOM
    const gameContainer = document.querySelector('.game-container');
    const rectangle = document.querySelector('.game-status .rectangle');
    const playerName = document.querySelector('span.player-name');
    const menu = document.querySelector('.game-menu');
    const inputs = document.querySelectorAll('input[type="text"]');
    const play = document.querySelector('button.play');

    /*  player names are updated after starting the game,
        but we need the objects for the event trigger
    */
    const player1 = createPlayer('player1', 'x');
    const player2 = createPlayer('player2', 'o');

    // set first player
    let currPlayer = player1;

    // used in checkWinner()'s loop
    let combos;
    let markCount;

    // add event listeners
    manageEvent('addEventListener');

    function playRound(row, cell, dom) {

        if (gameBoard.getEmptyCells() == 0) {
            return;
        }

        // make the move
        board[row][cell] = currPlayer.mark;

        // draw the marks in console and DOM
        for (arr of board) {
            console.log(arr.join(' | '));
        }

        // guard to don't break app when playing from console
        if (dom) {
            const img = document.createElement('img');
            img.setAttribute('src', `./assets/${currPlayer.mark.toLowerCase()}-icon.svg`);
            event.target.appendChild(img);
        }

        checkWinner(row, cell);
        changeTurn();
    }

    function manageEvent(type) {

        domBoard.forEach( row => {
            row.forEach( cell => {
                cell[type]('click', boardHandler);
            })});

        inputs.forEach( input => {
            input[type]('input', inputHandler);
        });
        
        play[type]('click', playHandler);

        function boardHandler(e) {
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

        function inputHandler(e) {
            if (inputs[0].value != '' && inputs[1].value != '') {
                play.classList.remove('hidden');
            } else {
                play.classList.add('hidden');
            }
        }

        function playHandler(e) {
            [menu, gameContainer].forEach( item => item.classList.toggle('hidden'));

            /*
                objects gets created before the event trigger occurs,
                so we need to update the names now, because initial
                names are plain 'player1' and 'player2'
            */
            player1.name = inputs[0].value;
            player2.name = inputs[1].value;

            // set initial UI for `game-status` @HTML
            playerName.textContent = player1.name;
            rectangle.classList.add(player1.pseudo);
            
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
                currPlayer.updateScore();
                alert('YOU WON');
                manageEvent('removeEventListener');
                return;
            }
        }
    }

    function changeTurn() {
        /*
            we need to remove the class of currPlayer first,
            and then add the class corresponding to the next
            player.

            @TODO: find another solution because this is
                   duplicated code.
        */

        rectangle.classList.toggle(currPlayer.pseudo);
        currPlayer = (currPlayer == player1) ? player2 : player1;
        rectangle.classList.toggle(currPlayer.pseudo);

        // name node
        rectangle.children[0].textContent = currPlayer.name;
        // mark node
        rectangle.children[1].setAttribute('src', `./assets/${currPlayer.mark}-status-icon.svg`);
    }

    return {playRound};
})();