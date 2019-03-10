import { memoize } from 'lodash';

// Each new term in the Fibonacci sequence is generated by adding the previous two terms. By starting with 1 and 2, the first 10 terms will be:
// 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
// By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.

const fibR = memoize(n => (n < 1 ? 1 : fibR(n - 1) + fibR(n - 2)));

const main = (maxSum = 4000000) => {
  let sum = BigInt(0);
  let n = 0;
  let curFib = 0;
  while (curFib < maxSum) {
    curFib = fibR(n++);
    if (!(BigInt(curFib) % BigInt(2))) {
      sum += BigInt(curFib);
    }
  }
  return Number(sum);
};

export default main;
