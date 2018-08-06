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
  const msg = `The absolute value of ${x} is ${abs(x)}`;
  return msg;
}
```

Notice that we have not declared its return type with a `: string` clause. TypeScript has powerful *type-inferencing*
capabilities, meaning that we can often omit explicit type declarations and let the compiler figure things out. But
it's generally considered good style to include explicit types in the signatures of functions we intend for others to
use. Since `formatAbs` is not `export`ed, it is effectively private to our module, so it's OK to leave out the
`: string`.

`FormatAbs` uses a template literal to create the message string. Template literals are enclosed in backticks (` `` `)
and can incorporate values from the current scope using the placeholder syntax `${value}`. In our example, `${x}` is
replaced by the string representation of `x`, and `${abs(x)}` is replaced by the string representation of the value
returned by `abs(x)`.

The first line of `formatAbs` assigns the result of evaluating the template literal to the variable `msg`, using the
keyword `const`. `Const` is short for *constant*, which is programmer-speak for "a variable whose value never change".
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
factorial of another number. The program's output might look like this:

```
The absolute value of -42 is 42
The factorial of 7 is 5040
```

But first...

### Writing loops functionally

A possible `factorial` implementation:

```typescript
function factorial(n: number): number {
  const go = function(n: number, acc: number): number {
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

We write loops functionally, without mutating a loop variable, with *recursive* functions. The variable `go` holds a
recursive function, which is just a function that calls itself. It might seem strange, at first glance, to have a
function defined entirely inside another function. But TypeScript allows us to create functions in any scope.

In an imperative language, we'd typically write a `for` or `while` loop (known as *iteration*) that repeatedly runs a
block of code as long as some condition holds. However, this necessarily involves mutating some state (otherwise, the
condition would never change!), which is something we try to minimize in FP. By using a pure, recursive function, we
transmute the local state changes into a chain of calls to the function with different parameters.

In the `go` local function, the recursive call to itself is in *tail position*, meaning that the return value of the
recursive call is itself immediately returned, rather than being retained and used later in the function. It is
possible, when compiling tail calls, to skip the step of generating a new stack frame and instead reuse the current
stack frame. This process is known as *tail call elimination*.

For a function like `go` that contains recursive calls only in tail position - a property we describe as *tail
recursive* - this results in a constant stack size. We say *stack safe* to describe programs with a constant stack
size. Being aware of how the stack size of a program changes over time is important because most JavaScript runtimes
limit the amount of memory that can be consumed by the stack. With tail call elimination, tail-recursive functions
combine the elegance of pure functions with the efficiency of imperative loops.

### Recursion, iteration, and stack-safety

Now for some bad news: TypeScript does not do tail call elimination. That means that if we need to guarantee
stack-safety, we need to use a loop. Deciding when to use recursion vs. when to use iteration is a matter of judgment.
You'll need to decide when stack safety is more important than functional purity based on the needs of your specific
program.  If that seems like a daunting task right now, that's OK. As you follow these notes, work through the
exercises, and become more familiar with functional thinking, you will develop an intuition for making these decisions.

The good news is that converting a tail-recursive function to an imperative loop is very straightforward, so it often
makes sense to start with recursion and switch to iteration when your needs dictate it. The solutions to many problems
in FP are naturally expressed with recursive functions, so you'll find yourself doing this fairly frequently. Here is
`factorial`, refactored to use a `while` loop:

```typescript
function factorial(n: number): number {
  let acc = 1, i = n;   // declare and initialize mutable variables:w
  while (i > 0) {       // execute block until i <= 0
    acc = acc * i;
    i = i - 1;
  }
  return acc;
}
```

There are just a couple new pieces of syntax here. Using `let`, rather than `const`, declares a variable that we can
assign new values to later in our program. While it is possible to declare a variable with `let` without immediately
assigning a value to it, or *initializing* it, it's considered good practice not to have uninitialized variables. The
`while` syntax is pretty self-explanatory: it repeatedly executes the code in the block as long as the condition inside
the parentheses, or the *test*, evaluates to `true`. We might refer to `i` as the *loop variable*, since the loop
condition depends on it.

Most TypeScript programmers would find this code a little odd. They'd probably write something like this, instead:

```typescript
function factorial(n: number): number {
  let acc = 1;
  for (let i = n; i > 0; --i) {  // set `i` to `n` and loop until `i` <= 0
    acc *= i;                    // shortcut for `acc = acc * i`
  }
  return acc;
}
```

A `for` loop is kind of like an advanced `while` loop. In addition to the the test, it makes explicit what the loop
variable is (`i`), what its initial value is (`let i = n`), and how it changes on each iteration (`--i`, which is a
shortcut for `i = i - 1`). There's nothing wrong with using a `while` loop, and sometimes there is no other choice. But
when either will do, use a `for` loop.

### Exercise 2.1. Fibonacci numbers

Write a recursive function to get the *n*th [Fibonacci number][wikip_fib]. The first two Fibonacci numbers are 0 and 1.
The nth number is always the sum of the previous two—the sequence begins 0, 1, 1, 2, 3, 5. Your definition should use a
local tail-recursive function.

```typescript
function fib(n: number): number
```

Once you have a working recursive implementation, make it stack-safe by converting it to an iterative solution (i.e.
use a loop).

### Our first higher-order function

Now that we have `factorial`, let's add it to our program.

```typescript
// <definitions of `abs` and `factorial` go here>

function formatAbs(x: number) {
  const msg = "The absolute value of " + x + " is " + abs(x);
  return msg;
}

function formatFactorial(x: number) {
  const msg = "The factorial of " + x + " is " + factorial(x);
  return msg;
}
```

The functions `formatAbs` and `formatFactorial` are very similar. They differ only in the string describing the result
and which function to call to obtain the result. We can factor these differences out into parameters and write one
function, `formatResult`, that's more general:

```typescript
function formatResult(name: string, x: number, f: number => number) {
  return `The ${name} of ${x} is ${f(x)}`;
}
```

`FormatResult` is a higher-order function because it takes another function as the `f` parameter. The type of `f` is
`number => number`, which can be said as "number to number", "number arrow number", or "a function that takes a number
parameter and returns a number result" if you're feeling wordy.

Both `abs` and `factorial` happen to match the type `number => number`. We can, therefore, pass either as the value of
the `f` argument to `formatResult`:

```
> formatResult("absolute value", -42, abs);
'The absolute value of -42 is 42'
> formatResult("factorial", 7, factorial);
'The factorial of 7 is 5040'
```

::: tip Variable-naming conventions

It's a common convention to use names like `f`, `g`, and `h` for higher-order function parameters. In FP, we tend to use
very short variable names, even one-letter names. HOFs are often so general that they have no expectation of what their
function arguments should actually *do*, beyond conforming to the expected type. Many functional programmers think short
names make code easier to read, because the structure of short code is more apparent at a glance. In these notes, we'll
follow this convention. In your own code, you should do whatever you feel works best for making it readable and
maintainable.

:::

[fpbookclub_repo]: https://github.com/calebharris/fp_book_club_ts "Functional Programming in TypeScript on GitHub"
[jest]: https://jestjs.io/en/ "Jest"
[wikip_fib]: https://en.wikipedia.org/wiki/Fibonacci_number "Fibonacci number - Wikipedia"
