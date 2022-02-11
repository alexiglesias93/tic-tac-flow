import { Model } from './Model';
import { View } from './View';

export class Controller {
  private removeCellEventListeners?: () => void;
  private readonly model: Model;
  private readonly view: View;

  constructor() {
    this.model = new Model();
    this.view = new View();
    this.setEventListeners();
    this.setCellEventListeners();
  }

  /**
   * Adds event listeners to the UI.
   */
  setEventListeners() {
    this.view.restartButton.addEventListener('click', () => this.restartGame);
  }

  /**
   * Adds event listeners to the cells.
   */
  setCellEventListeners() {
    const handler = (e: MouseEvent) => {
      const cell = e.currentTarget as HTMLDivElement;
      this.handleCellClick(cell);
    };

    for (const { cell } of this.view.cellsElements) cell.addEventListener('click', handler, { once: true });

    this.removeCellEventListeners = () => {
      for (const { cell } of this.view.cellsElements) cell.removeEventListener('click', handler);
    };
  }

  /**
   * Handles a clicked cell.
   * @param cell The clicked cell.
   */
  handleCellClick(cell: HTMLDivElement) {
    const cellDataset = cell.dataset.cell;
    if (!cellDataset) return;

    const { model, view } = this;
    const { boardState } = model;
    const cellIndex = parseInt(cellDataset);
    const allCellsSelected = model.selectCell(cellIndex);
    const winningCombination = model.checkWinner();

    view.handleCellClick(cell, model.currentPlayer);

    if (model.gameActive && !allCellsSelected) {
      const previousPlayer = model.currentPlayer;
      const currentPlayer = model.changePlayer();

      view.handlePlayerChange(previousPlayer);
      view.handlePlayerChange(currentPlayer);

      view.renderMarks(currentPlayer, previousPlayer, boardState);

      return;
    }

    if (model.gameActive && allCellsSelected) {
      view.handleGameDraw();
      return;
    }

    if (winningCombination) {
      const { currentPlayer } = model;
      view.handleGameFinish(currentPlayer, winningCombination);
    }
  }

  /**
   * Restarts the game.
   */
  restartGame() {
    const { view, model } = this;

    this.removeCellEventListeners?.();
    this.setCellEventListeners();

    view.restart(model.currentPlayer);
    model.restart();
  }
}
