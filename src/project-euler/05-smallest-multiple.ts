import { range } from 'lodash';
// 2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
// What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?

export default (divisorRange = [1, 20]) => {
  let found = null;
  const divisors = range(divisorRange[0], divisorRange[1]);
  // because it has to be divisible by 10, we can step by 10
  const [initial, step] = [20, 10];
  let cQuotient = initial;
  while (!found) {
    let hasRemainder;
    for (let i = 0; i <= divisors.length - 1; i++) {
      if (!(cQuotient % divisors[i])) {
        continue;
      } else {
        hasRemainder = true;
        break;
      }
    }

    if (!hasRemainder) {
      found = cQuotient;
      return cQuotient;
    } else {
      cQuotient += step;
    }
  }
};
