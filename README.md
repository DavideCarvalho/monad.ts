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

Aaand we can't forget, you can chain flatMap with map
```typescript
const myMonad: Monad<number[][]> = Monad.of([[1], [], [4, 5, 6]]);
const f = (x: number) => x + 1;
const g = (x: number) => x * 2;
const mappedMonad: Monad<number[]> = myMonad.flatMap(f).bind(g);
console.log(mappedMonad.value); // [4, 6, 8, 10, 12, 14]
```
