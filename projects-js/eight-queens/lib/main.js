/* @flow */
import RecNQueensBoard from './RecNQueens';

const testBoard = new RecNQueensBoard(8);
console.time('recursive-n-queens');
testBoard.solve();
console.timeEnd('recursive-n-queens');
console.info(testBoard.solutionCount);
