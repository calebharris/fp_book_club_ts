# Chapter 5. Strictness and laziness

Recall `List` operations from [Chapter 3](chapter_3.html): `map`, `filter`, `foldLeft`, `foldRight`, `zipWith`, etc.
Each one passes over the whole input list and outputs a freshly-created list. For example, each transformation in the
following code produces a new list, and each of these lists (except the last one) is discarded almost immediately after
being created.

```typescript
> List(1,2,3,4).map(x => x + 10).filter(x => x % 2 === 0).map(x => x * 3)
List(36, 42)
```

::: tip Note
"Whoa, wait a minute," you might be thinking. "Our `List` commands did not look like this, and did not produce nice,
clean console output like this." That's true, because we wrote all our `List` functions at the top level of the module,
rather than defining them on a parent class like we did for `Option` and `Either`. We're going to use `List` a lot, so
as an exercise, you might want to go back and update the code to enable the more object-oriented syntax. Hint: You can
do this without deleting any of the existing `List` functions!

The nice output comes from the [custom inspection function][node_inspect] capability supported by Node. Check out the
`List` source in the online repository for details.
:::

We'd like to fuse these operations together into a single pass and avoid creating the intermediate temporary data
structures. We could accomplish this by writing a one-off `while` loop, but that wouldn't be reusable. It would be
better if we could have this done automatically while retaining the same high-level, composable style we've been
developing.

We can achieve this automatic loop fusion through the use of *non-strictness*, also called *laziness*. In this chapter,
we'll work through the construction of a lazy list type that fuses transformations, and see how non-strictness is a
fundamental technique for writing more efficient and modular functional programs in general.

## Strict and non-strict functions

Non-strictness is a property of a function that means the function may choose not to evaluate some or all of its
arguments. Strict functions, as you may guess, always evaluate their arguments. Although you may not have heard about
function strictness, you are probably already familiar with the behavior. In certain cases, we call it
*short-circuiting*. Many languages, including TypeScript, have the short-circuiting boolean operators `&&` and `||`. The
operator `&&` only evaluates its second argument if its first is `true`, while `||` only evaluates its second argument
if its first is `false`.

``` typescript
> false && console.log("Hey!"); // doesn't print anything
false

> true || console.log("Hey!"); // doesn't print anything, either
true
```

The `if-else` construct in TypeScript is also non-strict. The `else` block is only evaluated when the condition in the
`if` block is false, and the `if` block only when the condition is true.

``` typescript
> if (true) console.log("Hello") else console.log("Goodbye");
Hello
undefined
```

More precisely, `if` is strict in its condition parameter, since it always evaluates the condition in order to know
which branch to execute, and non-strict in its two branches.

TypeScript lacks explicit support for writing functions with non-strict parameters. However, there is a simple
work-around. Consider the following non-strict `if` function:

``` typescript
const if2 = <A>(cond:    boolean,
                onTrue:  () => A,
                onFalse: () => A): A =>
  cond ? onTrue() : onFalse();
```

