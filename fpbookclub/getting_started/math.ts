/**
 * math.ts - some math utils helpful mainly for learning functional programming
 **/

import * as assert from "assert";

/**
 * Our venerable abs function. You know what it does.
 **/
export function abs(n: number): number {
  if (n < 0)
    return -n;
  else
    return n;
}

/**
 * A recursive factorial function
 **/
export function factorialRecursive(n: number): number {
  assert(Number.isSafeInteger(n));

  const go = function(n: number, acc: number): number {
    if (n <= 0)
      return acc;
    else
      return go(n - 1, n * acc);
  }

  return go(n, 1);
}

/**
 * A factorial function with a while loop
 **/
export function factorialWhile(n: number): number {
  assert(Number.isSafeInteger(n));

  let acc = 1, i = n;   // declare and initialize mutable variables
  while (i > 0) {       // execute block until i <= 0
    acc = acc * i;
    i = i - 1;
  }

  return acc;
}

/**
 * A factorial function with a for loop
 **/
export function factorialFor(n: number): number {
  assert(Number.isSafeInteger(n));
  let acc = 1;

  for (let i = n; i > 0; --i) {  // set i to n and then loop until i <= 0
    acc *= i;
  }

  return acc;
}

/**
 * An simpler alias for our preferred factorial implementation
 **/
export const factorial = factorialFor;

/**
 * Tree-recursive Fibonacci sequence implementation
 **/
export function fibTree(n: number): number {
  switch (n) {
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return fibTree(n - 1) + fibTree(n - 2);
  }
}

/**
 * Tail-recursive Fibonacci sequence implementation
 **/
export function fibTail(n: number): number {
  function go(n: number, a: number, b: number): number {
    if (n <= 1)
      return a;
    else
      return go(n - 1, b, a + b);
  }

  return go(n, 0, 1);
}

/**
 * Iterative Fibonacci sequence implementation
 **/
export function fib(n: number): number {
  let acc1 = 0, acc2 = 1;

  for (let i = n; i > 1; --i) {
    let temp = acc1 + acc2;
    acc1 = acc2;
    acc2 = temp;
  }

  return acc1;
}

export function isSorted<A>(vals: A[], ordered: (l: A, r: A) => boolean): boolean {
  if (vals.length <= 1)
    return true;
  else
    return ordered(vals[0], vals[1]) && isSorted(vals.slice(1), ordered);
}

/**
 * A simple higher-order function for formatting the result of a computation
 **/
export function formatResult(name: string, x: number, f: (n: number) => number): string {
  return `The ${name} of ${x} is ${f(x)}`;
}
