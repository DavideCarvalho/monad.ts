"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monad {
    constructor(object) {
        this.monadType = 'Maybe';
        this.eitherFunction = (error, monadValue) => {
            console.error(error);
            return [];
        };
        this.monadValue = object;
        this.isNothing() ? this.monadType = 'Nothing' : this.monadType = 'Maybe';
    }
    static of(object) {
        return new Monad(object);
    }
    // tslint:disable-next-line:no-shadowed-variable
    flatMap(fn) {
        this.monadValue = [].concat.apply([], this.monadValue);
        return this.bind(fn);
    }
    // tslint:disable-next-line:no-shadowed-variable
    bind(fn) {
        if (this.isNothing()) {
            return Monad.of([]);
        }
        const newMonad = this.mapMonad(fn).setEither(this.eitherFunction);
        // newMonad.setEither(this.eitherFunction);
        return newMonad;
    }
    getMonadType() {
        return this.monadType;
    }
    setEither(fn) {
        this.eitherFunction = fn;
    }
    get value() {
        return this.monadValue;
    }
    get either() {
        return this.eitherFunction;
    }
    get type() {
        return this.monadType;
    }
    set type(monadType) {
        this.monadType = monadType;
    }
    mapMonad(fn) {
        if (Array.isArray(this.monadValue)) {
            return this.mapMonadIfIsArray(fn);
        }
        return this.mapMonadIfIsSingleValue(fn);
    }
    mapMonadIfIsArray(fn) {
        try {
            return Monad.of(this.monadValue.map(fn));
        }
        catch (e) {
            const monadNothing = Monad.of(this.eitherFunction(e, this.monadValue));
            monadNothing.type = 'Nothing';
            return monadNothing;
        }
    }
    mapMonadIfIsSingleValue(fn) {
        try {
            return Monad.of(fn(this.monadValue));
        }
        catch (e) {
            const monadNothing = Monad.of(this.eitherFunction(e, this.monadValue));
            monadNothing.type = 'Nothing';
            return monadNothing;
        }
    }
    isNothing() {
        if (Array.isArray(this.monadValue)) {
            return this.monadValue.length === 0;
        }
        return this.value === null || this.type === 'Nothing';
    }
}
exports.default = Monad;
//# sourceMappingURL=index.js.map