Our `if2` function takes three arguments, just like a standard `if` expression: a condition, what to do if the condition
is true, and what to do if the condition is false. Notice the type of the branch arguments: `() => A`. In other words,
they are functions that take zero arguments and return a value. Recall from [Chapter 4](chapter_4.html#_4-thunks) that
another name for this type of function is a *thunk* and that one of the uses of a thunk is to allow for lazy evaluation.
Oh, we just solved the problem! When `if2` is called, technically all its arguments will be evaluated immediately. It
just so happens that two of those arguments evaluate to anonymous functions, only one of which will be eventually
executed. We sometimes call executing a thunk *forcing* the thunk.

One small problem with our solution is that we now have to execute a function, which potentially uses significant
resources to compute, any time we want to use our non-strict parameter.

``` typescript
> const maybeTwice = (b: boolean, i: () => number) => b ? i() + i() : 0;
> maybeTwice(true, () => { console.log("hi"); return 1 + 41 });
hi
hi
84
```

We could cache the result of the thunk in a variable the first time we use it, but that can become unwieldy in
situations with multiple branches. It would be better if we had a way to automatically cache the result when the thunk
is first executed and return the cached value for subsequent invocations. This technique is called *memoization*, and we
can add a small function to our `util` module to help us do it.

``` typescript
const memoize = <A>(f: () => A): () => A => {
  // in strict mode, TypeScript will not allow variables to be `null`
  // unless explicitly allowed in the type annotation
  let memo: A | null = null;
  return () => {
    if (memo === null)
      memo = f();
    return memo;
  };
};
```

Now if we refactor `maybeTwice` to use `memoize`, we can see that it only executes the thunk once.

``` typescript
> import util from "./fpbookclub/getting_started/util";
{}
> const maybeTwice = (b: boolean, i: () => number) => {
... const i2 = util.memoize(i);
... return b ? i2() + i2() : 0;
... }
undefined
> maybeTwice(true, () => { console.log("hi"); return 41 + 1 })
hi
84
```

::: tip Formal definition of strictness

If the evaluation of an expression runs forever or throws an error instead of returning a definite value, we say that
the expression doesn’t *terminate*, or that it evaluates to *bottom*. A function `f` is strict if the expression `f(x)`
evaluates to bottom for all `x` that evaluate to bottom.
:::

One more piece of terminology: we can say that a function takes its non-strict arguments *by name*, rather than *by
reference* or *by value*.

## An extended example: lazy lists

Back to the problem at hand (remember that?). How can we construct a list-like data type that uses laziness and
non-strictness to help us improve the modularity and efficiency of our functional programs? Below is a listing for a
simple *lazy list*, or *stream* type. It should look very similar to the `List` type from
[Chapter 3](chapter_3.html#defining-functional-data-structures) (especially if you've gone back and done the refactoring
suggested above), but with a few notable differences.

``` typescript
import util from "../getting_started/util";

/**
 * A `Stream` element is either an `Empty` or a `Cons`, analagous to the `Nil`
 * and `Cons` data constructors of `List`.
 */
export type Stream<A> = Empty<A> | Cons<A>;

/**
 * Base trait for `Stream` data constructors
 */
abstract class StreamBase<A> { }

/**
 * `Empty` data constructor, which creates the singleton `Empty` value that
 * we'll always use.
 */
export class Empty<A> extends StreamBase<A> {
  static readonly EMPTY: Stream<never> = new Empty();

  readonly tag: "empty" = "empty";

  private constructor() {
    super();
  }
}

/**
 * A nonempty stream consists of a head and a tail, both of which are
 * non-strict
 */
export class Cons<A> extends StreamBase<A> {
  readonly tag: "cons" = "cons";

  constructor(readonly h: () => A, readonly t: () => Stream<A>) {
    super();
  }
}

/**
 * Smart constructor for creating a nonempty Stream
 */
export const cons = <A >(hd: () => A, tl: () => Stream<A>): Stream<A> =>
  // We cache the head and tail using `memoize` to avoid repeated evaluation
  new Cons(util.memoize(hd), util.memoize(tl));

/**
 * Smart constructor for creating an empty Stream of a particular type
 */
export const empty = <A>(): Stream<A> => Empty.EMPTY;

/**
 * Convenience method for constructing a Stream from multiple elements
 */
export const Stream = <A>(...aa: A[]): Stream<A> => {
  if (aa.length === 0)
    return empty();
  else
    return cons(() => aa[0], () => Stream(...aa.slice(1)));
};

export default { Cons, Empty, Stream, cons, empty };
```

The main difference from `List` is that the `Cons` data constructor takes thunks for the `head` and `tail` parameters,
instead of regular strict values. If we want to use the head or traverse the stream, we need to explicity force the
thunks, just like we did in our revised `if2` function. For example, here's a method that optionally extracts the head
of a `Stream` (in case it isn't clear, this should be defined on the `StreamBase` class):

``` typescript
headOption(this: Stream<A>): Option<A> {
  if (this.tag === "empty")
    return none();
  return some(this.h());
}
```

Other than forcing the head thunk, this works pretty much the same way the `List` version does. This ability of a
`Stream` to evaluate only the portion of itself needed in the moment is key to enabling composable, yet efficient, code.

### Memoizing streams and avoiding recomputation

Typically, we want to cache the value of a `Cons` node, once it has been forced. But if we use the `Cons` data
constructor directly, this code will compute `expensive` twice:

``` typescript
const x = Cons(() => expensive(), tl);
const h1 = x.headOption();
const h2 = x.headOption();
```

We get around this problem by using smart constructors, which we first encountered in
[Chapter 4](chapter_4.html#_10-smart-constructors). Smart constructors can construct data types while enforcing some
additional invariants or providing slightly different signatures than the "real" constructors used for pattern matching.
Our `cons` smart constructor takes care of memoizing the non-strict arguments for the head and tail of the `Cons`,
ensuring that the thunks do their work only the first time they are forced.

``` typescript
const cons = <A >(hd: () => A, tl: () => Stream<A>): Stream<A> =>
  new Cons(util.memoize(hd), util.memoize(tl));
```

Our `empty` smart constructor just returns the `Empty.EMPTY` singleton value, but is annotated with `Stream<A>`, which
helps the TypeScript compiler perform better type inferencing in some cases. When dealing with ADTs, we almost always
want to infer the base type. Defining smart constructors that return the base type is a common trick.

### Helper functions for inspecting streams

Let's start by writing a few functions to help us inspect what's inside our `Stream`s, which will make later exercises
easier.

### Exercise 5.1. `toList`

Write a function that converts a `Stream` to a `List`, which will force its evaluation and let you look at it in the
REPL. Place this and other functions inside the `StreamBase` class.

``` typescript
toList(): List<A>
```

### Exercise 5.2. `take` and `drop`

Write the function `take(n)`, which returns the first `n` elements of a `Stream`; and `drop(n)`, which skips the first
`n` elements of a `Stream`.

```typescript
take(n: number): Stream<A>

drop(n: number): Stream<A>
```

### Exercise 5.3. `takeWhile`

Write a function `takeWhile` for returning the longest prefix of a `Stream` whose elements match the provided predicate.

``` typescript
takeWhile(p: (a: A) => boolean): Stream<A>
```

You can use these functions together to inspect streams in the REPL. For example, try

``` typescript
> Stream(1, 2, 3).take(2).toList()
```

[node_inspect]: https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_custom_inspection_functions_on_objects
"Util | Node.js Documentaiton"
