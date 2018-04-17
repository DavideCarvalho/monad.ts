"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monad {
    constructor(object) {
        this.monadType = 'Maybe';
        this.eitherFunction = (error, monadValue) => {
            // tslint:disable-next-line:no-console
            console.error(error);
            return [];
        };
        this.monadValue = object;
        this.isNothing() ? this.monadType = 'Nothing' : this.monadType = 'Just';
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
            return Monad.of([]).setEither(this.eitherFunction);
        }
        try {
            if (Array.isArray(this.monadValue)) {
                return Monad.of(this.monadValue.map(fn)).setEither(this.eitherFunction);
            }
            return Monad.of(fn(this.monadValue)).setEither(this.eitherFunction);
        }
        catch (e) {
            return Monad.of(this.eitherFunction(e, this.monadValue)).setType('Nothing').setEither(this.eitherFunction);
        }
    }
    getMonadType() {
        return this.monadType;
    }
    setEither(fn) {
        this.eitherFunction = fn;
        return this;
    }
    setDefaultEither() {
        this.eitherFunction = (error, monadValue) => {
            console.error(error);
            return [];
        };
        return this;
    }
    setType(monadType) {
        this.monadType = monadType;
        return this;
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
    isNothing() {
        if (Array.isArray(this.monadValue)) {
            return this.monadValue.length === 0;
        }
        return this.value === null || this.type === 'Nothing';
    }
}
exports.default = Monad;
//# sourceMappingURL=index.js.map