# Chapter 3. Functional data structures

We said in the introduction that functional programs don't update variables or modify mutable data structures (except in
iterative loops, of course). So what kinds of data structures *can* we use? *Functional data structures*, of course!
This chapter talks about how we define data types in functional programming and a related logical branching technique
called *pattern matching*. It has a ton of exercises, too, to provide practice writing and generalizing pure functions.
In general, the book is trying to lead us to higher level functional abstractions - things like *monoids*, *functors*,
*monads*, and other structures with weird names borrowed from [category theory][wikip_cat].

## Defining functional data structures

A functional data structure is only operated on with pure functions. Pure functions cannot modify data in place or
perform side effects. Thus, by definition, functional data structures are immutable.

Let's start by talking about everyone's favorite functional data structure - a singly linked list. Of course, we're
going to dive into some new TypeScript syntax, as well.

```typescript
/**
 * list.ts - a functional singly linked list implementation using a
 * discriminated union, a.k.a. algebraic data type (ADT). Based on
 * guidance at
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 **/

/**
 * The "root" definition of our List data type, with one type parameter, `A`.
 * Note that List is defined entirely by its constituent types, using
 * TypeScript's type union syntax, `|`.
 **/
export type List<A> = Cons<A> | Nil;

/**
 * Nil represents the empty list
 **/
export interface Nil {
  tag: "nil";
}

/**
 * Our "data constructor" for Nil, which has only one instance
 **/
export const Nil: Nil = { tag: "nil" };

/**
 * A data constructor representing a link in the list, containing a value in
 * `head` and a pointer to the remainder of the list in `tail`. Every tail is
 * a complete List in its own right, with Nil signifying the "end" of the
 * list.
 **/
export class Cons<A> {
  tag: "cons" = "cons";
  readonly head: A;
  readonly tail: List<A>;

  constructor(head: A, tail: List<A>) {
    this.head = head;
    this.tail = tail;
  }
}

/**
 * Creates a List from a variable number of arguments.
 **/
export function List<A>(...vals: A[]): List<A> {
  if (vals.length === 0) {
    return Nil;
  } else {
    return new Cons(vals[0], List(...vals.slice(1)));
  }
}

/**
 * Uses recursion and pattern matching to add up a list of numbers
 **/
export function sum(ns: List<number>): number {
  switch (ns.tag) {
    // the sum of the empty list is 0
    case "nil": return 0;

    // the sum of a list is the value in the head plus the sum of the tail
    case "cons": return ns.head + sum(ns.tail);
  }
}

/**
 * Multiplies a list of numbers together, using the same technique as `sum`
 **/
export function product(ns: List<number>): number {
  switch (ns.tag) {
    case "nil": return 1.0;
    case "cons":
      if (ns.head === 0.0)
        return 0.0;
      else
        return ns.head * product(ns.tail);
  }
}
```

One bit of new syntax shows up twice in the `List` function: the `...` operator. It's actually two different operators
that happen to look the same and do related things. In `function List<A>(...vals: A[])`, the `...` is the
*rest-parameter* operator. Other languages call this *variadic function* syntax. Either way, the result is a function
that accepts a variable number of arguments of type `A`, which are represented inside the function as an array.

Later, in `List(...vals.slice(1))`, the `...` is called the *spread operator*. If we think of a rest parameter as
"collapsing" a parameter list into an array, then the spread operator does the opposite. It spreads an array into a
parameter list.

If you're familiar with object-oriented programming, and someone asks you to create a data type called `List` with two
implementations, you probably immediately reach for some kind of subtyping, maybe with `List` as the parent interface or
abstract class and two implementors or subclasses, `Nil` and `Cons`. We don't see that in the code above, so what
exactly is going on here?

In FP, we often use a pattern called an *Algebraic Data Type* (ADT), also called a *discriminated union*, to represent
data structures. This kind of structure ends up being more natural to work with than traditional OOP class hierarchies.
It also enables a technique called *pattern matching*, which allows us to get some help from the compiler when writing
functions for ADTs.

TypeScript, being both a "lightweight" language and something of a hybrid beast between OOP and FP, does not directly
support either ADTs or pattern matching, but does have some lower-level features that allow us to "build up" to those
techniques. Strap in, we've got some reading to do.

## Representing algebraic data types in TypeScript

Our goal is to define an ADT that represents a singly linked list. Lists of this kind are useful tools for exploring FP
because they can be defined and constructed recursively: each subpart of the list is itself a list.  Therefore, we need
two variants of our List type: one to represent a link in the list and one to represent the empty list. We call the
variants *data constructors*, and they are `Cons` and `Nil`. The `List` type is defined as the union of `Cons` and
`Nil`.

