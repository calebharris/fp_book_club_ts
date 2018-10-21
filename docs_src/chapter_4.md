# Chapter 4. Handling errors without exceptions

Exceptions, as mentioned in [Chapter 1](chapter_1.html), are not a great fit for functional programming for a couple
reasons:

1. They break referential transparency (RT).
2. They are not type-safe: the type of a function says nothing about whether or not it can throw an exception, so the
   compiler loses some ability to enforce correctness.

Exceptions *do* have an upside, in that they allow the programmer to consolidate error-handling logic.

In this chapter, we'll learn how to use types to encode failures and error conditions, so that we can capture them as
ordinary values. This lets us keep our FP principles intact while maintaining the benefit of error-handling
consolidation.

## Possible alternatives to exceptions

Consider this example, which computes the mean of a list:

```typescript
function mean(xs: List<number>): number {
  if (xs.tag === "nil")
    throw new Error("Attempt to take mean of empty list");

  return sum(xs) / length(xs);
}
```

It's a *partial function*, which means its result is undefined for some input values. Throwing an exception is one way
of handling these values, but there are others:

We could return a special value, like `NaN` (which is TypeScript for "not a number") or `null`, but there are several
drawbacks to this approach.

* Makes it easy for errors to proliferate due to callers neglecting to check for this special value
* Creates need for boilerplate error checking code
* Doesn't work with polymorphic code. For some input types, there may not be an appropriate special value to return
* Forces a special policy on callers, who can't simply call the function and use the result, which makes it difficult
  to compose `mean` with other functions

We could change `mean`'s API and force the caller to provide the value to return for empty lists, like this:

```typescript
function mean(xs: List<number>, onEmpty: number): number {
  if (xs.tag === "nil")
    return onEmpty;

  return sum(xs) / length(xs);
}
```

But this requires immediate callers to have knowledge of how to handle the special cases, again making it difficult to
compose the function into a larger computation, and limiting the freedom the caller has to decide how to handle special
cases.

## The `Option` data type

A functional solution to this problem is to encode into the function's return type the possibility of not returning a
value. Behold, the `Option` type!

```typescript
type Option<A> = Some<A> | None;

class Some<A> {
  readonly tag: "some" = "some";
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }
}

class None extends OptionBase<never> {
  readonly tag: "none" = "none";
}

const NONE = new None();
```

`Option`, like `List`, has one type parameter, which is the type of value that it might contain. An `Option` can be
either `Some`, meaning it definitely has a value, or `None` meaning the value is not defined.

Where as `List` represents the idea that multiple values of a type may exist, `Option` represents the idea that a value
may not exist at all. In FP, both of these notions are examples of *effects* (which are distinct from *side effects*).
`List` models the effect of having multiple values; `Option` models the effect of optionality.

We can use `Option` to rewrite `mean` as a *total function*:

```typescript
function mean(xs: List<number>): Option<number> {
  if (xs.tag === "nil")
    return NONE;

  return new Some(sum(xs) / length(xs));
}
```

It now always has a defined result, which is `None` when the input list is empty.

### Usage patterns for `Option`

`Option` is convenient because we can factor out common error-handling patterns into higher-order functions, meaning we
can dispense with much of the boilerplate that comes with exception-oriented code.

We're going to use a different style of function definition than we used with `List`, where we placed all our functions
at the top level of the module and exported each of them. Here, when possible, we'll place the functions "inside" our
`Option` type, so they can be called with an object-oriented style of syntax (e.g. `opt.map(a => a.toString())` instead
of `map(opt, a => a.toString())`). In order to accomplish that, we need to introduce a few new bits of TypeScript
syntax. Examine this expanded definition of `Option`:

