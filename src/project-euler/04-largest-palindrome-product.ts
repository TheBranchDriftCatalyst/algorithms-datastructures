import { toNumber, toString, reverse, flow } from 'lodash';
import { join } from 'lodash/fp';
/**
 * Question:
 * A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
 * Find the largest palindrome made from the product of two 3-digit numbers.
 *
 * My Notes:
 * There are two approaches to do this, we could itterate through all combinations or we could itterate through
 * all palindromes within our result space.  We are going to do the later
 */

const reverseNum = flow([toString, Array.from, reverse, join(''), toNumber]);

// We could optimize this with a for loop that ends in the middle and breaks ast first failure.
const isPalindrome = (a: number) => a === reverseNum(a);

const testProduct = (x: number, min: number, max: number) => {
  let found;
  for (let a = min; a < max; a++) {
    for (let b = max; b > min; b--) {
      if (x === a * b) {
        found = [a, b];
        break;
      }
    }
  }
  return found;
};

// Product range
const NUMBER_RANGE = [100, 999];

// result space, backwards because we want to find the largest, so go from top down,
// could use findRight, or findLast but don't need to
function* revRange(start: number, end: number) {
  for (let i = end; i >= start; i--) {
    yield i;
  }
}

export default (range = NUMBER_RANGE) => {
  const rangeGen = revRange(range[0] * range[0], range[1] * range[1]);
  let answer;
  // let found;
  for (let n of rangeGen) {
    if (isPalindrome(n)) {
      const productTest = testProduct(n, range[0], range[1]);
      if (productTest) {
        // found = productTest;
        answer = n;
        break;
      }
    }
  }
  return answer;
};
