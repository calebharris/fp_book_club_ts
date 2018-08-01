# Chapter 2. Getting started with functional programming in TypeScript

Our ultimate goal is to start thinking about programs more as combinations of pure functions and less as sequences of
instructions that each have an effect. In this chapter, we'll learn some of TypeScript's syntax, and how to use
its features to exercise the basics of typed functional programming techniques: writing loops as recursive functions,
using higher-order functions (HOFs), and writing polymorphic HOFs.

## Introducing TypeScript: an example

<<< @/fpbookclub/getting_started/abs.ts

The building blocks of TypeScript programs are modules. For now, it's fine to think of each TypeScript file as though
it automatically defines a module. The `export` keyword does not come into play in this example, but makes the `abs`
function visible to other modules. In other words, `abs` is a public member of this module. Functions, classes,
interfaces, types, and raw values can all be members of a module. We'll discuss all these constructs later.

Our module has three functions, which we'll also call methods, declared with the `function` keyword. There are other
ways to declare functions, but we'll cover those later.

The `abs` function is a pure function that takes a number and returns its absolute value:

```typescript
function abs(n: number): number {
  if (n < 0)
    return -n;
  else
    return n;
}
```

TypeScript inherits its numeric type from JavaScript. That means it has only one type of number, conveniently called
`number`, which represents a floating-point value. Without some extra work, or the help of a library, we cannot
distinguish between integers and floating-point values using the type system.

The `function` keyword is followed by a name, and then by a parenthesized list of parameters. `Abs` takes one argument
named `n`, of type `number`, which we denote with `: number`. Similarly, we declare the type of `abs'` return value
to be a number with the `: number` after the parameter list. The body of the function, which contains all its logic, is
written between curly braces: '{' and '}'. We'll sometimes refer to everything before the opening brace as a function
s *signature*, and everything inside the braces as its *definition*. In general, code between braces can also be
referred to as a *block*. The `return` keyword immediately returns the value after it to the caller.

In some languages, the if-else construct works a little like a function call, returning either one value or the other,
depending on the condition. If that were the case in TypeScript, we could write:

```typescript
return if (n < 0) -n else n;
```

But in TypeScript, if-else is only a control-flow mechanism and does not itself return a value. Therefore, when using
if-else, we must rely on side effects to know which branch was followed. We'll be careful to keep these side effects as
localized as possible, so that the overall function remains pure.

The `formatAbs` function, also pure, takes a number and returns a string:

```typescript
function formatAbs(x: number) {
  const msg = "The absolute value of " + x + " is " + abs(x);
  return msg;
}
```

Notice that we have not declared its return type with a `: string` clause. TypeScript has powerful *type-inferencing*
capabilities, meaning that we can often omit explicit type declarations and let the compiler figure things out. But
it's generally considered good style to include explicit types in the signatures of functions we intend for others to
use. Since `formatAbs` is not `export`ed, it is effectively private to our module, so it's OK to leave out the
`: string`. `FormatAbs` uses the plus (`+`) operator to concatenate several strings and numbers together into a
human-readable message. Plus is the only example of so-called *operator overloading* in JavaScript, and therefore
TypeScript. When either side of the `+` is a string, the other side is also converted into a string.

The first line of `formatAbs` assigns the result of the string concatenation to the variable `msg`, using the keyword
`const`. `Const` is short for *constant*, which is programmer-speak for "a variable whose value never changes".
Variables declared with `const` must have a value assigned as soon as they are created, and can never be assigned a new
value.

Finally, the last line of the module calls our other functions and writes the result to the console:

```typescript
console.log(formatAbs(-42));
```

If we execute this file directly with a TypeScript interpreter (more on that later), that's when the output would
occur. In that case, it works kind of like an implicit `main` method. But if we use the file as a module by importing
`abs` into another file, the output would happen the first time that file actually refers to `abs`.