```typescript
export type Option<A> = Some<A> | None;

// 1. `abstract class` defines class that cannot be instantiated
abstract class OptionBase<A> {

  // 2. `this` parameter
  map<B>(this: Option<A>, f: (a: A) => B): Option<B> { ... }

  // 3. `extends` keyword introduces type bound
  // 4. `() => U` function type is a "thunk"
  getOrElse<T extends U, U>(this: Option<T>, onNone: () => U): U { ... }

  filter(this: Option<A>, p: (a: A) => boolean): Option<A> { ... }
  flatMap<B>(this: Option<A>, f: (a: A) => Option<B>): Option<B> { ... }
  orElse<T extends U, U>(this: Option<T>, ou: () => Option<U>) { ... }
}

// 5. `extends` keyword creates inheritance relationship
export class Some<A> extends OptionBase<A> {
  readonly tag: "some" = "some";
  readonly value: A;

  constructor(value: A) {
    super();
    this.value = value;
  }
}

// 6. `never` is the "bottom type"
export class None extends OptionBase<never> {
  readonly tag: "none" = "none";
}

export const NONE = new None();
```

#### 1. Abstract classes

As we said, we want to place our functions "inside" the `Option` type. But, since `Option` is just a union type
comprising two otherwise unrelated types, how do we accomplish that? Where is the common place to put our functions?
TypeScript provides an *abstract class* for this purpose, which is a class that cannot be directly instantiated. Rather,
it must be *extended* by a normal, or *concrete*, class (more on that later). This is exactly what we're looking for,
since we do not want to add another data constructor to our `Option` type, but do want the ability to define our
functions once and still have them be usable from both `Some` and `None` values. Note that we are not exporting
`OptionBase` to users of our `Option` module. As an implementation detail, we want the freedom to change `OptionBase` as
needed, so it's best to keep it private to the module, to prevent accidental dependencies on a part of our code that's
likely to change.

#### 2. `This` parameters

In many object-oriented languages, defining a method on a class is really a shorthand for defining a function that
takes, as a parameter, an instance of the method's containing class. Inside the method, this undeclared parameter is
often called `this`. TypeScript is no different. For example, this code fragment...

```typescript
class OptionBase<A> {
  filter(p: (a: A) => boolean): Option<A> { ... }
}
```

...is equivalent to this:

```typescript
class OptionBase<A> {
  filter(this: OptionBase<A>, p: (a: A) => boolean): Option<A> { ... }
}
```

As you can see, the implicit `this` parameter has type `OptionBase<A>`. Many other object-oriented languages give us no
further control over `this`. We get a parameter whose type matches that of the enclosing class, and that's that. But
TypeScript allows us to explicitly declare the `this` parameter and give it an arbitrary type. So the previous snippet
is actually valid TypeScript code.


::: tip JavaScript's "this" value
TypeScript's mission is to remain a strict superset of JavaScript. Therefore, its type system is uniquely shaped to
provide type information on top of existing JavaScript code. JavaScript is object-oriented, but does not have classes,
and therefore has a number of idiosyncrasies around its treatment of the `this` value inside functions. One of the most
impactful of these is that `this` can be dynamically assigned at runtime. For more about JavaScript's `this` value and
how TypeScript's `this` parameters address it from a static typing perspective, see ["Understanding JavaScript Function
Invocation and `this`"][js_this] by Yehuda Katz and [the "Functions" section of the TypeScript Handbook][ts_fns].
:::

The reason we need to include a `this` parameter in the method signatures of our `OptionBase` is that we want to take
advantage of the compiler help we get when using tagged unions (which we discussed in
[Chapter 3](chapter_3.html#representing-algebraic-data-types-in-typescript)). Because `OptionBase` is an abstract class,
it is open to be extended by other concrete classes beyond our `Some` and `None`. That means the TypeScript compiler can
never know all the possible types that can be an `OptionBase`, which defeats our tagged union structure. The workaround
is to fix the type of `this` in our methods to `Option`, which is our tagged union type and therefore closed to
additions. Doing so makes attempting to call our `OptionBase` methods on anything other than a `Some` or `None` a
compile error.

[js_this]: https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/ "Yehuda Katz - Understanding JavaScript Function Invocation and 'this'"
[ts_fns]: https://www.typescriptlang.org/docs/handbook/functions.html "Functions - TypeScript Handbook"
