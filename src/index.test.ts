import Monad from './index';
import { expect } from 'chai';

describe('Monad', () => {
  it('should create a monad instance', () => {
    const myMonad: Monad<string> = Monad.of('Hello World');
    expect(myMonad.value).to.equal('Hello World');
  });

  it('should return a empty monad if a mapped monad is null value', () => {
    const myMonad: Monad<null> = Monad.of(null);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.bind(f);
    expect(mappedMonad.value).to.deep.equal(Monad.of([]).value);
  });

  it('should return a empty monad if a mapped monad is empty array', () => {
    const myMonad: Monad<never[]> = Monad.of([]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.bind(f).bind(f).bind(f);
    expect(mappedMonad.value).to.deep.equal(Monad.of([]).value);
  });

  it('should get dad name', () => {
    const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
    const f = (x: SonJson):ParentsJson => x.parents;
    const g = (x: ParentsJson):string => x.dad;
    const mappedMonad: Monad<string> = myMonad.bind(f).bind(g);
    expect(mappedMonad.value).to.deep.equal('Dad');
  });

  it('should return either default return if some of the bind gets an error', () => {
    const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
    const f = (x: SonJson):ParentsJson => x.parents;
    const g = (x: any):string => x.teste;
    const h = (x: string):number => x.length;
    expect(myMonad.bind(f).bind(g).bind(h).value).to.deep.equal(Monad.of([]).value)
  });

  it('should return either default return if some of the bind gets an error even if has more binds to chain', () => {
    const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
    const f = (x: SonJson):ParentsJson => x.parents;
    const g = (x: any):string => x.teste;
    const h = (x: string):number => x.length;
    const j = (x: number):number => x*x
    expect(myMonad.bind(f).bind(g).bind(h).bind(j).value).to.deep.equal(Monad.of([]).value)
  });

  it('should return either custom return if some of the bind gets an error', () => {
    const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
    const customEither = (e: any, monadValue: any) => {console.log('customEither'); return ''};
    myMonad.either = customEither;
    const f = (x: SonJson):ParentsJson => x.parents;
    const g = (x: any):string => x.test;
    const h = (x: any):number => x.length;
    expect(myMonad.bind(f).bind(g).bind(h).value).to.deep.equal(Monad.of('').value)
  });

  it('should throw error', () => {
    const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
    const f = (x: SonJson):ParentsJson => x.parents;
    const g = (x: ParentsJson):string => x.mother;
    const mappedMonad: Monad<string> = myMonad.bind(f).bind(g);
    expect(mappedMonad.value).to.deep.equal('Mother');
  });

  it('should iterate over an object', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.bind(f);
    expect(mappedMonad.value).to.deep.equal([2, 3, 4, 5, 6]);
  });

  it('should change monad type', () => {
    const myMonad: Monad<number> = Monad.of(1);
    const f = (x: number): string => x.toString();
    const mappedMonad: Monad<string> = myMonad.bind(f);
    expect(mappedMonad.value).to.equal('1');
  });

  it('should validate monad right identity', () => {
    const firstMonad: Monad<string> = Monad.of('Hello World');
    const secondsMonad: Monad<Monad<string>> = Monad.of(firstMonad);
    expect(secondsMonad.value.value).to.eql(Monad.of('Hello World').value);
  });

  it('should validate monad left identity', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.bind(f);
    const mappedFunction: number[] = somaMaisUmAosNumeros([1, 2, 3, 4, 5]);
    expect(mappedMonad.value).to.deep.equal(mappedFunction);
  });

  it('should validate monad associativity', () => {
    const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const mappedMonad: Monad<number[]> = myMonad.bind(f).bind(g);
    const mappedFunction: number[] = multiplicaOsNumerosPorDois(somaMaisUmAosNumeros([1, 2, 3, 4, 5]));
    expect(mappedMonad.value).to.deep.equal(mappedFunction);
  });

  it('should flatMap', () => {
    const myMonad: Monad<number[][]> = Monad.of([[1], [2, 3], [4, 5, 6]]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.flatMap(f);
    expect(mappedMonad.value).to.deep.equal([2, 3, 4, 5, 6, 7]);
  })

  it('should chain flatMap with map', () => {
    const myMonad: Monad<number[][]> = Monad.of([[1], [2, 3], [4, 5, 6]]);
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const mappedMonad: Monad<number[]> = myMonad.flatMap(f).bind(g);
    expect(mappedMonad.value).to.deep.equal([4, 6, 8, 10, 12, 14]);
  })

  it('should flatMap even with empty arrays', () => {
    const myMonad: Monad<number[][]> = Monad.of([[1], [], [4, 5, 6]]);
    const f = (x: number) => x + 1;
    const mappedMonad: Monad<number[]> = myMonad.flatMap(f);
    expect(mappedMonad.value).to.deep.equal([2, 5, 6, 7]);
  })
});

const somaMaisUmAosNumeros = (object: any) => {
  return object.map((i: number) => i + 1);
};

const multiplicaOsNumerosPorDois = (object: any) => {
  return object.map((i: number) => i * 2);
};

interface SonJson{ 
  name: string;
  parents: ParentsJson;
}

interface ParentsJson {
  dad: string;
  mother: string
}