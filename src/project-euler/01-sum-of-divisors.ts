// If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9.
// The sum of these multiples is 23.
// Find the sum of all the multiples of MULTIPLES[3 or 5] below MAX[1000].

const divTest = (dividend: number, multiples: number[]) => {
  // Exit on the first true
  let isDivisible = false;
  for (let i = 0; i < multiples.length; i++) {
    if (!(dividend % multiples[i])) {
      isDivisible = true;
      break;
    }
  }
  return isDivisible;
};

const sumDivisors = (max: number, multiples: number[]) => {
  const divisors = [];
  let sum = 0;
  for (let cDividend = 0; cDividend < max; cDividend++) {
    if (divTest(cDividend, multiples)) {
      divisors.push(cDividend);
      sum += cDividend;
    }
  }
  return sum;
};

const MAX = 1000;
const MULTIPLES = [3, 5];

export default (max = MAX, multiples = MULTIPLES) => sumDivisors(max, multiples);
