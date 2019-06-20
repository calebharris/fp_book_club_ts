# Chapter 5. Strictness and laziness

Recall `List` operations from [Chapter 3](chapter_3.html): `map`, `filter`, `foldLeft`, `foldRight`, `zipWith`, etc.
Each one passes over the whole input list and outputs a freshly-created list. For example, each transformation in the
following code produces a new list, and each of these lists (except the last one) is discarded almost immediately after
being created.

``` typescript
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

??? answer
``` typescript
toList(this: Stream<A>): List<A> {
  if (this.tag === "empty")
    return list.nil();

  return list.cons(this.h(), this.t().toList());
}
```
???

### Exercise 5.2. `take` and `drop`

Write the function `take(n)`, which returns the first `n` elements of a `Stream`; and `drop(n)`, which skips the first
`n` elements of a `Stream`.

``` typescript
take(n: number): Stream<A>

drop(n: number): Stream<A>
```

??? answer
``` typescript
take(this: Stream<A>, n: number): Stream<A> {
  if (this.isEmpty() || n <= 0)
    return empty();

  // Needed to work around an issue in Typescript's type inferencing
  const self = this;
  return cons(this.h, () => self.t().take(n - 1));
}

drop(this: Stream<A>, n: number): Stream<A> {
  if (n <= 0 || this.isEmpty())
    return this;
  return this.t().drop(n - 1);
}
```
???

### Exercise 5.3. `takeWhile`

Write a function `takeWhile` for returning the longest prefix of a `Stream` whose elements match the provided predicate.

``` typescript
takeWhile(p: (a: A) => boolean): Stream<A>
```

??? answer
``` typescript
takeWhile(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
  if (this.isEmpty() || !p(this.h()))
    return empty();

  const self = this;
  return cons(this.h, () => self.t().takeWhile(p));
}
```
???

You can use these functions together to inspect streams in the REPL. For example, try

``` typescript
> Stream(1, 2, 3).take(2).toList()
```

## Separating program description from execution

*Separation of concerns* is a phrase you've probably heard &mdash; it's a major theme in just about every subdiscipline
of software engineering. Functional programming is particularly concerned with separating the description of
computations from the act of running them. `Option` and `Either`, at their cores, are ways of describing that a
computation can result in an error, or more than one type of value. `Stream` lets us describe a computation that emits a
sequence of results, but doesn't compute any individual result until it's needed.

This is the power of laziness in general: we can describe a much larger computation than we need and then choose to
evaluate only parts of it. An example is the `exists` function for `Stream`:

``` typescript
exists(this: Stream<A>, p: (a: A) => boolean): boolean {
  if (this.isEmpty())
    return false;

  // necessary to work around a quirk of Typescript's type inferencing
  const self = this;
  return p(self.h()) || self.t().exists(p);
}
```

Recall from earlier that `||` is a short-circuiting operator. In other words, it's non-strict in its second argument. So
if `p(self.h())` is true, then `self.t()` is never evaluated. Not only does the traversal terminate early, but the
remainder of the `Stream` is never actually computed!

The version of `exists` above uses explicit recursion. But, just like with we did in
[Chapter 3](/chapter_3.html#recursion-over-lists-and-generalizing-to-higher-order-functions) with `List`, we can define
general-purpose recursion utilities for `Stream` and implement other functions on top of those utilities.

``` typescript
foldRight<B>(this: Stream<A>, z: () => B, f: (a: A, b: () => B) => B): B {
  if (this.isEmpty())
    return z();

  const self = this;
  return f(self.h(), () => self.t().foldRight(z, f));
}
```

Above is a lazy version of `foldRight`, which is non-strict in its first (a.k.a. "zero") argument, and takes a combiner
function that is non-strict in its second argument. This means that `f` can choose not to execute the thunk for its
second argument. If it does so, then the recursion terminates early. Implementing `exists` in terms of `foldRight`
illustrates this:

``` typescript
exists(this: Stream<A>, p: (a: A) => boolean): boolean {
  return this.foldRight(() => false, (a, b) => p(a) || b());
}
```

Here `b` is a thunk that, when evaluated, generates the tail of the `Stream`. If `p(a)` returns true, the thunk is never
called and the computation terminates without building the rest of the `Stream`. Remember that with the strict version
of `foldRight` in `List`, we couldn't do that.

### Exercise 5.4. `forAll`

Implement `forAll`, which checks that all elements in the `Stream` match a given predicate. It should terminate the
traversal as soon as it finds a nonmatching element.

``` typescript
forAll(this: Stream<A>, p: (a: A) => boolean): boolean { ... }
```

??? answer
``` typescript
forAll(this: Stream<A>, p: (a: A) => boolean): boolean {
  if (this.isEmpty())
    return false;
  return this.foldRight(() => true, (a, b) => p(a) && b());
}
```
???

### Exercise 5.5. `takeWhile` using `foldRight`

Refactor `takeWhile` to use `foldRight`.

??? answer
``` typescript
takeWhile(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
  return this.foldRight(() => empty(),
    (a, b) => p(a) ? cons(() => a, b) : b(),
  );
}
```
???

### Exercise 5.6. `headOption` using `foldRight`

Refactor `headOption` to use `foldRight`.

??? answer
``` typescript
headOption(this: Stream<A>): Option<A> {
  return this.foldRight(() => none(), (a, b) => some(a));
}
```
???

### Exercise 5.7. Additional `Stream` functions

Implement `map`, `filter`, `append`, and `flatMap` using `foldRight`. The `append` method should be non-strict in its
argument.

??? answer
``` typescript
// first, here's `append`, upon which we'll build several other solutions
append(this: Stream<A>, that: () => Stream<A>): Stream<A> {
  return this.foldRight(that, (a, b) => cons(() => a, b));
}

