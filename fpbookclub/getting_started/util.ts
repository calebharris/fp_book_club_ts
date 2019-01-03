/**
 * util.ts - some useful functional programming utilities
 */

/**
 * Given two functions, where the second's return type is compatible with the
 * first's argument type, return a single function that combines both
 * computations.
 *
 * For example, if `b = g(a)`, `c = f(b)`, `h = compose(f, g)`, and `d = h(a)`,
 * then `c === d`.
 */
export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C =>
  a => f(g(a));

/**
 * Given a function of two arguments, return a function of one argument which
 * returns another function of one argument which returns the same result as
 * the provided function.
 *
 * For example, if `c = f(a, b)`, `g = curry(f)`, and `d = g(a)(b)`, then
 * `c === d`.
 */
export const curry = <A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C =>
  a => partial1(a, f);

/**
 * Given a thunk, return a new thunk that caches the result of the original
 * on the first execution, and returns the cached value thereafter.
 */
export const memoize = <A>(f: () => A): () => A => {
  let memo: A | null = null;
  return () => {
    if (memo === null)
      memo = f();
    return memo;
  };
};

/**
 * Given a function of two arguments, and a value compatible with the leftmost
 * argument, return a function of one argument that has the same result.
 *
 * For example, if `c = f(a, b)`, `g = partial1(a, f)`, and `d = g(b)`, then
 * `c === d`.
 */
export const partial1 = <A, B, C>(a: A, f: (a: A, b: B) => C): (b: B) => C =>
  b => f(a, b);

/**
 * Given a function of the same shape as that returned by `curry`, return a
 * function of two arguments that has the same result.
 *
 * For example, if `c = f(a)(b)`, `g = uncurry(f)`, and `d = g(a, b)`, then
 * `c === d`.
 */
export const uncurry = <A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C =>
  (a, b) => f(a)(b);

export default { compose, curry, memoize, partial1, uncurry };
