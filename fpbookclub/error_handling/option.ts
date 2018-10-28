/**
 * A type representing either the presence (`Some`) or absence (`None`) of a
 * value
 **/
export type Option<A> = Some<A> | None<A>;

/**
 * Base trait for `Option` data constructors. Most methods should have an
 * explicit `this` parameter to ensure they can only be called on an `Option`
 **/
abstract class OptionBase<A> {

  /**
   * If `this` is a `Some` and the value passes the predicate, returns `this`.
   * Otherwise returns `None`.
   **/
  filter(this: Option<A>, p: (a: A) => boolean): Option<A> {
    if (this.tag === "some" && p(this.value)) return this;
    return none();
  }

  /**
   * If `this` is a `Some`, returns the result of applying `f` to the value.
   * Otherwise returns `None`.
   **/
  flatMap<B>(this: Option<A>, f: (a: A) => Option<B>): Option<B> {
    if (this.tag === "none") return none();
    return f(this.value);
  }

  /**
   * If `this` is a `Some`, returns the value. Otherwise, returns the result of
   * `onEmpty`.
   **/
  getOrElse<T extends U, U>(this: Option<T>, onEmpty: () => U): U {
    if (this.tag === "none") return onEmpty();
    return this.value;
  }

  /**
   * If `this` is a `Some`, returns a new `Some` containing the result of
   * applying `f` to the value. Otherwise returns `None`.
   **/
  map<B>(this: Option<A>, f: (a: A) => B): Option<B> {
    if (this.tag === "none") return none();
    return some(f(this.value));
  }

  /**
   * Returns `this` if it is a `Some`. Otherwise returns the result of calling
   * `ou`.
   **/
  orElse<T extends U, U>(this: Option<T>, ou: () => Option<U>): Option<U> {
    if (this.tag === "none") return ou();
    return this;
  }
}

/**
 * Data constructor representing the presence of a value of type `A`
 **/
export class Some<A> extends OptionBase<A> {
  readonly tag: "some" = "some";

  constructor(readonly value: A) {
    super();
  }
}

/**
 * Data constructor representing the absence of a value of type `A`
 **/
export class None<A> extends OptionBase<A> {

  /**
  * Value that is always returned in case of a `None`
  **/
  static readonly NONE: Option<never> = new None();

  readonly tag: "none" = "none";

  private constructor() {
    super();
  }
}

/**
 * Smart constructor for None, which always returns `None.NONE`
 **/
export const none: <A>() => Option<A> = () => None.NONE;

/**
 * Smart constructor for `Some`
 **/
export const some: <A>(a: A) => Option<A> = a => new Some(a);

/**
 * Lift `f` into the `Option` context
 **/
export const lift: <A, B>(f: (a: A) => B) => (o: Option<A>) => Option<B> =
  f => o => o.map(f);
