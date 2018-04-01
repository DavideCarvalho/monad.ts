"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const chai_1 = require("chai");
describe('Monad', () => {
    it('should create a monad instance', () => {
        const myMonad = index_1.default.of('Hello World');
        chai_1.expect(myMonad.value).to.equal('Hello World');
    });
    it('should return a empty monad if a mapped monad is null value', () => {
        const myMonad = index_1.default.of(null);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f);
        chai_1.expect(mappedMonad.value).to.deep.equal(index_1.default.of([]).value);
    });
    it('should return a empty monad if a mapped monad is empty array', () => {
        const myMonad = index_1.default.of([]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f).bind(f).bind(f);
        chai_1.expect(mappedMonad.value).to.deep.equal(index_1.default.of([]).value);
    });
    it('should return type Maybe if monad value is a monad truthy', () => {
        const myMonad = index_1.default.of([1, 2, 3, 4, 5]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f);
        chai_1.expect(mappedMonad.getMonadType()).to.equal('Maybe');
    });
    it('should return type Nothing if monad value is a monad falsey', () => {
        const myMonad = index_1.default.of([]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f).bind(f).bind(f);
        chai_1.expect(mappedMonad.getMonadType()).to.equal('Nothing');
    });
    it('should get dad name', () => {
        const myMonad = index_1.default.of({ name: 'Son', parents: { dad: 'Dad', mother: 'Mother' } });
        const f = (x) => x.parents;
        const g = (x) => x.dad;
        const mappedMonad = myMonad.bind(f).bind(g);
        chai_1.expect(mappedMonad.value).to.deep.equal('Dad');
    });
    it('should return either default return if some of the bind gets an error', () => {
        const myMonad = index_1.default.of({ name: 'Son', parents: { dad: 'Dad', mother: 'Mother' } });
        const f = (x) => x.parents;
        const g = (x) => x.teste;
        const h = (x) => x.length;
        chai_1.expect(myMonad.bind(f).bind(g).bind(h).value).to.deep.equal(index_1.default.of([]).value);
    });
    it('should return either default return if some of the bind gets an error even if has more binds to chain', () => {
        const myMonad = index_1.default.of({ name: 'Son', parents: { dad: 'Dad', mother: 'Mother' } });
        const f = (x) => x.parents;
        const g = (x) => x.teste;
        const h = (x) => x.length;
        const j = (x) => x * x;
        chai_1.expect(myMonad.bind(f).bind(g).bind(h).bind(j).value).to.deep.equal(index_1.default.of([]).value);
    });
    it('should return either custom return if some of the bind gets an error', () => {
        const myMonad = index_1.default.of({ name: 'Son', parents: { dad: 'Dad', mother: 'Mother' } });
        const customEither = (e, monadValue) => {
            // tslint:disable-next-line:no-console
            console.error('customEither');
            return '';
        };
        myMonad.setEither(customEither);
        const f = (x) => x.parents;
        const g = (x) => x.test;
        const h = (x) => x.length;
        chai_1.expect(myMonad.bind(f).bind(g).bind(h).value).to.deep.equal(index_1.default.of('').value);
    });
    it('should throw error', () => {
        const myMonad = index_1.default.of({ name: 'Son', parents: { dad: 'Dad', mother: 'Mother' } });
        const f = (x) => x.parents;
        const g = (x) => x.mother;
        const mappedMonad = myMonad.bind(f).bind(g);
        chai_1.expect(mappedMonad.value).to.deep.equal('Mother');
    });
    it('should iterate over an object', () => {
        const myMonad = index_1.default.of([1, 2, 3, 4, 5]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f);
        chai_1.expect(mappedMonad.value).to.deep.equal([2, 3, 4, 5, 6]);
    });
    it('should change monad type', () => {
        const myMonad = index_1.default.of(1);
        const f = (x) => x.toString();
        const mappedMonad = myMonad.bind(f);
        chai_1.expect(mappedMonad.value).to.equal('1');
    });
    it('should validate monad right identity', () => {
        const firstMonad = index_1.default.of('Hello World');
        const secondsMonad = index_1.default.of(firstMonad);
        chai_1.expect(secondsMonad.value.value).to.eql(index_1.default.of('Hello World').value);
    });
    it('should validate monad left identity', () => {
        const myMonad = index_1.default.of([1, 2, 3, 4, 5]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.bind(f);
        const mappedFunction = somaMaisUmAosNumeros([1, 2, 3, 4, 5]);
        chai_1.expect(mappedMonad.value).to.deep.equal(mappedFunction);
    });
    it('should validate monad associativity', () => {
        const myMonad = index_1.default.of([1, 2, 3, 4, 5]);
        const f = (x) => x + 1;
        const g = (x) => x * 2;
        const mappedMonad = myMonad.bind(f).bind(g);
        const mappedFunction = multiplicaOsNumerosPorDois(somaMaisUmAosNumeros([1, 2, 3, 4, 5]));
        chai_1.expect(mappedMonad.value).to.deep.equal(mappedFunction);
    });
    it('should flatMap', () => {
        const myMonad = index_1.default.of([[1], [2, 3], [4, 5, 6]]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.flatMap(f);
        chai_1.expect(mappedMonad.value).to.deep.equal([2, 3, 4, 5, 6, 7]);
    });
    it('should chain flatMap with map', () => {
        const myMonad = index_1.default.of([[1], [2, 3], [4, 5, 6]]);
        const f = (x) => x + 1;
        const g = (x) => x * 2;
        const mappedMonad = myMonad.flatMap(f).bind(g);
        chai_1.expect(mappedMonad.value).to.deep.equal([4, 6, 8, 10, 12, 14]);
    });
    it('should flatMap even with empty arrays', () => {
        const myMonad = index_1.default.of([[1], [], [4, 5, 6]]);
        const f = (x) => x + 1;
        const mappedMonad = myMonad.flatMap(f);
        chai_1.expect(mappedMonad.value).to.deep.equal([2, 5, 6, 7]);
    });
});
const somaMaisUmAosNumeros = (object) => {
    return object.map((i) => i + 1);
};
const multiplicaOsNumerosPorDois = (object) => {
    return object.map((i) => i * 2);
};
//# sourceMappingURL=index.test.js.map