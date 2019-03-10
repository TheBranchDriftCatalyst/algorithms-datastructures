import { range, reduce } from 'lodash';

// The sum of the squares of the first ten natural numbers is,
// 1^2 + 2^2 + ... + 10^2 = 385
// The square of the sum of the first ten natural numbers is,
// (1 + 2 + ... + 10)^2 = 55^2 = 3025
// Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.
// Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.

const RANGE = [1, 101];

const sumOfSquare = range => reduce(range, (s, v) => (s += v ** 2), 0);
const squareOfSum = range => reduce(range, (s, v) => (s += v), 0) ** 2;

export default (numRange = RANGE) => {
  numRange = range(...numRange);
  return squareOfSum(numRange) - sumOfSquare(numRange);
};
