export default class Monad<T> {

  public static of<U>(object: U): Monad<U> {
    return new Monad<U>(object);
  }

  private monadValue: T;
  private monadType: string = 'Maybe';

  private constructor(object: T) {
    this.monadValue = object;
    this.isNothing() ? this.monadType = 'Nothing' : this.monadType = 'Just';
  }

  // tslint:disable-next-line:no-shadowed-variable
  public flatMap<T>(fn: ((x: any) => any)): Monad<T> {
    this.monadValue = [].concat.apply([], this.monadValue);
    return this.bind(fn);
  }

  // tslint:disable-next-line:no-shadowed-variable
  public bind<T>(fn: ((x: any) => any)): Monad<T> {
    if (this.isNothing()) {
      return Monad.of([]).setEither(this.eitherFunction);
    }
    try {
      if (Array.isArray(this.monadValue)) { 
        return Monad.of(this.monadValue.map(fn)).setEither(this.eitherFunction);
      }
      return Monad.of(fn(this.monadValue)).setEither(this.eitherFunction);
    } catch (e) {
      return Monad.of(this.eitherFunction(e, this.monadValue)).setType('Nothing').setEither(this.eitherFunction);
    }
  }

  public getMonadType(): string  {
    return this.monadType;
  }

  public setEither(fn: ((error: any, monadValue: any) => any)) {
    this.eitherFunction = fn;
    return this;
  }

  public setDefaultEither() {
    this.eitherFunction = (error: Error, monadValue: any) => {
      console.error(error);
      return [];
    }
    return this;
  }

  private eitherFunction = (error: Error, monadValue: any) => {
    // tslint:disable-next-line:no-console
    console.error(error);
    return [];
  }

  private setType(monadType: string) {
    this.monadType = monadType;
    return this;
  }

  get value(): T {
    return this.monadValue;
  }
  get either() {
    return this.eitherFunction;
  }
  private get type() {
    return this.monadType;
  }
  private set type(monadType: string) {
    this.monadType = monadType;
  }

  private isNothing(): boolean {
    if (Array.isArray(this.monadValue)) {
      return this.monadValue.length === 0;
    }
    return this.value === null || this.type === 'Nothing';
  }
}
