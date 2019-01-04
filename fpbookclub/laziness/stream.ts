import list, { List } from "../data_structures/list";
import { Option, none, some } from "../error_handling/option";
import util from "../getting_started/util";

/**
 * A `Stream` element is either an `Empty` or a `Cons`, analagous to the `Nil`
 * and `Cons` data constructors of `List`.
 */
export type Stream<A> = Empty<A> | Cons<A>;

/**
 * Base trait for `Stream` data constructors
 */
abstract class StreamBase<A> {
  headOption(this: Stream<A>): Option<A> {
    if (this.tag === "empty")
      return none();
    else
      return some(this.h());
  }

  exists(this: Stream<A>, p: (a: A) => boolean): boolean {
    return this.foldRight(() => false, (a, b) => p(a) || b());
  }

  foldRight<B>(this: Stream<A>, z: () => B, f: (a: A, b: () => B) => B): B {
    if (this.isEmpty())
      return z();

    const self = this;
    return f(self.h(), () => self.t().foldRight(z, f));
  }

  isEmpty(this: Stream<A>): this is Empty<A> {
    return this.tag === "empty";
  }

  take(this: Stream<A>, n: number): Stream<A> {
    if (this.isEmpty() || n <= 0)
      return empty();

    // Needed to work around an issue in Typescript's type inferencing, where
    // the narrowing of `this` to `Cons` is lost in the tail closure passed to
    // `cons`. See https://github.com/Microsoft/TypeScript/issues/29260
    const self = this;
    return cons(this.h, () => self.t().take(n - 1));
  }

  toList(this: Stream<A>): List<A> {
    if (this.isEmpty())
      return list.nil();

    return list.cons(this.h(), this.t().toList());
  }
}

/**
 * `Empty` data constructor, which creates the singleton `Empty` value that
 * we'll always use.
 */
export class Empty<A> extends StreamBase<A> {
  static readonly EMPTY: Stream<never> = new Empty();

  readonly tag: "empty" = "empty";

  private constructor() {
    super();
  }
}

/**
 * A nonempty stream consists of a head and a tail, both of which are
 * non-strict
 */
export class Cons<A> extends StreamBase<A> {
  readonly tag: "cons" = "cons";

  constructor(readonly h: () => A, readonly t: () => Stream<A>) {
    super();
  }
}

/**
 * Smart constructor for creating a nonempty Stream
 */
export const cons = <A >(hd: () => A, tl: () => Stream<A>): Stream<A> =>
  new Cons(util.memoize(hd), util.memoize(tl));

/**
 * Smart constructor for creating an empty Stream of a particular type
 */
export const empty = <A>(): Stream<A> => Empty.EMPTY;

/**
 * Convenience method for constructing a Stream from multiple elements
 */
export const Stream = <A>(...aa: A[]): Stream<A> => {
  if (aa.length === 0)
    return empty();
  else
    return cons(() => aa[0], () => Stream(...aa.slice(1)));
};

export default { Cons, Empty, Stream, cons, empty };
