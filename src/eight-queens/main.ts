import { times } from 'lodash';
import RecNQueensBoard from './RecNQueens';


// times(8, (idx) => {
//     console.time(`recursive-n-queens:${idx+1}`);
//     const testBoard = new RecNQueensBoard(idx+1);
//     testBoard.solve();
//     console.timeEnd(`recursive-n-queens:${idx+1}`);
//     console.info(`recursive-n-queens:${idx+1}`, { solutionCount: testBoard.solutionCount });
// })

console.time(`recursive-n-queens`);
const testBoard = new RecNQueensBoard(10);
testBoard.solve()
testBoard.showSolutions(0);
console.timeEnd(`recursive-n-queens`);

// console.time('recursive-n-queens');
// testBoard.solve();
// testBoard.showSolutions(0);
// console.timeEnd('recursive-n-queens');
// console.info(testBoard.solutionCount);