Now, we could have chosen to create a parent class or interface for `List` and still achieved roughly the same thing. We
didn't do that for a couple reasons. There is no common functionality between `Cons` and `Nil`, so a class isn't really
appropriate.

The reasoning behind not using an interface is a bit more complex. Unlike traditional class hierarchies, an ADT is not
meant to be extended. The "algebraic" descriptor means that our data type is really a formulation of other, known data
types, which cannot be true if there is the possibility of someone else adding a variant to our ADT! So we want a way to
define a closed set of types that allows us to write functions that accept any member of the set and prevents the
addition of new members. Enter TypeScript's union type:

```typescript
type List<A> = Cons<A> | Nil;
```

This declares a type alias named `List`, with one type parameter `A`, that can be either a `Cons<A>` or `Nil`. We cannot
add types to `List` after it has been declared, but we can write functions that accept any `List` value. In the snippet
below, `ns` will be either a `Cons<number>` or `Nil`.

```typescript
function sum(ns: List<number>): number
```

The union type is the first TypeScript feature that we're using to implement an ADT. The second is the *literal type*.
You may have noticed that both `Nil` and `Cons` have a property called `tag`, each with an unusual type annotation:
`"nil"` and `"cons"`, respectively. The code `tag: "nil"` declares the `tag` property to be of the literal type `"nil"`,
which is a kind of constrained `string` type that can only ever hold one value: `"nil"`. Attempting to assign any other
value to it results in a compiler error. Because literal types can only hold one value (i.e. have only one
*inhabitant*), they are also called *singleton types*. ADTs, or discriminated unions, are also called *tagged unions*,
hence the property name `tag`. We could have called it `discriminator`, but that's kind of a long word and we're lazy.

To understand why the `tag`s matter, we need to talk about a third TypeScript feature called *type guards*. A type guard
is a conditional that guarantees a value has a specific type. Inside the conditional, we can then safely treat the value
as that type. For example:

```typescript
function printHead<A>(ls: List<A>) {
  if (ls.tag === "cons") {
    console.log(`The head is ${ls.head}`);
  } else {
    console.log("We're headless!");
  }
}
```

This code compiles because `ls.tag === "cons"` is a type guard, allowing the TypeScript compiler to know that, inside
the `if` block, `ls` must be a `Cons`, so that the `ls.head` property access is legal. This is type inferencing at work,
and it hinges on TypeScript knowing that every variant of `List` has a `tag` property, but only one variant has a `tag`
property that can possibly hold a value of `"cons"` (thanks, literal types!), so that if `ls.tag === "cons"` is `true`,
then `ls` *must* be a `Cons`.

There is one more feature of ADTs often supported by FP languages that we have not yet achieved, which is
*exhaustiveness checking*. It would be helpful for the compiler to warn us if we haven't handled every variant of an
ADT, in order to avoid undefined behavior. Fortunately, once again due to TypeScript's type inferencing, we don't have
to do anything special. Consider this function:

```typescript
function getHead<A>(ls: List<A>): A {
  if (ls.tag === "cons") {
    return ls.head;
  }
}
```

Attempting to compile it leads to this error:

```
[eval].ts(13,35): error TS2366: Function lacks ending return statement and
return type does not include 'undefined'.
```

This is a bit of a subtle message, but makes more sense if you keep in mind that a function lacking an explicit return
value returns `undefined`. In strict mode, TypeScript does not allow us to have `undefined` or `null` values unless we
explicitly allow it, which we won't get into now.

We'll often use type guards and exhaustiveness checking with switch statements, which gives us something close to the
pattern matching capability offered by other FP languages. Hopefully, the `sum` function for `List` makes complete sense
to you now:

```typescript
function sum(ns: List<number>): number {
  switch (ns.tag) {
    case "nil": return 0;
    case "cons": return ns.head + sum(ns.tail);
  }
}
```

### Exercise 3.1. Type inference

Given these declarations:

```typescript
interface Nil { tag: "nil"; }

interface SingleCons<A> {
  tag: "cons";
  head: A;
  tail: SingleList<A>;
}
type SingleList<A> = SingleCons<A> | Nil;

interface DoubleCons<A> {
  tag: "cons";
  head: A;
  tail: DoubleList<A>;
  prev: DoubleList<A>;
}
type DoubleList<A> = DoubleCons<A> | Nil;

type AnyList<A> = SingleList<A> | DoubleList<A>;
```