flatMap<B>(this: Stream<A>, f: (a: A) => Stream<B>): Stream<B> {
  return this.foldRight(() => empty(), (a, b) => f(a).append(b));
}

map<B>(this: Stream<A>, f: (a: A) => B): Stream<B> {
  return this.foldRight(() => empty(), (a, b) => Stream(f(a)).append(b));
}

filter(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
  return this.foldRight(
    () => empty(),
    (a, b) => p(a) ? cons(() => a, b) : b(),
  );
}
```
???

Because they use the lazy `foldRight`, these implementations are *incremental*. They do just enough work to provide only
the elements requested by larger computations composed of these functions. That means we can chain them together without
fully instantiating the intermediate results, as is the case with `List`.

Let's rewrite part of the motivating example for this chapter using `Stream`, instead of `List`.

``` typescript
> Stream(1, 2, 3, 4).map(x => x + 10).filter(x => x % 2 === 0).toList()
List(12, 14)
```

What would a trace for this program look like, using the substitution model? An attempt to represent such a trace is
made below, but due to the many thunks involved, it may be hard to read. It's worth trying to do this on your own, with
pen and paper, unbound by the confines of Web typography. Although `map` and `filter` are defined in terms of
`foldRight`, we've chosen to treat them as if they used explicit recursion in this trace, to make it easier to follow.

``` typescript
Stream(1, 2, 3, 4).map(x => x + 10).filter(x => x % 2 === 0).toList()

// substitute result of `Stream` function
cons(() => 1, () => Stream(2, 3, 4))
    .map(x => x + 10)
    .filter(x => x % 2 === 0)
    .toList()

// `map` forces the first element, transforms it, and wraps the tail
// in a recursive call
cons(() => 11, () => Stream(2, 3, 4).map(x => x + 10))
    .filter(x => x % 2 === 0)
    .toList()

// `filter` forces the new, mapped first element, and then discards it,
// because it doesn't pass the predicate. In this case, `filter`
// evaluates and immediately calls itself on the tail. Notice at this
// point, we've decided we don't need the first element, and we've
// thrown it away, without executing `toList` yet!
Stream(2, 3, 4).map(x => x + 10).filter(x => x % 2 === 0).toList()

// Now we start over. Substituting `cons` for `Stream` isn't particularly
// interesting, so we'll stop showing it as a separate step from now on.
// Apply `map` to the new head.
cons(() => 12, () => Stream(3, 4).map(x => x + 10))
    .filter(x => x % 2 === 0)
    .toList()

// Now when `filter` obtains the head, it passes the predicate, so it
// returns a structure with a recursive call, rather than just the
// tail.
cons(() => 12, () => Stream(3, 4).map(x => x + 10).filter(x => x % 2 === 0))
    .toList()

