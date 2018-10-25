export type Option<A> = Some<A> | None<A>;

abstract class OptionBase<A> {
  filter(this: Option<A>, p: (a: A) => boolean): Option<A> {
    if (this.tag === "some") {
      if (p(this.value)) return this;
      else return NONE;
    }
    return NONE;
  }

  flatMap<B>(this: Option<A>, f: (a: A) => Option<B>): Option<B> {
    if (this.tag === "some") return f(this.value);
    return NONE;
  }

  getOrElse<T extends U, U>(this: Option<T>, onEmpty: () => U): U {
    if (this.tag === "some") return this.value;
    return onEmpty();
  }

  map<B>(this: Option<A>, f: (a: A) => B): Option<B> {
    if (this.tag === "none") return NONE;
    return new Some(f(this.value));
  }

  orElse<T extends U, U>(this: Option<T>, ou: () => Option<U>): Option<U> {
    if (this.tag === "none") return ou();
    return this;
  }
}

export class Some<A> extends OptionBase<A> {
  readonly tag: "some" = "some";
  readonly value: A;

  constructor(value: A) {
    super();
    this.value = value;
  }
}

export class None<A> extends OptionBase<A> {
  readonly tag: "none" = "none";
}

export const NONE: Option<never> = new None();

export function lift<A, B>(f: (a: A) => B): (o: Option<A>) => Option<B> {
  return o => o.map(f);
}
