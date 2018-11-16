import { Cons, List, foldRight } from "../data_structures/list";

/**
 * A type representing either the presence (`Some`) or absence (`None`) of a
 * value
 */
export type Option<A> = Some<A> | None<A>;

/**
 * Base trait for `Option` data constructors. Most methods should have an
 * explicit `this` parameter to ensure they can only be called on an `Option`
 */
abstract class OptionBase<A> {

  /**
   * If `this` is a `Some` and the value passes the predicate, returns `this`.
   * Otherwise returns `None`.
   */
  filter(this: Option<A>, p: (a: A) => boolean): Option<A> {
    return this.flatMap(a => p(a) ? some(a) : none());
  }

  /**
   * If `this` is a `Some`, returns the result of applying `f` to the value.
   * Otherwise returns `None`.
   */
  flatMap<B>(this: Option<A>, f: (a: A) => Option<B>): Option<B> {
    return this.map(f).getOrElse(() => none());
  }

  /**
   * If `this` is a `Some`, returns the value. Otherwise, returns the result of
   * `onEmpty`.
   */
  getOrElse<T extends U, U>(this: Option<T>, onEmpty: () => U): U {
    if (this.tag === "none") return onEmpty();
    return this.value;
  }

  /**
   * If `this` is a `Some`, returns a new `Some` containing the result of
   * applying `f` to the value. Otherwise returns `None`.
   */
  map<B>(this: Option<A>, f: (a: A) => B): Option<B> {
    if (this.tag === "none") return none();
    return some(f(this.value));
  }

  /**
   * Returns `this` if it is a `Some`. Otherwise returns the result of calling
   * `ou`.
   */
  orElse<T extends U, U>(this: Option<T>, ou: () => Option<U>): Option<U> {
    return this.map(a => some(a)).getOrElse(() => ou());
  }
}

/**
 * Data constructor representing the presence of a value of type `A`
 */
export class Some<A> extends OptionBase<A> {
  readonly tag: "some" = "some";

  constructor(readonly value: A) {
    super();
  }
}

/**
 * Data constructor representing the absence of a value of type `A`
 */
export class None<A> extends OptionBase<A> {

  /**
   * Value that is always returned in case of a `None`
   */
  static readonly NONE: Option<never> = new None();

  readonly tag: "none" = "none";

  private constructor() {
    super();
  }
}

/**
 * Smart constructor for None, which always returns `None.NONE`
 */
export const none: <A>() => Option<A> = () => None.NONE;

/**
 * Smart constructor for `Some`
 */
export const some: <A>(a: A) => Option<A> = a => new Some(a);

/**
 * Evaluate `f` and return the result in a `Some` if it completes
 * successfully. If it throws an exception, return `None`.
 */
export const Try: <A>(f: () => A) => Option<A> = f => {
  try {
    return some(f());
  } catch (e) {
    return none();
  }
};

/**
 * Lift `f` into the `Option` context
 */
export const lift: <A, B>(f: (a: A) => B) => (o: Option<A>) => Option<B> =
  f => o => o.map(f);

/**
 * If `a` and `b` are both `Some`, apply `f` to their contained values and
 * return the result in a `Some`. Otherwise, return `None`.
 */
export const map2: <A, B, C>(a: Option<A>,
                             b: Option<B>,
                             f: (a: A, b: B) => C) => Option<C> =
  (oa, ob, f) => oa.flatMap(a => ob.map(b => f(a, b)));

/**
 * Like map2, but with three input `Options`
 */
export const map3: <A, B, C, D>(a: Option<A>,
                                b: Option<B>,
                                c: Option<C>,
                                f: (a: A, b: B, c: C) => D) => Option<D> =
  (oa, ob, oc, f) => oa.flatMap(a => ob.flatMap(b => oc.map(c => f(a, b, c))));

/**
 * Given a list of `Options`, if they all are `Some`, return a single `Option`
 * containing a list of all the values. Otherwise, return `None`.
 */
export const sequence: <A>(ls: List<Option<A>>) => Option<List<A>> =
  ls => {
    if (ls.tag === "nil")
      return none();
    else
      return foldRight(
        ls,
        some(List()),
        (oa, ol) => {
          if (oa.tag === "none")
            return none();
          else
            return ol.map(la => new Cons(oa.value, la));
        },
      );
  };
