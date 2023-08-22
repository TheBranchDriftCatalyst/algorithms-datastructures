import main01 from '../01-sum-of-divisors';
import main02 from '../02-sum-of-even-fibs';
import main03 from '../03-largest-prime-factor';
import main04 from '../04-largest-palindrome-product';
import main05 from '../05-smallest-multiple';
import main06 from '../06-sum-square-difference';
import main07 from '../07-10001st-prime';
import main08 from '../08-largest-product-in-series';

describe('If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9.\nThe sum of these multiples is 23', () => {
  it('Find the sum of all the multiples of 3 or 5 below 1000', () => {
    const MAX = 1000;
    const MULTIPLES = [3, 5];
    const res = main01(MAX, MULTIPLES);
    expect(res).toEqual(233168);
  });
});

describe('Sum of Even Fibonacci Seq', () => {
  it('By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.', () => {
    const res = main02(4000000);
    expect(res).toBe(4613732);
  });
});

describe('The prime factors of 13195 are 5, 7, 13 and 29.', () => {
  it('What is the largest prime factor of the number 600851475143', () => {
    const res = main03(600851475143);
    expect(res).toEqual(6857);
  });
});

describe('The prime factors of 13195 are 5, 7, 13 and 29.', () => {
  it('What is the largest prime factor of the number 600851475143', () => {
    const res = main04([100, 999]);
    expect(res).toEqual(906609);
  });
});

describe('2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.', () => {
  it('What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?', () => {
    const res = main05([1, 20]);
    expect(res).toEqual(232792560);
  });
});

describe('Sum of square difference', () => {
  it('Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum', () => {
    const res = main06([1, 101]);
    expect(res).toEqual(25164150);
  });
});

describe('By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.', () => {
  it('What is the 10 001st prime number?', () => {
    const res = main07(10001);
    expect(res).toEqual(104743);
  });
});

const NUMBER =
  '7316717653133062491922511967442657474235534919493496983520312774506326239578318016984801869478851843858615607891129494954595017379583319528532088055111254069874715852386305071569329096329522744304355766896648950445244523161731856403098711121722383113622298934233803081353362766142828064444866452387493035890729629049156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678812202354218097512545405947522435258490771167055601360483958644670632441572215539753697817977846174064955149290862569321978468622482839722413756570560574902614079729686524145351004748216637048440319989000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450';

describe('By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.', () => {
  it('What is the 10 001st prime number?', () => {
    const res = main08(NUMBER);
    expect(res).toEqual(23514624000);
  });
});
