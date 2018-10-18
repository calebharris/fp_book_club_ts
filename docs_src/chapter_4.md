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

Some observations:
* It's a *partial function*, which means it does not produce a result for every possible input value.

...skipping ahead...

Look at this cool `Option` type!

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
