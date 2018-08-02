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

## Running our program

The easist way to run this and other programs in these notes is to clone the [Git repository][fpbookclub_repo] and
follow the instructions in the README. You'll use npm, a standard package-management tool in the Node.js ecosystem, to
download this project's dependencies, build it, and run it.

Once you've completed those steps, you can run the program we've been discussing using the console script:

```
$ npm run console -- fpbookclub/getting_started/abs.ts

> fp_book_club_ts@0.0.1 console /Users/caleb/fp_book_club_ts
> ts-node "fpbookclub/getting_started/abs.ts"

The absolute value of -42 is 42
```

The `--` argument signals the end of arguments to the `npm run` command and the start of arguments to the `console`
script. `Console` uses a package called `ts-node` under the hood, which acts like a TypeScript REPL when no script
argument is provided:

```
$ npm run console

> fp_book_club_ts@0.0.1 console /Users/caleb/src/fp_book_club_ts
> ts-node

> import { abs } from "./fpbookclub/getting_started/abs";
{}
> abs(-13);
The absolute value of -42 is 42
13
> abs(6);
6
> (Ctrl-D to exit)
```

In the previous example, we are treating the sample program as a module and importing the `abs` function into the
REPL's scope. You can see where our "main" code is executed, which is right when we use `abs` for the first time. On
the second invocation, because the module has already been loaded, we don't see a second line of output. Mixing
script-like and module-like code like this, as you can see, can lead to confusing results, so generally we'll stick to
one or the other in a given file.

Finally, the project for these notes incorporates [Jest][jest] - a JavaScript testing framework. You can use the
`npm test` command to run all the tests for the project:

```
$ npm test

> fp_book_club_ts@0.0.1 test /Users/caleb/src/fp_book_club_ts
> jest

 PASS  fpbookclub/getting_started/abs.test.ts
  ● Console

    console.log fpbookclub/getting_started/abs.ts:32
      The absolute value of -42 is 42

 PASS  fpbookclub/intro/cafe.test.ts
  ● Console

    console.log fpbookclub/intro/impure_example.ts:13
      Side effect! Charging the credit card...
    console.log fpbookclub/intro/cafe.test.ts:35
      Another side effect


Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.083s, estimated 2s
Ran all test suites.
```

You can also have Jest "watch" the source files and re-run related tests whenever a source file changes. Doing so
brings up a little interactive test results menu, which provides options for running tests manually or exiting from the
watch session.

```
$ npm run test:watch

 PASS  fpbookclub/getting_started/abs.test.ts
  ✓ abs computes the absolute value of a number (4ms)

  console.log fpbookclub/getting_started/abs.ts:32
    The absolute value of -42 is 42

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.673s, estimated 1s
Ran all test suites related to changed files.

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

## Modules, imports, and exports

We've already seen that files are essentially modules in TypeScript. More specifically, any file that has an `import`
or `export` statement is a module. A module can have *named* exports, which we've already seen an example of. Each
module can also declare one *default* export. Named and default exports are imported in slightly different ways.
Suppose we have the following module that we want to reuse elsewhere:

```typescript
/**
 * lib.ts
 **/

export default function commonlyUsed() {...}

export function lessCommonlyUsed() {...}

export function evenLessCommonlyUsed() {...}
```

Then our client module has a number of options for importing `lib`'s functionality:

```typescript
// directly import named exports
import { lessCommonlyUsed, evenLessCommonlyUsed } from "./lib";

lessCommonlyUsed();
evenLessCommonlyUsed();

// directly import named exports and rename them
import { lessCommonlyUsed as a, evenLessCommonlyUsed as b } from "./lib";

a();
b();

// import all named exports into a namespace
import * as lib from "./lib";

lib.lessCommonlyUsed();
lib.evenLessCommonlyUsed();

// default exports are easier to import
import myName from "./lib";

myName();        // `myName` is actually `commonlyUsed`

// default exports are just special named exports
import { default as myOtherName } from "./lib";

myOtherName();   // `myName` and 'myOtherName` are `commonlyUsed`
lib.default();   // so is `lib.default`

```

## Higher-order functions: passing functions to functions

It's often useful in functional programming to write functions that accept other functions as arguments or that return
functions as results. These are called higher-order functions (HOFs). Fortunately, in TypeScript, functions are just
like any other value. They can be passed around as arguments, assigned to variables, and stored in data structures. To
get us started, let's think about modifying the program to output both the absolute value of a number *and* the
factorial of another number.

But first...

### Writing loops functionally

A possible `factorial` implementation:

```typescript
export function factorial(n: number): number {
  const go = (n: number, acc: number): number => {
    if (n <= 0)
      return acc;
    else
      return go(n - 1, n * acc);
  }

  return go(n, 1);
}
```

::: tip Note
You can find expanded code for this and the following examples in the code repo at
`/fpbookclub/getting_started/math.ts`.
:::

[fpbookclub_repo]: https://github.com/calebharris/fp_book_club_ts "Functional Programming in TypeScript on GitHub"
[jest]: https://jestjs.io/en/ "Jest"