What is the result of compiling the following snippets?

```typescript
function foo<A>(l: SingleList<A>) {
  if (l.tag === "cons") {
    console.log(l.head);
  }
}
```

??? answer
This snippet compiles. The function argument `l` is constrained to be of type `SingleList<A>`. Within that type, only
`SingleCons<A>` has a `tag` property that can contain the value `"cons"`, so the compiler has enough information to
lookup the `head` property inside the `if` statement.
???

```typescript
function bar<A>(l: AnyList<A>) {
  if (l.tag === "cons") {
    console.log(l.head);
  }
}
```

??? answer
This snippet compiles. The function argument `l` is no longer constrained to a `SingleList<A>`; now it can be either
that or a `DoubleList<A>`. Within those types, both `SingleCons<A>` and `DoubleCons<A>` have a `tag` of `"cons"`. So the
compiler can't narrow `l` down to only one data constructor inside the `if` statement. But, it doesn't matter, because
both possibilities support the `head` property, and it has the same type for each.
???

```typescript
function baz<A>(l: AnyList<A>) {
  if (l.tag === "cons") {
    console.log(l.prev);
  }
}
```

??? answer
This snippet does not compile. Again, inside the `if` statement, the type of `l` has been inferred to be either
`SingleCons<A>` or `DoubleCons<A>`. But we try to access the `prev` property, which only exists on `DoubleCons`.
Attempting to compile this leads to an error message similar to:

```
TSError: ⨯ Unable to compile TypeScript:
test.ts(34,19): error TS2339: Property 'prev' does not exist on type 'SingleCons<A> | DoubleCons<A>'.
  Property 'prev' does not exist on type 'SingleCons<A>'.
```
???

## Data sharing in functional data structures

How do we write functions that actually do things with immutable data structures? For instance, how can we add or remove
elements from a `List`? To add a `1` to the front of a list named `xs`, we just create a new `Cons` with the old list as
the tail: `new Cons(1, xs)`. Since `List` is immutable, we dont' have to worry about anyone changing a list out from
under us, so it's safe to reuse in new lists, without pessimistically copying it. According to the book:

   > ...*in the large*, FP can often achieve greater efficiency than approaches that rely on side effects, due to much
   > greater sharing of data and computation.

Similarly, to remove an element from the front of a list, we just return its tail.

```
                       Data Sharing

┌─────┬─────┐  ┌─────┬─────┐  ┌─────┬─────┐  ┌─────┬─────┐
│ "a" │  ●──┼─>│ "b" │  ●──┼─>│ "c" │  ●──┼─>│ "d" │  ●  │
└─────┴─────┘  └─────┴─────┘  └─────┴─────┘  └─────┴─────┘
   ↑              ↑
   |              ╰──────────────────╮
   |                                 |
   ╰─ List("a", "b", "c", "d")       │
      |                              |
      |         ╭───────╮            │
      ╰─────────┤ .tail ├─────────> List("b", "c", "d")
                ╰───────╯
```

And now... some exercises for manipulating lists.

::: tip Note
As we complete these exercises, we'll be creating a reusable `List` module. You can find the code for `List` in the code
repo at [/fpbookclub/data_structures/list.ts][repo_list].
:::

### Exercise 3.2. `tail`

Implement the `tail` function for removing the first element of a list. Notice that this function takes constant time.

```typescript
function tail<A>(l: List<A>): List<A>
```

### Exercise 3.3. `setHead`

Now implement `setHead`, which *replaces* the first element of a list with a different value. For example,
`setHead(List(1, 2, 3), 4)` should return `List(4, 2, 3)`.

```typescript
function setHead<A>(l: List<A>, head: A): List<A>
```

The following exercises demonstrate the efficiency of data sharing.

### Exercise 3.4. `drop`

Generalize `tail` to `drop`, which removes the first `n` elements from a list. Note that this function takes time
proportional to `n`, and we do not have to make any copies.

```typescript
function drop<A>(l: List<A>, n: number): List<A>
```

### Exercise 3.5. `dropWhile`

Implement `dropWhile`, which removes elements from the front of a list as long as they match a predicate.

```typescript
function dropWhile<A>(l: List<A>, f: (a: A) => boolean): List<A>
```

A "more surprising" example of data sharing, this `append` implementation's runtime and memory usage are determined
entirely by the first list. The second is just tacked onto the end, so to speak.