// This is a slightly stylized substitution of the `toList()` call
List(12, Stream(3, 4).map(x => x + 10).filter(x => x % 2 === 0).toList())

// Now we're starting over again, but this as part of a recursive call
// inside `toList`. Apply `map` to the third element.
List(
    12,
    cons(() => 13, Stream(4).map(x => x + 10))
        .filter(x => x % 2 === 0).toList()
)

// Filter discards this element, too.
List(12, Stream(4).map(x => x + 10).filter(x => x % 2 === 0).toList())

// Apply `map` to the last element
List(
    12,
    cons(() => 14, () => Stream().map(x => x + 10))
        .filter(x => x % 2 === 0).toList()
)

// Apply `filter` to the last element
List(
    12,
    cons(() => 14, () => Stream().map(x => x + 10).filter(x => x % 2 === 0))
      .toList()
)

// Apply `toList` to the last element
List(12, 14, Stream().map(x => x + 10).filter(x => x % 2 === 0))

// `map` and `filter` have no more work to do. The empty stream
// becomes the empty `list`, as per `toList`.
List(12, 14)
```

Notice how the executions of `map` and `filter` alternate, and how no intermediate stream is ever fully instantiated.
The effect is the same as if we'd written a custom loop. We managed to compose an efficient computation from a few
simple combinators. We can do so in many more interesting ways, without having to worry about doing more processing than
necessary. As a simple example, we can write `find`, which returns the first matching element from a stream, in way that
terminates early while re-using `filter`:

``` typescript
find(this: Stream<A>, p: (a: A) => boolean): Option<A> {
  return this.filter(p).headOption();
}
```

## Infinite streams and corecursion

As we said earlier, these functions are incremental, so they can work for *infinite streams*, like this one:

``` typescript
const ones: Stream<number> = cons(() => 1, () => ones);
```

The functions we've written so far only inspect the portion of the stream necessary to perform the requested
computation, so we can use them to operate on infinite streams like `ones` without fear of initiating an execution that
never ends. For example:

``` typescript
> ones.take(5).toList()
List(1, 1, 1, 1, 1)

> ones.exists(x => x % 2 !== 0)
true
```

Try playing around with these examples:

* `ones.map(x => x + 1).exists(x => x % 2 === 0)`
* `ones.takeWhile(x => x === 1)`
* `ones.forAll(x => x !=== 1)`

In each of these cases, we get back an answer immediately. Did any of them surprise you? We need to be careful with our
newfound power, however. It's easy to write an expression that never terminates or isn't stack-safe. For example,
`ones.forAll(x => x === 1)` will eventually cause a stack overflow, since it will never find an element that fails the
predicate (i.e. isn't equal to 1) and terminates the recursion.

Let's get more familiar with `Stream` by writing some more functions for it.

### Exercise 5.8. `constant`

Generalize `ones` into an infinite stream of any value.

``` typescript
constant<A>(a: A): Stream<A>
```

??? answer
``` typescript
export const constant = <A>(a: A): Stream<A> =>
  cons(() => a, () => constant(a));
```
???

### Exercise 5.9. `fromN`

Write a function that generates an infinite stream of integers, starting from the given value `n`, then `n + 1`, `n +
2`, and so on. We would call this `from`, but that is a reserved word in TypeScript.

``` typescript
fromN(n: number): Stream<number>
```

??? answer
``` typescript
export const fromN = (n: number): Stream<number> => cons(() => n, () => fromN(n + 1));
```
???

### Exercise 5.10. `fibs`

Write the function `fibs`, which generates an infinite stream of Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8, and so on.

``` typescript
fibs(): Stream<number>
```

??? answer
``` typescript
export const fibs = (): Stream<number> => {
  const go = (n: number, m: number): Stream<number> =>
      cons(() => n, () => go(m, n + m));
  return go(0, 1);
};
```
???

### Exercise 5.11. `unfold`

Write a more general stream-building function, `unfold`, which takes an initial state and a function for producing both
the next state and the next value in the generated stream.

``` typescript
unfold<A, S>(z: S, f: (s: S) => Option<[A, S]>): Stream<A>
```

??? answer
``` typescript
export const unfold = <A, S>(z: S, f: (s: S) => Option<[A, S]>): Stream<A> =>
  f(z)
    .map(([a, s1]) => cons(() => a, () => unfold(s1, f)))
    .getOrElse(() => empty());
