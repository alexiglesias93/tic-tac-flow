import { STARTER_PLAYER, WINNING_COMBINATIONS } from '../utils/constants';
import { getEmptyBoard } from '../utils/helpers';
import type { BoardState, Player } from '../utils/types';

export class Model {
  public gameActive = true;
  public currentPlayer: Player = STARTER_PLAYER;
  public boardState: BoardState = getEmptyBoard();

  /**
   * Restarts the game.
   */
  restart() {
    this.boardState = getEmptyBoard();
    this.currentPlayer = STARTER_PLAYER;
    this.gameActive = true;
  }

  /**
   * Changed the currently active player.
   * @returns The current player.
   */
  changePlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    return this.currentPlayer;
  }

  /**
   * Assigns a sell to a player.
   * @param cellNumber The cell number to select.
   * @returns `true` if all cells have been selected.
   */
  selectCell(cellNumber: number) {
    this.boardState[cellNumber] = this.currentPlayer;
    return this.boardState.every((cell) => cell !== 0);
  }

  /**
   * Checks if the current player has won the game.
   * @returns The winning combination, if existing.
   */
  checkWinner() {
    const { boardState: selectedCells, currentPlayer } = this;

    for (const combination of WINNING_COMBINATIONS) {
      let counter = 0;

      for (const cellIndex of combination) {
        if (selectedCells[cellIndex] === currentPlayer) counter += 1;
      }

      if (counter !== 3) continue;

      this.gameActive = false;
      return combination;
    }
  }
}
