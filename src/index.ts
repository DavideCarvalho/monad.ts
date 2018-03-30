export default class Monad<T> {

  public static of<U>(object: U): Monad<U> {
    return new Monad<U>(object);
  }

  private monadValue: T;
  private monadType: string = 'Maybe';

  private constructor(object: T) {
    this.monadValue = object;
    this.isNothing() ? this.monadType = 'Nothing' : this.monadType = 'Maybe';
  }

  // tslint:disable-next-line:no-shadowed-variable
  public flatMap<T>(fn: ((x: any) => any)): Monad<T> {
    this.monadValue = [].concat.apply([], this.monadValue);
    return this.bind(fn);
  }

  // tslint:disable-next-line:no-shadowed-variable
  public bind<T>(fn: ((x: any) => any)): Monad<T> {
    if (this.isNothing()) {
      return Monad.of([]);
    }
    const newMonad = this.mapMonad(fn);
    newMonad.either = this.eitherFunction;
    return newMonad;
  }

  public getMonadType(): string  {
    return this.monadType;
  }

  private eitherFunction = (error: Error, monadValue: any) => {
    // tslint:disable-next-line:no-console
    console.error(error);
    return [];
  }

  get value(): T {
    return this.monadValue;
  }
  get either() {
    return this.eitherFunction;
  }
  set either(fn: ((error: any, monadValue: any) => any)) {
    this.eitherFunction = fn;
  }
  private get type() {
    return this.monadType;
  }
  private set type(monadType: string) {
    this.monadType = monadType;
  }

  private mapMonad(fn: ((x: any) => any)) {
    if (Array.isArray(this.monadValue)) {
      return this.mapMonadIfIsArray(fn);
    }
    return this.mapMonadIfIsSingleValue(fn);
  }

  private mapMonadIfIsArray(fn: ((x: any) => any)) {
    try {
      return Monad.of(this.monadValue.map(fn));
    } catch (e) {
      const monadNothing = Monad.of(this.eitherFunction(e, this.monadValue));
      monadNothing.type = 'Nothing';
      return monadNothing;
    }
  }

  private mapMonadIfIsSingleValue(fn: ((x: any) => any)) {
    try {
      return Monad.of(fn(this.monadValue));
    } catch (e) {
      const monadNothing = Monad.of(this.eitherFunction(e, this.monadValue));
      monadNothing.type = 'Nothing';
      return monadNothing;
    }
  }

  private isNothing(): boolean {
    if (Array.isArray(this.monadValue)) {
      return this.monadValue.length === 0;
    }
    return this.value === null || this.type === 'Nothing';
  }
}
