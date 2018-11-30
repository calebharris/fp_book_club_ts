/**
 * A type representing a value that can be one of two types
 */
export type Either<E, A> = Left<E> | Right<A>;

/**
 * Base trait for `Either` data constructors. Most methods should have an
 * explicit `this` parameter to ensure they can only be called on `Either`
 */
abstract class EitherBase<E, A> {
  /**
   * If `this` is a `Right`, returns the result of evaluating `f`. Otherwise,
   * returns `this`.
   */
  flatMap<F extends G, G, B>(this: Either<F, A>, f: (a: A) => Either<G, B>): Either<G, B> {
    throw new Error("Unimplemented");
  }

  /**
   * If `this` is a `Right`, returns a new `Right` containing a value
   * transformed by `f`. Otherwise, returns `this`.
   */
  map<B>(this: Either<E, A>, f: (a: A) => B): Either<E, B> {
    throw new Error("Unimplemented");
  }

  /**
   * Returns `this` if it's `Right`. Otherwise, returns the result of `b()`
   */
  orElse<F extends G, G, T extends U, U>(this: Either<F, T>, b: () => Either<G, U>): Either<G, U> {
    throw new Error("Unimplemented");
  }
}

/**
 * Data constructor representing the "left" type, often used to indicate an
 * error
 */
export class Left<E> extends EitherBase<E, never> {
  readonly tag: "left" = "left";

  constructor(readonly value: E) {
    super();
  }
}

/**
 * Data constructor representing the "right" type, often used to indicate a
 * successful result
 */
export class Right<A> extends EitherBase<never, A> {
  readonly tag: "right" = "right";

  constructor(readonly value: A) {
    super();
  }
}

/**
 * Smart constructor for `Left`
 */
export const left = <E, A>(val: E): Either<E, A> => new Left(val);

/**
 * Smart constructor for `Right`
 */
export const right = <E, A>(val: A): Either<E, A> => new Right(val);

/**
 * If both `e1` and `e2` are `Right`s, apply `f` to their contained values and
 * return the result in a `Right`. Otherwise, return the first `Left`
 * encountered
 */
export const map2 = <E, A, B, C>(
    e1: Either<E, A>,
    e2: Either<E, B>,
    f: (a: A, b: B) => C): Either<E, C> => {
  throw new Error("Unimplemented");
};

/**
 * Evaluate `f` and return the result in a `Right` if it completes
 * successfully. If it throws an `Error`, return it in a `Left`. If it throws
 * anything else, wrap the thrown value in an `Error` before returning it in a
 * `Left`.
 */
export const Try = <A>(f: () => A): Either<Error, A> => {
  try {
    return right(f());
  } catch (e) {
    if (e instanceof Error)
      return left(e);
    else
      return left(new Error(e));
  }
};
