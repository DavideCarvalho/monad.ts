export default class Monad<T> {
  _value: T;

  get value(): T {
    return this._value;
  }

  private constructor(object: T) {
    this._value = object;
  }

  public static of<U>(object: U):Monad<U> {
    return new Monad<U>(object);
  }

  public isNothing(): boolean {
    if (Array.isArray(this._value))
      return this._value.length === 0;
    return this.value === null;
  }

  public flatMap<T>(fn: ((x:any) => any)): Monad<T[]> {
    this._value = [].concat.apply([], this._value)
    return this.bind(fn);
  }

  public bind<T>(fn: ((x:any) => any)): Monad<T[]> {
    if (this.isNothing()) {
      return Monad.of([]);
    }
    if(Array.isArray(this._value))
      return Monad.of(this._value.map(fn))  
    return Monad.of(fn(this._value));
  } 
}
