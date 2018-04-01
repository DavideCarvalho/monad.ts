# monad.ts
> Monad Structure for TypeScript

Monad.ts is a lib capable of giving to TypeScript the ability of having safe IO.
If you don't know what a monad is, I recommend you to [read about it.](https://medium.com/javascript-scene/javascript-monads-made-simple-7856be57bfe8)

Use this lib is quite simple! You only need to import Monad and encapsulate your object inside it.

```typescript
import Monad from 'MonadTs';
const myMonad: Monad<string> = Monad.of('Hello World');
```

When encapsulated, you have some methods to make operations on your monad.

### ```bind(fn(x: any) => any): Monad<T>```

This method takes a function as argument and returns a new Monad with your desired type.

```typescript
const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
const f = (x: number) => x + 1;
const mappedMonad: Monad<number[]> = myMonad.bind(f);
console.log(mappedMonad.value) // [2, 3, 4, 5 , 6]
```

Since this method returns another Monad, you can chain methods like this:
```typescript
const myMonad: Monad<number[]> = Monad.of([1, 2, 3, 4, 5]);
const f = (x: number) => x + 1;
const g = (x: number) => x * 2;
const mappedMonad: Monad<number[]> = myMonad.bind(f).bind(g);
console.log(mappedMonad.value) //[4, 6, 8, 10, 12]
```

And of course, you can change the type of your Monad based on your operations
```typescript
const myMonad: Monad<number> = Monad.of(1);
const f = (x: number): string => x.toString();
const mappedMonad: Monad<string> = myMonad.bind(f);
console.log(typeof mappedMonad.value) //string
```

### ```flatMap(fn(x: any) => any): Monad<T>```
As you can see, bind and flatMap receives and returns the same stuff, there is only one little diference between them: While map
operates in a single object (like an array of objects), flatMap can take several values (like an array of arrays), join them in a 
single object and then operate, e.g:

```typescript
const myMonad: Monad<number[][]> = Monad.of([[1], [2, 3], [4, 5, 6]]);
const f = (x: number) => x + 1;
const mappedMonad: Monad<number[]> = myMonad.flatMap(f);
console.log(mappedMonad.value) //[2, 3, 4, 5, 6, 7]
```

If your array has any empty array, it will be unnoticed
```typescript
const myMonad: Monad<number[][]> = Monad.of([[1], [], [4, 5, 6]]);
const f = (x: number) => x + 1;
const mappedMonad: Monad<number[]> = myMonad.flatMap(f);
console.log(mappedMonad.value); // [2, 5, 6, 7]
```

Aaand we can't forget, you can chain flatMap with bind
```typescript
const myMonad: Monad<number[][]> = Monad.of([[1], [], [4, 5, 6]]);
const f = (x: number) => x + 1;
const g = (x: number) => x * 2;
const mappedMonad: Monad<number[]> = myMonad.flatMap(f).bind(g);
console.log(mappedMonad.value); // [4, 6, 8, 10, 12, 14]
```

### ```either(e: Error, monadValue: any):any```
This either function is like a catch. You can define what the monad will do in case your operation throws something. This either function has to return something, otherwhise it will stop your chain.
Either function receives the error and the Monad value of the bind that just throwed an error, so you do something in case of error.

```typescript
(error: Erorr, monadValue):any => {console.log(e); return []}
```
This is the default either. It will log your error and return an empty array, e.g:

for this example, we'll create two interfaces:
```typescript
interface SonJson{ 
  name: string;
  parents: ParentsJson;
}

interface ParentsJson {
  dad: string;
  mother: string
}
```

```typescript
const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
const f = (x: SonJson):ParentsJson => x.parents;
const g = (x: any):string => x.test;
const h = (x: string):number => x.length;
const mappedMonad = myMonad.bind(f).bind(g).bind(h);
console.log(mappedMonad.value); // []
```
In the example above, g function will look for an attribute called test. Since this attribute doesn't exist, it will return undefined. After that, h function will try to get the length of undefined, so it will give you an error. To stop the error from spreading and stoping our application, either will return an empty array.


Either will work and make your bindings go all the way until the end even if an error happened on your third bind and you have 4 binds, like this:
```typescript
const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}});
const f = (x: SonJson):ParentsJson => x.parents;
const g = (x: any):string => x.teste;
const h = (x: string):number => x.length;
const j = (x: number):number => x*x
const mappedMonad = myMonad.bind(f).bind(g).bind(h).bind(j);
console.log(mappedMonad.value) // []
```

To define a custom either function, you only need to do:
```typescript
const customEither = (error, monadValue) => {console.log('customEither'); return ''};
const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}}).setEither(customEither);
const f = (x: SonJson):ParentsJson => x.parents;
const g = (x: any):string => x.teste;
const h = (x: any):number => x.length;
const mappedMonad = myMonad.bind(f).bind(g).bind(h);
console.log(mappedMonad.value); // ''
```

You can also call setEither in the middle of a chain of bindings, this is really helpful if you want diferent either functions for different bindings
```typescript
const customEitherOne = (error, monadValue) => {console.log('customEitherOne'); return ''};
const customEitherTwo = (error, monadValue) => {console.log('customEitherTwo'); return ''};
const customEitherThree = (error, monadValue) => {console.log('customEitherThree'); return []};
const myMonad: Monad<SonJson> = Monad.of({name: 'Son', parents: {dad: 'Dad', mother:'Mother'}}).setEither(customEither);
const f = (x: SonJson):ParentsJson => x.parents;
const g = (x: any):string => x.teste;
const h = (x: any):number => x.length;
const mappedMonad = myMonad
                    .setEither(customEitherOne)
                    .bind(f)
                    .setEither(customEitherTwo)
                    .bind(g)
                    .setEither(customEitherThree)
                    .bind(h);
console.log(mappedMonad.value); // []
```

## Monad Types
Since Monads can throw error and stop your bind chain (like the cases we saw on either), they have two types to tell if everything ocurred alright or not:
- Maybe: Monad is a Maybe if your value on `Monad.of(value)` is a valid value or your operations ocurred until the end
- Nothing: If you pass a falsey value for Monad.of, like null, our an empty array, your Monad will be Nothing. If an error occured during any of your bindings, the result of your Monad will be a Nothing Monad.

To get the type of your Monad, you can use the method `getMonadType(): string`, and it will return the Monad type as a String.
