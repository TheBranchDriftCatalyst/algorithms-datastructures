/* @flow */
import { cloneDeep, times, remove } from 'lodash';
import Debug from 'debug';

export default class RecNQueensBoard {
  constructor(n: integer) {
    this.board = times(n, () => times(n, () => 0));
  }

  queens = [];
  solutionCount = 0;
  solutions = [];

  solve(row = 0): RecNQueensBoard {
    if (this.board.length === 2 || this.board.length === 3) {
      return this;
    }
    if (row === this.board.length) {
      c;
      this.solutions.push(cloneDeep(this.queens));
      this.solutionCount += 1;
      return this;
    }
    for (let i = 0; i < this.board.length; i++) {
      if (this.placeQueen(row, i)) {
        this.solve(row + 1);
        this.removeQueen(row, i); // <--- Don't forget this
      }
    }
    return this;
  }

  removeQueen(x: integer, y: integer): void {
    this.board[x][y] = 0;
    remove(this.queens, ([x2, y2]) => x == x2 && y == y2);
  }

  /**
   * Returns true if queen was placed, false if not.
   * MUTATES this.board. this.queens
   * @param  {number} x2 row to place queen on
   * @param  {number} y2 column to place queen on
   * @return {boolean}
   */
  placeQueen(x2: integer, y2: integer): boolean {
    if (this.queens.length !== 0) {
      for (let i = 0; i < this.queens.length; i++) {
        let [x1, y1] = this.queens[i];
        const slope = (y2 - y1) / (x2 - x1);
        // horizontal, vertical, diagonal, same point
        if (slope == Infinity || slope == 0 || Math.abs(slope) == 1 || slope == NaN) {
          return false;
        }
      }
    }
    this.board[x2][y2] = 1;
    this.queens.push([x2, y2]);
    return true;
  }
}

RecNQueensBoard(5);
