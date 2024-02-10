class GameBoard {

    #rows = 3;
    #columns = 3;
    
    #createBoard(type) {

        const arr = (type == 'console') ? [] : Array.from(document.querySelectorAll('.cell'));

        // create rows * columns board
        for (let i = 0; i < this.#rows; i++) {

            if (type == 'console') {
                arr.push([]);
                for (let j = 0; j < this.#columns; j++) {
                    arr[i].push('');
                }
            } else if (type == 'dom') {
                // create nested arrays to match rows * columns board
                arr.splice(i, 3, arr.slice(i, i + 3))
            }
        }

        return arr;
    }

    #console = this.#createBoard('console');
    #dom = this.#createBoard('dom');

    #getEmptyCells = () => {
        // checks if any row of the board has empty cells
        return this.#console.filter( row => row.includes('')).length;
    }

    constructor() {
        this.console = this.#console;
        this.dom = this.#dom;
        this.getEmptyCells = this.#getEmptyCells;
        this.rows = this.#rows;
        this.columns = this.#columns;
    }
};

class GameController extends GameBoard {

    // create players
    #createPlayer(pseudoName, mark, score = 0) {

        const scoreElement = document.querySelector(`.score.${pseudoName}`);

        function updateScore() {
            this.score += 1;
            scoreElement.textContent = this.score; // closure
        }
        return {pseudoName, mark, score, updateScore};
    }

    // board info
    #board = this.console;
    #domBoard = this.dom;
    #boardSize = this.rows;
    #directions = ['row', 'column', 'diagonal-r', 'diagonal-l'];

    // DOM
    #gameContainer = document.querySelector('.game-container');
    #rectangle = document.querySelector('.game-status .rectangle');
    #playerName = document.querySelector('span.player-name');
    #markImg = document.querySelector('img.mark');
    #menu = document.querySelector('.game-menu');
    #inputs = document.querySelectorAll('input[type="text"]');
    #playBtn = document.querySelector('button.play');
    #endGame = document.querySelector('.end-game');
    #strike = document.querySelector('.strike');
    #newGameBtn = document.querySelector('.reset');
    #newRoundBtn = document.querySelector('.next');

    /*  player names are updated after starting the game,
        but we need the objects for the event trigger
    */
    #player1 = this.#createPlayer('player1', 'x');
    #player2 = this.#createPlayer('player2', 'o');

    // set first player
    #currPlayer = this.#player1;
    #roundOver;

    playRound(row, cell, dom) {
        if (this.getEmptyCells() == 0) {
            return;
        }
        
        // make the move
        this.#board[row][cell] = this.#currPlayer.mark;

        // draw the marks in console and DOM
        for (let arr of this.#board) {
            console.log(arr.join(' | '));
        }

        // guard to don't break app when playing from console
        if (dom) {
            const img = document.createElement('img');
            img.setAttribute('src', `./assets/${this.#currPlayer.mark.toLowerCase()}-icon.svg`);
            event.target.appendChild(img);
        }

        this.#checkWinner(row, cell);
        this.#changeTurn();
    }

    manageEvent(type) {
        let row, cell;
        const boardHandler = (e) => {
            // find where the click was done
            for (let i = 0; i < this.#domBoard.length; i++) {
                if (this.#domBoard[i].includes(e.srcElement)) {
                    row = i;
                    cell = this.#domBoard[i].indexOf(e.srcElement);
                    break;
                }
            }

            // check console board to see if cell is empty
            // @TO DO: use DOM? like e.srcElement.children.length
            if (this.#board[row][cell] == '' && !this.#roundOver) {
                this.playRound(row, cell, true);
            }
        }

        const inputHandler = (e) => {
            if (this.#inputs[0].value != '' && this.#inputs[1].value != '') {
                this.#playBtn.classList.remove('hidden');
            } else {
                this.#playBtn.classList.add('hidden');
            }
        }

        const playHandler = (e) => {
            [this.#menu, this.#gameContainer].forEach( item => item.classList.toggle('hidden'));
            /*
                objects gets created before the event trigger occurs,
                so we need to update the names now, because initial
                names are plain 'player1' and 'player2'
            */
            this.#player1.name = this.#inputs[0].value;
            this.#player2.name = this.#inputs[1].value;

            // set initial UI for `game-status` @HTML
            this.#playerName.textContent = this.#player1.name;
            this.#rectangle.classList.add(this.#player1.pseudoName);
            
        }

        const gameOverHandler = (e) => {
            if (e.target.className == 'next') {
                this.#resetBoard();
            } else {
                // simply reload the page
                window.location.reload();
            }
        }

        // domboard
        this.#domBoard.forEach( row => {
            row.forEach( cell => {
                cell[type]('click', boardHandler);
            })});

        // input boxes
        this.#inputs.forEach( input => {
            input[type]('input', inputHandler);
        });
        
        this.#playBtn[type]('click', playHandler);

        // game over
        [this.#newGameBtn, this.#newRoundBtn].forEach( selector => selector[type]('click', gameOverHandler));

    }

    #checkWinner(row, cell) {
        let combos, markCount, className;

        console.log(`current mark: ${this.#currPlayer.mark}`)
        for (let direction of this.#directions) {
            // reset for the new iteration
            combos = '';
            markCount = 0;
            
            for (let i = 0; i < this.#boardSize; i++) {
                switch (true) {
                    case (direction == 'row'):
                        combos += this.#board[row][i];
                        className = `${direction}-${row + 1}`;
                        break;
                    case (direction == 'column'):
                        combos += this.#board[i][cell];
                        className = `${direction}-${cell + 1}`;
                        break;
                    case (direction.includes('diagonal')):
                        // boardSize - 1 because index starts from 0
                        combos += (direction == 'diagonal-r') ? this.#board[i][i] : this.#board[i][this.#boardSize - 1 - i];
                        className = direction;
                        break;
                    }
            }

            // check how many marks are in the current direction
            markCount = combos.split('').filter( mark => mark == this.#currPlayer.mark).length;

            console.log(`combos: ${combos} - direction: ${direction} - markCount: ${markCount}`);
            
            if (markCount == this.#boardSize) {
                this.#currPlayer.updateScore();
                this.#roundOver = true;

                // we need to add 'player1/2' class to choose the color
                this.#strike.classList.add(this.#currPlayer.pseudoName, className);

                this.#strike.classList.remove('hidden');
                this.#endGame.classList.remove('hidden');

                this.manageEvent('removeEventListener');
                return;
            }
        }
    }

    #changeTurn() {
        /*
            we need to remove the class of currPlayer first,
            and then add the class corresponding to the next
            player.

            @TODO: find another solution because this is
                   duplicated code.
        */

        this.#rectangle.classList.remove(this.#currPlayer.pseudoName);
        this.#currPlayer = (this.#currPlayer == this.#player1) ? this.#player2 : this.#player1;
        this.#rectangle.classList.add(this.#currPlayer.pseudoName);

        // name node
        this.#playerName.textContent = this.#currPlayer.name;
        // mark node
        this.#markImg.setAttribute('src', `./assets/${this.#currPlayer.mark}-status-icon.svg`);
    }

    #resetBoard() {

        console.log(this);
        this.#roundOver = false;

        // reset strike's classes
        this.#strike.classList.value = 'strike hidden';

        // hide/show
        this.#endGame.classList.add('hidden');

        this.#board.forEach( row => {
            for(let i = 0; i < this.rows; i++) {
                row[i] = '';
            }
        });

        this.#domBoard.forEach( row => {
            row.forEach(cell => {
                if (cell.childNodes.length != 0) {
                    cell.removeChild(cell.childNodes[0]);
                }
            });
        })
    }
};

const tictactoe = new GameController();
tictactoe.manageEvent('addEventListener');