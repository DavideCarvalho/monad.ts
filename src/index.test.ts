import Monad from './index';
import { expect } from 'chai';

describe('Monad', () => {
  it('should create a monad instance', () => {
    const myMonad: Monad<string> = Monad.of('Hello World');
    expect(myMonad.value).to.equal('Hello World');
  });

  it('should iterate over an object', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.map(f);
    expect(mappedMonad.value).to.deep.equal([2, 3, 4, 5, 6]);
  });

  it('should change monad type', () => {
    const myMonad: Monad<number> = Monad.of(1);
    const f = (x: number) => x.toString();
    const mappedMonad = myMonad.map(f);
    expect(mappedMonad.value).to.equal('1');
  });

  it('should validate monad right identity', () => {
    const firstMonad: Monad<string> = Monad.of('Hello World');
    const secondsMonad: Monad<Monad<string>> = Monad.of(firstMonad);
    expect(secondsMonad.value).to.deep.equal(Monad.of('Hello World'));
  });

  it('should validate monad left identity', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.map(f);
    const mappedFunction: number[] = somaMaisUmAosNumeros([1, 2, 3, 4, 5]);
    expect(mappedMonad.value).to.deep.equal(mappedFunction);
  });

  it('should validate monad associativity', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const mappedMonad: Monad<number[]> = myMonad.map(f).map(g);
    const mappedFunction: number[] = multiplicaOsNumerosPorDois(somaMaisUmAosNumeros([1, 2, 3, 4, 5]));
    expect(mappedMonad.value).to.deep.equal(mappedFunction);
  });
});

const somaMaisUmAosNumeros = (object: any) => {
  return object.map((i: number) => i + 1);
};

const multiplicaOsNumerosPorDois = (object: any) => {
  return object.map((i: number) => i * 2);
};
