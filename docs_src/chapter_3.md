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

[wikip_cat]: https://en.wikipedia.org/wiki/Category_theory "Category theory - Wikipedia"
