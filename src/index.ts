export default class Monad<T> {

  public static of<U>(object: U):Monad<U> {
    return new Monad<U>(object);
  }

  private monadValue: T;
  private eitherFunction = (error: Error, monadValue: any) => {console.error(e); return []};

  get value(): T {
    return this.monadValue;
  }
  get either() {
    return this.eitherFunction;
  }
  set either(fn: ((error:any, monadValue: any) => any)) {
    this.eitherFunction = fn;
  }

  private constructor(object: T) {
    this.monadValue = object;
  }

  public flatMap<T>(fn: ((x: any) => any)): Monad<T> {
    this.monadValue = [].concat.apply([], this.monadValue);
    return this.bind(fn);
  }

  public bind<T>(fn: ((x: any) => any)): Monad<T> {
    if (this.isNothing()) {
      return Monad.of([]);
    }
    const newMonad = Monad.of(this.mapMonad(fn));
    newMonad.either = this.eitherFunction;
    return newMonad;
  }

  private mapMonad(fn: ((x: any) => any)) {
    if (Array.isArray(this.monadValue)) {
      return this.mapMonadIfIsArray(fn);
    }
    return this.mapMonadIfIsSingleValue(fn);
  }

  private mapMonadIfIsArray(fn: ((x: any) => any)) {
    try {
      return this.monadValue.map(fn)
    } catch (e) {
      return this.eitherFunction(e, this.monadValue);
    }
  }

  private mapMonadIfIsSingleValue(fn: ((x: any) => any)) {
    try {
      return fn(this.monadValue)
    } catch (e) {
      return this.eitherFunction(e, this.monadValue);
    }
  }

  private isNothing(): boolean {
    if (Array.isArray(this.monadValue)) {
      return this.monadValue.length === 0;
    }
    return this.value === null;
  }
}
