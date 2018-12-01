/**
 * math.ts - some math utils helpful mainly for learning functional programming
 */

import * as assert from "assert";

import {
  Cons,
  List,
  Nil,
  length,
  map,
  sum,
} from "../data_structures/list";

import {
  Option,
  Try,
  none,
  some,
} from "../error_handling/option";

/**
 * Our venerable abs function. You know what it does.
 */
export const abs = (n: number): number => {
  if (n < 0)
    return -n;
  else
    return n;
};

/**
 * A recursive factorial function
 */
export const factorialRecursive = (n: number): number => {
  assert(Number.isSafeInteger(n));

  const go = (i: number, acc: number): number => {
    if (i <= 0)
      return acc;
    else
      return go(i - 1, i * acc);
  };

  return go(n, 1);
};

/**
 * A factorial function with a while loop
 */
export const factorialWhile = (n: number): number => {
  assert(Number.isSafeInteger(n));

  let acc = 1;   // declare and initialize mutable variables
  let i = n;

  while (i > 0) {       // execute block until i <= 0
    acc = acc * i;
    i = i - 1;
  }

  return acc;
};

/**
 * A factorial function with a for loop
 */
export const factorialFor = (n: number): number => {
  assert(Number.isSafeInteger(n));
  let acc = 1;

  for (let i = n; i > 0; --i)    // set i to n and then loop until i <= 0
    acc *= i;

  return acc;
};

/**
 * An simpler alias for our preferred factorial implementation
 */
export const factorial = factorialFor;

/**
 * Tree-recursive Fibonacci sequence implementation
 */
export const fibTree = (n: number): number => {
  switch (n) {
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return fibTree(n - 1) + fibTree(n - 2);
  }
};

/**
 * Tail-recursive Fibonacci sequence implementation
 */
export const fibTail = (n: number): number => {
  const go = (i: number, a: number, b: number): number => {
    if (i <= 1)
      return a;
    else
      return go(i - 1, b, a + b);
  };

  return go(n, 0, 1);
};

/**
 * Iterative Fibonacci sequence implementation
 */
export const fib = (n: number): number => {
  let acc1 = 0;
  let acc2 = 1;

  for (let i = n; i > 1; --i) {
    const temp = acc1 + acc2;
    acc1 = acc2;
    acc2 = temp;
  }

  return acc1;
};

export const isSorted = <A>(vals: A[], ordered: (l: A, r: A) => boolean): boolean => {
  if (vals.length <= 1)
    return true;
  else
    return ordered(vals[0], vals[1]) && isSorted(vals.slice(1), ordered);
};

/**
 * A simple higher-order function for formatting the result of a computation
 */
export const formatResult = (name: string, x: number, f: (n: number) => number): string => {
  return `The ${name} of ${x} is ${f(x)}`;
};

/**
 * Returns the average of `xs`. Throws an exception if `xs` is empty
 */
export const mean = (xs: List<number>): number => {
  if (xs.tag === "nil")
    throw new Error("Attempt to take mean of empty list");

  return sum(xs) / length(xs);
};

/**
 * Returns a `Some` of the average of `xs`, or `None` if `xs` is empty
 */
export const meanOpt = (xs: List<number>): Option<number> => Try(() => mean(xs));

/**
 * Returns a `Some` of the variance of `xs`, or `None` if `xs` is empty
 */
export const variance = (xs: List<number>): Option<number> =>
  meanOpt(xs).flatMap(
    m => meanOpt(map(xs, x => Math.pow(x - m, 2))),
  );
