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
  append(this: Stream<A>, that: () => Stream<A>): Stream<A> {
    return this.foldRight(that, (a, b) => cons(() => a, b));
  }

  drop(this: Stream<A>, n: number): Stream<A> {
    if (n <= 0 || this.isEmpty())
      return this;
    return this.t().drop(n - 1);
  }

  dropWhile(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
    if (this.isEmpty())
      return empty();

    if (!p(this.h()))
      return this;

    return this.t().dropWhile(p);
  }

  headOption(this: Stream<A>): Option<A> {
    return this.foldRight(() => none(), (a, b) => some(a));
  }

  exists(this: Stream<A>, p: (a: A) => boolean): boolean {
    return this.foldRight(() => false, (a, b) => p(a) || b());
  }

  filter(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
    return this.foldRight(
      () => empty(),
      (a, b) => p(a) ? cons(() => a, b) : b(),
    );
  }

  find(this: Stream<A>, p: (a: A) => boolean): Option<A> {
    return this.filter(p).headOption();
  }

  flatMap<B>(this: Stream<A>, f: (a: A) => Stream<B>): Stream<B> {
    return this.foldRight(() => empty(), (a, b) => f(a).append(b));
  }

  foldRight<B>(this: Stream<A>, z: () => B, f: (a: A, b: () => B) => B): B {
    if (this.isEmpty())
      return z();

    const self = this;
    return f(self.h(), () => self.t().foldRight(z, f));
  }

  forAll(this: Stream<A>, p: (a: A) => boolean): boolean {
    if (this.isEmpty())
      return false;
    return this.foldRight(() => true, (a, b) => p(a) && b());
  }

  isEmpty(this: Stream<A>): this is Empty<A> {
    return this.tag === "empty";
  }

  map<B>(this: Stream<A>, f: (a: A) => B): Stream<B> {
    return unfold(this, s => {
      if (s.isEmpty())
        return none();
      else
        return some<[B, Stream<A>]>([f(s.h()), s.t()]);
    });
  }

  take(this: Stream<A>, n: number): Stream<A> {
    return unfold<A, [Stream<A>, number]>([this, n], ([s, m]) => {
      if (s.isEmpty() || m <= 0)
        return none();
      else
        return some<[A, [Stream<A>, number]]>([s.h(), [s.t(), m - 1]]);
    });
  }

  takeWhile(this: Stream<A>, p: (a: A) => boolean): Stream<A> {
    return unfold(this, s => {
      if (s.isEmpty() || !p(s.h()))
        return none();
      else
        return some<[A, Stream<A>]>([s.h(), s.t()]);
    });
  }

  toList(this: Stream<A>): List<A> {
    if (this.isEmpty())
      return list.nil();

    return list.cons(this.h(), this.t().toList());
  }

  zipAll<B>(this: Stream<A>, sb: Stream<B>): Stream<[Option<A>, Option<B>]> {
    const sa = this;
    return unfold<[Option<A>, Option<B>], [Stream<A>, Stream<B>]>(
      [sa, sb],
      ([sa1, sb1]) => {
        const left = sa1.headOption();
        const right = sb1.headOption();
        if (left.tag === "none" && right.tag === "none")
          return none();
        else {
          const leftS: Stream<A> = sa1.isEmpty() ? empty() : sa1.t();
          const rightS: Stream<B> = sb1.isEmpty() ? empty() : sb1.t();
          return some<[[Option<A>, Option<B>], [Stream<A>, Stream<B>]]>(
            [[left, right], [leftS, rightS]],
          );
        }
      },
    );
  }

  zipWith<B, C>(this: Stream<A>, sb: Stream<B>, f: (a: A, b: B) => C): Stream<C> {
    return unfold<C, [Stream<A>, Stream<B>]>([this, sb], ([sa1, sb1]) => {
      if (sa1.isEmpty() || sb1.isEmpty())
        return none();
      else
        return some<[C, [Stream<A>, Stream<B>]]>([f(sa1.h(), sb1.h()), [sa1.t(), sb1.t()]]);
    });
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
export const cons = <A>(hd: () => A, tl: () => Stream<A>): Stream<A> =>
  new Cons(util.memoize(hd), util.memoize(tl));

export const unfold = <A, S>(z: S, f: (s: S) => Option<[A, S]>): Stream<A> =>
  f(z)
    .map(([a, s1]) => cons(() => a, () => unfold(s1, f)))
    .getOrElse(() => empty());

export const constant = <A>(a: A): Stream<A> =>
  unfold(a, s => some<[A, A]>([a, a]));

export const fibs = (): Stream<number> =>
  unfold(
    [0, 1],
    ([n1, n2]) => some<[number, [number, number]]>([n1, [n2, n2 + n1]]),
  );

export const fromN = (n: number): Stream<number> =>
  unfold(n, s => some<[number, number]>([s, s + 1]));

/**
 * Smart constructor for creating an empty Stream of a particular type
 */
export const empty = <A>(): Stream<A> => Empty.EMPTY;

/**
 * An infinite stream of ones
 */
export const ones: Stream<number> = constant(1);

/**
 * Convenience method for constructing a Stream from multiple elements
 */
export const Stream = <A>(...aa: A[]): Stream<A> => {
  if (aa.length === 0)
    return empty();
  else
    return cons(() => aa[0], () => Stream(...aa.slice(1)));
};

export default { Cons, Empty, Stream, cons, constant, empty, fibs, ones, unfold };
