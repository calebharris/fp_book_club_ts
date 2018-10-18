# Chapter 4. Handling errors without exceptions

Exceptions, as mentioned in [Chapter 1](/chapter_1.html), are not a great fit for functional programming for a couple
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
