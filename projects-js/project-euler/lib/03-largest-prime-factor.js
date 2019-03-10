import { erathenesGen } from './07-10001st-prime';

// The prime factors of 13195 are 5, 7, 13 and 29.
// What is the largest prime factor of the number 600851475143 ?

const NUMBER = 600851475143;
const gen = erathenesGen();

export const main = (number = NUMBER) => {
  const primeFactors = [];
  // We only need to generate the primes up to a the sqrt of the number, due to the fundemental theorem of arithmetic/euclids theorem
  for (let i = gen.next().value; i < Math.sqrt(number); i = gen.next().value) {
    if (!(number % i)) {
      primeFactors.push(i);
    }
  }
  const largestPf = primeFactors[primeFactors.length - 1];
  return largestPf;
};

export default main;