```
???

The `unfold` function &mdash; along with `ones`, `constant`, `fromN`, and `fibs` &mdash; is an example of *corecursion*,
which is the dual to the concept of *recursion*. Where recursive functions consume data, corecursive functions produce
data.  Recursive functions, such as `foldRight`, use an existing data structure and work their way down to a base case
in order to terminate. In contrast, corecursive functions produce new data structures and do not need to terminate as
long as they remain *productive*, meaning that we can evaluate more of the result in a finite time period.

### Exercise 5.12. `fibs`, `fromN`, and `constant` in terms of `unfold`

Write `fibs`, `fromN`, and `constant` in terms of `unfold`.

??? answer
``` typescript
export const fibs = (): Stream<number> =>
  unfold(
    [0, 1],
    // Here we need to pass explicit types to `some()`, because TypeScript's
    // type inferencing can't tell from just an array value if we mean
    // "array" or "tuple".
    ([n1, n2]) => some<[number, [number, number]]>([n1, [n2, n2 + n1]]),
  );

export const fromN = (n: number): Stream<number> =>
  unfold(n, s => some<[number, number]>([s, s + 1]));

export const constant = <A>(a: A): Stream<A> =>
  unfold(a, s => some<[A, A]>([a, a]));
```
???

::: tip Sharing in streams
When we rewrite `constant` in terms of `unfold`, we lose sharing. Using explicit recursion, `constant` consumes a
constant amount of memory, but the implementation using `unfold` does not. We don't typically rely on sharing when
programming with streams, because it's fragile and not tracked by the types. For example, we destroy sharing with a
simple call to `map`, even in the case of `ones.map(x => x)`.
:::

### Exercise 5.13. `map`, `take`, `takeWhile`, `zipWith`, and `zipAll` in terms of `unfold`

Write `map`, `take`, `takeWhile`, `zipWith` (as in [chapter 3](chapter_3.html#exercise-3-23-zipwith)), and `zipAll` in
terms of `unfold`. `zipAll` should continue its traversal so long as either stream has more elements. It produces a
stream of `Option` tuples to indicate whether each stream has been exhausted.

``` typescript
zipAll<B>(this: Stream<A>,
          that: Stream<B>): Stream<(Option<A>, Option<B>)> { ... }
```

??? answer
``` typescript
  map<B>(this: Stream<A>, f: (a: A) => B): Stream<B> {
    return unfold(this, s => {
      if (s.isEmpty())
        return none();
      else
        return some<[B, Stream<A>]>([f(s.h()), s.t()]);
    });
  }

  take(this: Stream<A>, n: number): Stream<A> {
    return unfold<A, [Stream<A>, number]>([this, n], ([s, m]) => {
      if (s.isEmpty() || m <= 0)
        return none();
      else
        return some<[A, [Stream<A>, number]]>([s.h(), [s.t(), m - 1]]);
    });
  }

  takeWhile(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
    return unfold(this, s => {
      if (s.isEmpty() || !p(s.h()))
        return none();
      else
        return some<[A, Stream<A>]>([s.h(), s.t()]);
    });
  }

  zipWith<B, C>(this: Stream<A>,
                sb: Stream<B>,
                f: (a: A, b: B) => C): Stream<C> {
    return unfold<C, [Stream<A>, Stream<B>]>([this, sb], ([sa1, sb1]) => {
      if (sa1.isEmpty() || sb1.isEmpty())
        return none();
      else
        return some<[C, [Stream<A>, Stream<B>]]>(
          [f(sa1.h(), sb1.h()), [sa1.t(), sb1.t()]],
        );
    });
  }

  // For zipAll, it's helpful to write an additional combinator that returns
  // the head and tail of a stream simultaneously. The head might not exist,
  // so we need to wrap it in an `Option`, just like `headOption`.
  shift(this: Stream<A>): [Option<A>, Stream<A>] {
    return [this.headOption(), this.drop(1)];
  }

  zipAll<B>(this: Stream<A>, sb: Stream<B>): Stream<[Option<A>, Option<B>]> {
    const sa = this;
    return unfold<[Option<A>, Option<B>], [Stream<A>, Stream<B>]>(
      [sa, sb],
      ([sa1, sb1]) => {
        const [maybeLH, leftT] = sa1.shift();
        const [maybeRH, rightT] = sb1.shift();
        if (maybeLH.tag === "none" && maybeRH.tag === "none")
          return none();
        else
          return some<[[Option<A>, Option<B>], [Stream<A>, Stream<B>]]>(
            [[maybeLH, maybeRH], [leftT, rightT]],
          );
      },
    );
  }
