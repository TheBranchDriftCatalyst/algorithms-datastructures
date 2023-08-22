import { times } from 'lodash';

export function* erathenesGen(): Generator<number, void, unknown> {
  const markedNotPrime: { [key: number]: number[] } = {}
  let valueToCheck = 2;
  while (true) {
    if (!(valueToCheck in markedNotPrime)) {
      yield valueToCheck;
      markedNotPrime[valueToCheck ** 2] = [valueToCheck];
    } else {
      let primes = markedNotPrime[valueToCheck];
      primes.forEach(prime => {
        let nextMultipleOfPrime = prime + valueToCheck;
        if (nextMultipleOfPrime in markedNotPrime) {
          markedNotPrime[nextMultipleOfPrime].push(prime);
        } else {
          markedNotPrime[nextMultipleOfPrime] = [prime];
        }
      });
      delete markedNotPrime[valueToCheck];
    }
    valueToCheck += 1;
  }
}

export default (n = 10001) => {
  const gen = erathenesGen();
  times(n - 1, () => gen.next());
  return gen.next().value;
};