```typescript
function append<A>(a1: List<A>, a2: List<A>): List<A> {
  switch (a1.tag) {
    case "nil":
      return a2;
    case "cons":
      return new Cons(a1.head, append(a1.tail, a2));
  }
}
```

### Exercise 3.6. `init`

Implement a function, `init`, that returns a `List` consisting of all but the last element of another `List`. Given
`List(1, 2, 3, 4)` your function should return `List(1, 2, 3)`. Why can't this function be implemented in constant time,
like `tail`?

```typescript
function init<A>(l: List<A>): List<A>
```

Due to the structure and immutability of a `Cons`, any time we want to replace the tail of a list, we have to create a
new `Cons` element with the new `tail` value and the old `head` value. If that particular `Cons` was itself the `tail`
of a different `Cons`, _that_ element now needs to be copied as well, and so on until we reach the head of the list.
According to the book:

   > Writing purely functional data structures that support different operations efficiently is all about finding
   > clever ways to exploit data sharing. As an example of what’s possible, in the Scala standard library there’s a
   > purely functional sequence implementation, Vector (documentation [here][scala_vector]), with constant-time random
   > access, updates, head, tail, init, and constant-time additions to either the front or rear of the sequence. See the
   > [chapter notes][fpscala_notes_3] for links to further reading about how to design such data structures.


## Recursion over lists and generalizing to higher-order functions

Take another look at `sum` and `product`. These versions are simplified a bit compared to what you saw before.

```typescript
function sum(ns: List<number>): number {
  switch (ns.tag) {
    case "nil":  return 0;
    case "cons": return ns.head + sum(ns.tail);
  }
}

function product(ns: List<number>): number {
  switch (ns.tag) {
    case "nil":  return 1.0;
    case "cons": return ns.head * product(ns.tail);
  }
}
```

Notice how similar they are? They both return a constant value in the `"nil"` case. In the `"cons"` case, they both call
themselves recursively and combine the result with `head` using a binary operator. When you see this level of structural
similarity, you can often write one generalized polymoprhic function with the same shape that takes function parameters
for the differing bits of logic. In this example, our general function needs a normal single-valued parameter for the
`"nil"` case and a function parameter for the operation to apply in the `"cons"` case.

```typescript
function foldRight<A, B>(l: List<A>,
                         z: B,
                         f: (a: A, b: B) => B): B {
  switch (l.tag) {
    case "nil": return z;
    case "cons": return f(l.head, foldRight(l.tail, z, f));
  }
}

function sum(ns: List<number>): number {
  return foldRight(ns, 0, (a, b) => a + b);
}

function product(ns: List<number>): number {
  return foldRight(ns, 1.0, (a, b) => a * b);
}
```

`foldRight` can operate on lists of any element type, and, it turns out, can return any type of value, not just the type
contained in the list! It just so happens that the types of the results of `sum` and `product` match the element types
of their `List` arguments (that is, `number`). In a sense, `foldRight` replaces the data constructors of the list,
`Cons` and `Nil`, with `f` and `z`, respectively:

```typescript
Cons(1, Cons(2, Nil))
f   (1, f   (2, z  ))
```

Here's a more complete example, tracing the evaluation of `foldRight(List(1, 2, 3), 0, (x, y) => x + y)` by repeatedly
substituting the definition of `foldRight` for its usages.

```typescript
foldRight(Cons(1, Cons(2, Cons(3, Nil))), 0, (x, y) => x + y)
1 + foldRight(Cons(2, Cons(3, Nil)), 0, (x, y) => x + y)
1 + (2 + foldRight(Cons(3, Nil), 0, (x, y) => x + y))
1 + (2 + (3 + foldRight(Nil, 0, (x, y) => x + y)))
1 + (2 + (3 + (0)))
6
```

You can see that `foldRight` has to traverse the list all the way to the end (using stack frames for each recursive call
as it goes) before it can fully evaluate the result. In other words, it is not tail recursive.

### Exercise 3.7. `foldRight` and short-circuiting

In our simplified version of `product`, above, we left out the "short-circuit" behavior of immediately returning 0 when
any list element is 0. Can we regain this behavior, now that `product` is implemented in terms of `foldRight`? Why or
why not?

### Exercise 3.8. Relationship between `foldRight` and `List` data constructors

See what happens when you pass `Nil` and `Cons` themselves to `foldRight`, like this: `foldRight(List(1, 2, 3), Nil, (h,
t) => Cons(h, t))`. What does this say about the relationship between `foldRight` and the data constructors of `List`?

### Exercise 3.9. `length` via `foldRight`

