const gameData = {
  gameActive: false,
  currentPlayer: 1,
  selectedCells: Array(9).fill(0),
  winningCombinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  changePlayer: function () {
    this.currentPlayer === 1 ? (this.currentPlayer = 2) : (this.currentPlayer = 1);
  },
  selectCell: function (cellNumber) {
    this.selectedCells[cellNumber] = this.currentPlayer;
    return this.selectedCells.every((el) => el !== 0);
  },
  checkWinner: function () {
    for (let combination of this.winningCombinations) {
      let counter = 0;
      combination.forEach((cell) => {
        if (this.selectedCells[cell] === this.currentPlayer) {
          counter++;
        }
      });
      if (counter === 3) {
        this.gameActive = false;
        return combination;
        break;
      }
    }
  },
  start: function () {
    this.gameActive = true;
  },
  restart: function () {
    this.gameActive = true;
    this.currentPlayer = 1;
    this.selectedCells = Array(9).fill(0);
  },
};

let gameUI = {
  elements: {
    cells: document.querySelectorAll('.cell'),
    player1Marks: document.querySelectorAll('.mark-1'),
    player2Marks: document.querySelectorAll('.mark-2'),
    player1Trigger: document.getElementById('trigger-1'),
    player2Trigger: document.getElementById('trigger-2'),
    restartButton: document.getElementById('restart'),
  },
  strings: {
    marks: '.mark-',
    playerTrigger: '#trigger-',
    winTrigger: '#game-win-',
    drawTrigger: '#game-draw',
    cellTrigger: '.cell-trigger',
  },

  cellClick: function (target) {
    mark = target.querySelector(this.strings.marks + gameData.currentPlayer);
    mark.style.opacity = '100';
  },
  changePlayer: function () {
    document.querySelector(this.strings.playerTrigger + gameData.currentPlayer).click();
  },
  renderMarks: function (previousPlayer) {
    gameData.selectedCells.forEach((element, index) => {
      if (element === 0) {
        let cell = this.elements.cells[index];
        cell.querySelector(this.strings.marks + previousPlayer).style.display = 'none';
        cell.querySelector(this.strings.marks + gameData.currentPlayer).style.display = '';
      }
    });
  },
  gameDraw: function () {
    document.querySelector(this.strings.drawTrigger).click();
  },
  finishGame: function (winningCombination) {
    this.elements.cells.forEach((el) => (el.style.pointerEvents = 'none'));
    winningCombination.forEach((el) => {
      this.elements.cells[el].querySelector(this.strings.cellTrigger).click();
    });
    document.querySelector(this.strings.winTrigger + gameData.currentPlayer).click();
  },
  start: function () {
    this.elements.player1Trigger.click();
    this.elements.player2Marks.forEach((el) => {
      el.style.display = 'none';
    });
  },
  restart: function (currentPlayer) {
    this.elements.cells.forEach((el) => {
      el.removeAttribute('style');
    });
    this.elements.player1Marks.forEach((el) => {
      el.removeAttribute('style');
    });
    this.elements.player2Marks.forEach((el) => {
      el.removeAttribute('style');
      el.style.display = 'none';
    });
    if (currentPlayer === 2) {
      this.elements.player1Trigger.click();
      this.elements.player2Trigger.click();
    }
  },
};

let gameController = {
  init: function () {
    let startGame = function () {
      setEventListeners();
      setCellEventListeners();
      gameData.start();
      gameUI.start();
    };

    let setEventListeners = function () {
      gameUI.elements.restartButton.addEventListener('click', restartGame);
    };

    let restartGame = function () {
      removeCellEventListeners();
      setCellEventListeners();
      gameUI.restart(gameData.currentPlayer);
      gameData.restart();
    };

    let setCellEventListeners = function () {
      gameUI.elements.cells.forEach((el) => {
        el.addEventListener('click', cellClick, { once: true });
      });
    };

    let removeCellEventListeners = function () {
      gameUI.elements.cells.forEach((el) => {
        el.removeEventListener('click', cellClick);
      });
    };

    let cellClick = function () {
      let winningCombination, allCellsSelected;
      let cellNumber = this.dataset.cell;
      let currentPlayer = gameData.currentPlayer;

      allCellsSelected = gameData.selectCell(cellNumber);
      gameUI.cellClick(this);
      winningCombination = gameData.checkWinner();
      if (gameData.gameActive && !allCellsSelected) {
        gameUI.changePlayer();
        gameData.changePlayer();
        gameUI.changePlayer();
        gameUI.renderMarks(currentPlayer);
      } else if (gameData.gameActive && allCellsSelected) {
        gameUI.gameDraw();
      } else {
        gameUI.finishGame(winningCombination);
      }
    };

    startGame();
  },
};

var Webflow = Webflow || [];
Webflow.push(function () {
  gameController.init();
});
