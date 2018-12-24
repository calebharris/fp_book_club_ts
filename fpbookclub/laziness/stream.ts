import { Option, none, some } from "../error_handling/option";

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
}

export class Empty<A> extends StreamBase<A> {
  static readonly EMPTY: Stream<never> = new Empty();

  readonly tag: "empty" = "empty";

  private constructor() {
    super();
  }
}

export class Cons<A> extends StreamBase<A> {
  readonly tag: "cons" = "cons";

  constructor(readonly h: () => A, readonly t: () => Stream<A>) {
    super();
  }
}

const memoize = <A>(f: () => A): () => A => {
  let memo: A | null = null;
  return () => {
    if (memo === null)
      memo = f();
    return memo;
  };
};

export const cons = <A >(hd: () => A, tl: () => Stream<A>): Stream<A> => {
  return new Cons(memoize(hd), tl);
};

export const empty = <A>(): Stream<A> => Empty.EMPTY;

export const Stream = <A>(...aa: A[]): Stream<A> => {
  if (aa.length === 0)
    return empty();
  else
    return cons(() => aa[0], () => Stream(...aa.slice(1)));
};

export default { Cons, Empty, Stream, cons, empty };