Compute the length of a list using `foldRight`.

```typescript
function length<A>(l: List<A>): number
```

### Exercise 3.10. `foldLeft`

Our implementation of `foldRight` is not tail-recursive and therefore not stack-safe. Write another function,
`foldLeft`, that is stack-safe. Recall that even tail recursion isn't stack-safe in TypeScript. Because our `List`
library will be reused in future exercises, we should probably spend some time making it scale well. Therefore, this is
one of the few times that we'll sacrifice our functional ideals for practical usability gains. Your function should use
an iterative loop and local state mutations, rather than recursion, to achieve stack safety. It may be helpful to start
by writing a tail-recursive version of `foldLeft` and then transform it into an iterative version.

```typescript
function foldLeft<A, B>(l: List<A>, z: B, f: (b: B, a: A) => B): B
```

### Exercise 3.11. Refactor `sum`, `product`, and `length`

Rewrite `sum`, `product`, and `length` in terms of `foldLeft`.

### Exercise 3.12. `reverse`

Write a function that returns the reverse of a list. See if you can do it using a fold.

```typescript
function reverse<A>(l: List<A>): List<A>
```

### Exercise 3.13. `foldRight` and `foldLeft` in terms of each other

Can you write `foldLeft` in terms of `foldRight`? How about the other way around? If we can express `foldRight` in terms
of `foldLeft`, we gain the ability to fold a list right-wise in a stack-safe way.

### Exercise 3.14. Refactor `append`

Rewrite `append` using either fold.

### Exercise 3.15 `concat`

Write a function that concatenates a list of lists into a single list, using functions we've already defined. The
runtime of `concat` should be proportional to the total length of all lists.

```typescript
function concat<A>(ll: List<List<A>>): List<A>
```

### More functions for working with lists

The next set of exercises introduces a few more useful list functions. For each one, we follow the pattern of trying to
accomplish some specific tasks, noticing the commonality between them, writing the general function, and then
refactoring the tasks using our new tool. The purpose of doing these exercises is not to commit to memory every list
function and when to use it, but to begin to develop an intuition for detecting patterns in working with lists and
functional data structures in general. As we proceed through the book, we'll see that these patterns apply to a variety
data structures beyond the humble list, and that there are opportunities for extracting these patterns into highly
abstract functions that we can use in any domain.

### Exercise 3.16. Add `1` to each element

Write a function that transforms a list of integers by adding 1 to each element. (Reminder: this should be a pure
function that returns a new List!)

### Exercise 3.17. Convert `number` to `string`

Write a function that turns each value in a `List<number>` into a `string`. You can use the expression `n.toString()` to
convert some `n: number` to a `string`.

### Exercise 3.18. `map`

Write a function `map` that generalizes modifying each element in a list while maintaining the structure of the list.
Here is its signature:

```typescript
function map<A, B>(l: List<A>, f: (a: A) => B): List<B>
```
### Exercise 3.19. `filter`

Write `filter`, a function that removes elements from a list unless they satisfy a predicate. Then practice using it by
removing all odd numbers from a `List<number>`. Is it possible to implement `filter` in terms of `map`? Why, or why not?

```typescript
function filter<A>(l: List<A>, p: (a: A) => boolean): List<A>
```

### Exercise 3.20. `flatMap`

Write a function named `flatMap` that works similarly to `map`, except the provided function returns a `List` instead of
a raw value. That `List` should be inserted into the resulting `List`. For example, `flatMap(List(1, 2, 3), i => List(i,
i))` should return `List(1, 1, 2, 2, 3, 3)`.

```typescript
function flatMap<A, B>(l: List<A>, f: (a: A) => List<B>): List<B>
```

### Exercise 3.21. `filter` in terms of `flatMap`

Re-implement `filter` using `flatMap`. As a bonus, can you implement `map` in terms of `flatMap`?

### Exercise 3.22. Add corresponding elements

Write a function that, given two lists, returns a new list consisting of the sums of corresponding elements in the
argument lists. For example, given `List(1, 2, 3)` and `List(4, 5, 6)`, it should return `List(5, 7, 9)`.

### Exercise 3.23. `zipWith`

Generalize the previous function so that it's not specific to numbers or addition. Call it `zipWith`, and then refactor
the previous function to use `zipWith`.

### Loss of efficiency when assembling list functions from simpler components

Sometimes, when we express `List` operations in terms of general-purpose functions, we end up with inefficient
implementations, even though the code ends up being very concise and readable. We may wind up making several passes over
input lists, or having to write explicit loops to allow for early termination.