```
???

Recall the `hasSubsequence` exercise at the end of [chapter 3](chapter_3.html#exercise-3-24-hassubsequence). Our
solution had no way to terminate early. So even if we had `List(1, 2, ..., 1000).hasSubsequence(List(1))`,
`hasSubsequence` had to traverse all 1000 elements, even after immediately locating the subsequence `1`. Now that we
have a more versatile tool in `Stream`, let's try to assemble `hasSubsequence` out of existing `Stream` functions. Is it
possible? Are we missing any combinators that would make this easier?

### Exercise 5.14. `startsWith`

Implement `startsWith`, which checks to see if one `Stream` is the prefix of another, using functions we've already
written. For example, `Stream(1, 2, 3).startsWith(Stream(1, 2)) === true`.

``` typescript
startsWith(this: Stream<A>, that: Stream<A>): boolean { ... }
```

??? answer
``` typescript
  startsWith(this: Stream<A>, that: Stream<A>): boolean {
    return (
      this.
      // combine `this` and `that` into a stream of Option pairs
      zipAll(that).
      // drop all pairs for which the contents are equal
      dropWhile(([lo, ro]) =>
        lo.flatMap(l =>
          ro.map(r => r === l),
        ).getOrElse(() => false),
      ).
      // fetch the first of the remaining pairs, if any
      headOption().
      // if there are no remaining pairs, or if `that` has been consumed (i.e.
      // the right side of the pair is `None`), then `that` was a prefix of
      // `this` and we should return `true`
      flatMap(([lo, ro]) => ro).
      tag === "none"
    );
  }
```
???

### Exercise 5.15. `tails`

Implement `tails` using `unfold`. For a given `Stream`, `tails` returns the `Stream` of suffixes of the input sequence,
starting with the original `Stream`. For example:

``` typescript
tails(this: Stream<A>): Stream<Stream<A>> { ... }

> Stream(1, 2, 3).tails()
Stream(Stream(1, 2, 3),
       Stream(2, 3),
       Stream(3),
       Stream())
```

Now, we have all the tools we need to implement `hasSubsequence`:

``` typescript
hasSubsequence(this: Stream<A>, that: Stream<A>): boolean {
  return this.tails().exists(s => s.startsWith(that));
}
```

This implementation performs the same number of steps as would a monolithic, procedural version that used nested loops
with specialized logic for breaking out when the subsequence was found. By using laziness, we've preserved this
efficiency while still being able to compose the function from smaller, simpler components.

### Exercise 5.16. `scanRight`

Generalize `tails` to the function `scanRight`, which is like a `foldRight` that returns a `Stream` of the intermediate
results. For example:

``` typescript
scanRight<B>(this: Stream<A>, z: () => B, f: (a: A, b: () => B)): Stream<B>

> Stream(1, 2, 3).scanRight(() => 0, (a, b) => a + b()).toList()
List(6, 5, 3, 0)
```

The result is the equivalent to the expression `List(1 + 2 + 3 + 0, 2 + 3 + 0, 3 + 0, 0)`. In other words, the function
behaves as if it "scans" the input stream from left to right and returns the result of folding right starting from each
position. Your function should reuse the intermediate results so that traversing a `Stream` of `n` elements always takes
time linear in `n`. Can you implement `scanRight` in terms of `unfold`? How, or why not? What about a different function
we've written?

## Summary

In this chapter, we introduced non-strictness as a fundamental technique for building functional programs that are
efficient while maintaining the modularity we enjoyed when composing strict functions. We can think of non-strictness as
an optimization on functional programming, but it can do much more. Non-strictness lets us separate the description of a
computation from how and when it gets executed. If we can successfully separate these concerns, then we can reuse
descriptions in different contexts and evaluate different bits of our program to obtain partial results. We couldn't do
that when writing only strict code.

[node_inspect]: https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_custom_inspection_functions_on_objects
"Util | Node.js Documentation"
