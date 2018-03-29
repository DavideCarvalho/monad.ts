export default class Monad<T> {

  public static of<U>(object: U):Monad<U> {
    return new Monad<U>(object);
  }

  private monadValue: T;

  get value(): T {
    return this.monadValue;
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
    if (Array.isArray(this.monadValue)) {
      return Monad.of(this.monadValue.map(fn));
    }
    return Monad.of(fn(this.monadValue));
  }

  private isNothing(): boolean {
    if (Array.isArray(this.monadValue)) {
      return this.monadValue.length === 0;
    }
    return this.value === null;
  }
}