### Exercise 3.23. `hasSubsequence`

Write a function, called `hasSubsequence`, to check whether a `List` contains another `List` as a subsequence. For
example, `List("a", "b", "r", "a")` has subsequences `List("b", "r")` and `List("a")`, among others. This is meant to
illustrate the previous point about efficiency, so you will probably have some difficulty expressing this in a purely
functional, efficient manner. We'll return to this problem, and hopefully find a better answer, in Chapter 5.

```typescript
function hasSubsequence<A>(sup: List<A>, sub: List<A>): boolean
```

## Trees

`List` is just one example of an algebraic data type (ADT), which we discussed earlier in the chapter. In this section we'll
introduce the `Tree`, which is a recursive, hierarchical data structure.

::: tip Tuple types in TypeScript

We briefly touched on tuples in Chapter 1. A tuple is a bit like a `List`, except its size and the types of all its
elements, which need not be the same type, are known at compile time. A tuple of "arity", or size, 2 is often referred
to simply as a pair. Tuples are themselves ADTs. TypeScript borrows JavaScript's array syntax to define both tuple types
and tuple values.

```
> const p: [string, number] = ["Bob", 42];
> p[0];
'Bob'
> p[0] = 41;
[eval].ts(5,1): error TS2322: Type '2' is not assignable to type 'string'.
```

In fact, TypeScript tuples *are* just JavaScript arrays with some additional type information. TypeScript keeps track of
the type of each element of a tuple, and throws errors like the one above if you attempt to assign a value to a position
in a tuple with an incompatible type.
:::

Here's a simple binary tree data structure. You should recognize the tagged union technique we introduced earlier with
`List`.

```typescript
type Tree<A> = Leaf<A> | Branch<A>

class Leaf<A> {
  tag: "leaf" = "leaf";
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }
}

class Branch<A> {
  tag: "branch" = "branch";
  readonly left: Tree<A>;
  readonly right: Tree<A>;

  constructor(left: Tree<A>, right: Tree<A>) {
    this.left = left;
    this.right = right;
  }
}
```

```
                          A Tree

                          Branch
                      ┌─────┬─────┐
             ┌────────┼──●  │  ●──┼───────┐
             │        └─────┴─────┘       │
             ↓         left  right        ↓
           Branch                       Branch
       ┌─────┬─────┐                ┌─────┬─────┐
   ┌───┼──●  │  ●──┼───┐        ┌───┼──●  │  ●──┼───┐
   │   └─────┴─────┘   │        │   └─────┴─────┘   │
   ↓    left  right    ↓        ↓    left  right    ↓
  Leaf                Leaf     Leaf                Leaf
┌─────┐             ┌─────┐  ┌─────┐             ┌─────┐
│ "a" │             │ "b" │  │ "c" │             │ "d" │
└─────┘             └─────┘  └─────┘             └─────┘
 value               value    value               value
```

### Exercise 3.25. `size`

Write a function named `size` that counts the number of leaves and branches (collectively called "nodes") in a tree.

```typescript
function size<A>(ta: Tree<A>): number
```

### Exercise 3.26. `maximum`

Write a function `maximum` that returns the maximum value contained in a tree of numbers. You can use TypeScript's
built-in `Math.max(x, y)` function to calculate the maximum of two numbers `x` and `y`.

```typescript
function maximum(tn: Tree<number>): number
```

### Exercise 3.27. `depth`

Write a function `depth` that returns the maximum path length from the "root", or top, of a tree to any leaf.

```typescript
function depth<A>(ta: Tree<A>): number
```

### Exercise 3.28. `map`

Write the `Tree` version of `map`. As with the `List` version, it should return a `Tree` with the same shape as the
input `Tree`, but with elements transformed by a provided function.

```typescript
function map<A, B>(ta: Tree<A>, f: (a: A) => B): Tree<B>
```

[fpscala_notes_3]: https://github.com/fpinscala/fpinscala/wiki/Chapter-3:-Functional-data-structures "Chapter 3 -
fpinscala/fpinscala Wiki"
[repo_list]: https://github.com/calebharris/fp_book_club_ts/blob/master/fpbookclub/data_structures/list.ts "List - Functional Programming in TypeScript"
[scala_vector]: https://www.scala-lang.org/api/current/scala/collection/immutable/Vector.html "Vector - Scala Standard Library"
[wikip_cat]: https://en.wikipedia.org/wiki/Category_theory "Category theory - Wikipedia"
