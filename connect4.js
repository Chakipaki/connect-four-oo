"use strict";

class Game {
    #board = [];
    #currPlayer = 1;
    #isEnded = false;

    constructor(width = 7, height = 6) {
        this.#validateNumInput(width);
        this.#validateNumInput(height);

        this.width = width;
        this.height = height;
    }

    #validateNumInput(num) {
        if (typeof num !== "number" || num < 1) {
            throw new Error(`Invalid number input: ${num}`);
        }
    }

    #checkAndNotifyIsGameEnded() {
        if (this.#isEnded) {
            alert("Game is over! Please start a new game.");
            return true;
        }

        return false;
    }

    start() {
        this.#isEnded = false;
        this.#currPlayer = 1;
        this.makeBoard();
        this.makeHtmlBoard();
        this.addStartGameListener();
    }

    makeBoard() {
        // Clean the board before adding empty cells
        this.#board = [];
        for (let y = 0; y < this.height; y++) {
            const emptyRow = Array.from({ length: this.width }).fill(null);
            this.#board.push(emptyRow);
        }
    }

    addStartGameListener() {
        const buttonEl = document.querySelector("[data-start-game-btn]");
        buttonEl.addEventListener("click", this.start.bind(this));
    }

    makeHtmlBoard() {
        const htmlBoardEl = document.getElementById("board");
        // Clean board before adding new pieces
        htmlBoardEl.innerHTML = "";

        const top = document.createElement("tr");
        top.setAttribute("id", "column-top");

        // Create a table row for the top of the board with clickable cells to push pieces
        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement("td");
            headCell.setAttribute("id", `top-${x}`);
            headCell.addEventListener("click", this.handleClick.bind(this));
            top.append(headCell);
        }
        htmlBoardEl.append(top);

        // dynamically creates the main part of the HTML board
        // uses height property to create table rows
        // uses width property to create table cells for each row
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `c-${y}-${x}`);
                row.append(cell);
            }

            htmlBoardEl.append(row);
        }
    }

    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.#board[y][x] === null) {
                return y;
            }
        }

        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`p${this.#currPlayer}`);

        const spot = document.getElementById(`c-${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        alert(msg);
        this.#isEnded = true;
    }

    _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < this.height &&
                x >= 0 &&
                x < this.width &&
                this.#board[y][x] === this.#currPlayer
        );
    }

    checkForWin() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (this._win.call(this, horiz) || this._win.call(this, vert) || this._win.call(this, diagDR) || this._win.call(this, diagDL)) {
                    return true;
                }
            }
        }
        return false;
    }

    handleClick(evt) {
        if (this.#checkAndNotifyIsGameEnded()) {
            return;
        }

        // get x from ID of clicked cell
        const x = Number(evt.target.id.slice("top-".length));

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.#board[y][x] = this.#currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.#currPlayer} won!`);
        }

        // check for tie: if top row is filled, board is filled
        if (this.#board[0].every(cell => cell !== null)) {
            return this.endGame('Tie!');
        }

        // switch players
        this.#currPlayer = this.#currPlayer === 1 ? 2 : 1;
    }
}

const game = new Game(10, 10);
game.start();