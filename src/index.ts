export default class Monad<T> {
  _value: T
  get value(): T {
    return this._value;
  }

  private constructor(object: T) {
    this._value = object;
  }

  public static of<U>(object: U):Monad<U> {
    return new Monad<U>(object);
  }

  private isNothing(): boolean {
    return this.value === null;
  }

  public map<T>(fn: ((x:any) => any)) {
    if (this.isNothing()) {
      return Monad.of(null);
    }
    if(Array.isArray(this._value))
      return Monad.of(this._value.map(fn))
    return Monad.of(fn(this._value));
  } 
}
