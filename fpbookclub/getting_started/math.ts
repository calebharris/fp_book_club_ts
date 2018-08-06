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
 * A simple higher-order function for formatting the result of a computation
 **/
export function formatResult(name: string, x: number, f: (n: number) => number): string {
  return `The ${name} of ${x} is ${f(x)}`;
}
