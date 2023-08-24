import { cloneDeep, times, remove, noop } from 'lodash';
import Debug from 'debug';

const dbg = Debug('RecNQueens');

export interface HooksInterface {
  removed?: Function,
  solved?: Function,
  placed?: Function,
  boardPosition?: Function
}

export default class NQueensSolver {
  board: number[][];
  hooks: HooksInterface | {} = {
    removed: noop,
    solved: noop,
    placed: noop,
    boardPosition: noop
  };
  
  constructor(n: number) {
    this.board = times(n, () => times(n, () => 0));
  }

  queens: number[][] = []; // [x, y] coordinates of queens
  solutionCount = 0;
  solutions = [];
  steps = 0;

  initHooks(hooks: HooksInterface) {
    this.hooks = hooks
    return this
  }

  solve(row = 0): NQueensSolver {
    // Board Base Cases
    if (this.board.length === 2 || this.board.length === 3) {
      return this;
    }
    // SOLUTION FOUND
    if (row === this.board.length) {
      dbg('Solution found!');
      this.solutionFound(this.queens)
      return this;
    }
    // SOLVER, Recursive Back Tracking
    for (let i = 0; i < this.board.length; i++) {
      if (this.placeQueen(row, i)) {
        this.solve(row + 1);
        this.removeQueen(row, i); // <--- Don't forget this
      }
    }
    return this;
  }

  solutionFound(solution: number[][]) {
    const _solution = cloneDeep(solution)
    // @ts-ignore
    this.solutions.push(_solution); 
    // this.hooks['boardPosition'](cloneDeep(this.queens))
  }

  /* The `removeQueen` method is responsible for removing a queen from the chessboard at the specified
  position (x, y). It sets the value at the specified position in the `board` array to 0, indicating
  that there is no queen at that position. It also removes the queen from the `queens` array by
  using the `remove` function from the lodash library. */
  removeQueen(x: number, y: number): void {
    dbg(`Removing queen at ${x}, ${y}`);
    this.board[x][y] = 0;
    remove(this.queens, ([x2, y2]: number[]) => x == x2 && y == y2);
    // @ts-ignore
    this.hooks['boardPosition'](cloneDeep(this.queens))
  }

  /**
   * Returns true if queen was placed, false if not.
   * MUTATES this.board. this.queens
   * @param  {number} x2 row to place queen on
   * @param  {number} y2 column to place queen on
   * @return {boolean}
   */
  placeQueen(x2: number, y2: number): boolean {
    dbg(`Placing queen at ${x2}, ${y2}`);
    if (this.queens.length !== 0) {
      for (let i = 0; i < this.queens.length; i++) {
        let [x1, y1]: number[] = this.queens[i];
        const slope = (y2 - y1) / (x2 - x1);
        // horizontal, vertical, diagonal, same point
        if (slope == Infinity || slope == 0 || Math.abs(slope) == 1 || Number.isNaN(slope)) {
          dbg(`Queen cannot be placed at ${x2}, ${y2} X ${x1}, ${y1} because of slope ${slope}`);
          return false;
        }
      }
    }
    this.board[x2][y2] = 1;
    // @ts-ignore
    this.queens.push([x2, y2]);
    // @ts-ignore
    this.hooks['boardPosition'](cloneDeep(this.queens))
    return true;
  }

  showSolutions(x: number | null = null): void {
    if (x === null) {
      this.solutions.map(this.buildSolutionBoard);
    } else {
      const solution = this.solutions[x];
      console.log(`Solution ${x}:`);
      console.log(solution);
      const solutionBoard = this.buildSolutionBoard(solution); 
      console.log(this.printBoard(solutionBoard));
    }
  }

  printBoard(board: number[][]): string {
    return board.map(row => row.join(' ')).join('\n');
  }

  buildSolutionBoard(solution: number[][]): number[][] {
    const board = times(this.board.length, () => times(this.board.length, () => 0));
    solution.map(([x, y]) => {
      board[x][y] = 1;
    });
    return board; 
  }
}

