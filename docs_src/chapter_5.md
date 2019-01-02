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

[node_inspect]: https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_custom_inspection_functions_on_objects
"Util | Node.js Documentaiton"
