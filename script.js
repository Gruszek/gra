document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const resetButton = document.getElementById('reset');
    const modeSelect = document.getElementById('mode');

    let cells;
    let currentPlayer;
    let gameActive;
    let gameMode;

    const PLAYER_X = 'X';
    const PLAYER_O = 'O';
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function initializeGame() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        cells = Array.from(document.querySelectorAll('.cell'));
        currentPlayer = PLAYER_X;
        gameActive = true;
        gameMode = modeSelect.value;
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.dataset.index;

        if (cell.textContent || !gameActive) return;

        cell.textContent = currentPlayer;
        if (checkWin(currentPlayer)) {
            gameActive = false;
            setTimeout(() => alert(`${currentPlayer} wygrywa!`), 100);
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => alert('Remis!'), 100);
        } else {
            currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            if (gameMode !== '2p' && currentPlayer === PLAYER_O) {
                handleComputerMove();
            }
        }
    }

    function handleComputerMove() {
        const emptyCells = cells.filter(cell => !cell.textContent);
        let move;
        switch (gameMode) {
            case '1p-easy':
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                break;
            case '1p-medium':
                move = findBestMove(emptyCells) || emptyCells[Math.floor(Math.random() * emptyCells.length)];
                break;
            case '1p-hard':
                move = findBestMove(emptyCells) || emptyCells[0];
                break;
        }
        move.textContent = PLAYER_O;
        if (checkWin(PLAYER_O)) {
            gameActive = false;
            setTimeout(() => alert('O wygrywa!'), 100);
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => alert('Remis!'), 100);
        } else {
            currentPlayer = PLAYER_X;
        }
    }

    function findBestMove(emptyCells) {
        // Prosta AI dla poziomów średniego i trudnego
        for (let i = 0; i < emptyCells.length; i++) {
            const cell = emptyCells[i];
            cell.textContent = PLAYER_O;
            if (checkWin(PLAYER_O)) {
                cell.textContent = '';
                return cell;
            }
            cell.textContent = '';
        }
        return null;
    }

    function checkWin(player) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cells[index].textContent === player;
            });
        });
    }

    function isDraw() {
        return cells.every(cell => cell.textContent);
    }

    resetButton.addEventListener('click', initializeGame);
    modeSelect.addEventListener('change', initializeGame);

    initializeGame();
});
