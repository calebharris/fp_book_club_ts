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
export function factorialRecurse(n: number): number {
  assert(Number.isSafeInteger(n));

  const go = (n: number, acc: number): number => {
    if (n <= 0)
      return acc;
    else
      return go(n - 1, n * acc);
  }

  return go(n, 1);
}
