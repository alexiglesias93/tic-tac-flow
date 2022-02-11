import type { BoardState, Player, WinningCombination } from '../utils/types';

export class View {
  public readonly cellsElements: {
    cell: HTMLDivElement;
    trigger: HTMLDivElement;
    marks: Record<Player, HTMLDivElement>;
  }[];
  public readonly restartButton = document.querySelector('#restart') as HTMLAnchorElement;
  public readonly drawTrigger = document.querySelector('#game-draw') as HTMLDivElement;
  public readonly marks = {
    1: document.querySelectorAll<HTMLDivElement>('.mark-1'),
    2: document.querySelectorAll<HTMLDivElement>('.mark-2'),
  };
  public readonly playerTriggers = {
    1: document.querySelector('#trigger-1') as HTMLDivElement,
    2: document.querySelector('#trigger-2') as HTMLDivElement,
  };
  public readonly winTriggers = {
    1: document.querySelector('#game-win-1') as HTMLDivElement,
    2: document.querySelector('#game-win-2') as HTMLDivElement,
  };

  constructor() {
    const cells = [...document.querySelectorAll<HTMLDivElement>('.cell')];

    this.cellsElements = cells.map((cell) => ({
      cell,
      trigger: cell.querySelector('.cell-trigger') as HTMLDivElement,
      marks: {
        1: document.querySelector('.mark-1') as HTMLDivElement,
        2: document.querySelector('.mark-2') as HTMLDivElement,
      },
    }));

    this.playerTriggers[1].click();

    for (const mark of this.marks[2]) mark.style.display = 'none';
  }

  /**
   * Restarts the controller.
   * @param currentPlayer
   */
  public restart(currentPlayer: Player) {
    for (const { cell } of this.cellsElements) cell.removeAttribute('style');

    for (const player of [1, 2] as const) {
      for (const mark of this.marks[player]) {
        mark.removeAttribute('style');

        if (player === 2) mark.style.display = 'none';
      }
    }

    if (currentPlayer === 2) {
      for (const trigger of Object.values(this.playerTriggers)) trigger.click();
    }
  }

  /**
   * Renders the marks of the current player.
   * @param currentPlayer
   * @param previousPlayer
   * @param boardState
   */
  public renderMarks(currentPlayer: Player, previousPlayer: Player, boardState: BoardState) {
    boardState.forEach((cellValue, index) => {
      if (cellValue !== 0) return;

      const { marks } = this.cellsElements[index];
      marks[previousPlayer].style.display = 'none';
      marks[currentPlayer].style.display = '';
    });
  }

  /**
   * Handles a clicked cell.
   * @param cell
   * @param currentPlayer
   */
  public handleCellClick(cell: HTMLDivElement, currentPlayer: Player) {
    const cellData = this.cellsElements.find((data) => data.cell === cell);
    if (!cellData) return;

    cellData.marks[currentPlayer].click();
  }

  /**
   * Handles when the current player has changed.
   * @param currentPlayer
   */
  public handlePlayerChange(currentPlayer: Player) {
    this.playerTriggers[currentPlayer].click();
  }

  /**
   * Handles a game draw.
   */
  public handleGameDraw() {
    this.drawTrigger.click();
  }

  /**
   * Handles a game finish.
   * @param currentPlayer
   * @param winningCombination
   */
  public handleGameFinish(currentPlayer: Player, winningCombination: WinningCombination) {
    for (const { cell } of this.cellsElements) cell.style.pointerEvents = 'none';

    for (const cellIndex of winningCombination) this.cellsElements[cellIndex].trigger.click();

    this.winTriggers[currentPlayer].click();
  }
}
