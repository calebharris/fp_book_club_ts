export type Option<A> = Some<A> | None;

abstract class OptionBase<A> {
  filter(this: Option<A>, p: (a: A) => boolean): Option<A> {
    throw new Error("Not implemented");
  }

  getOrElse<T extends U, U>(this: Option<T>, onEmpty: () => U): U {
    if (this.tag === "some") return this.value;
    return onEmpty();
  }

  map<B>(this: Option<A>, f: (a: A) => B): Option<B> {
    if (this.tag === "none") return NONE;
    return new Some(f(this.value));
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

export class None extends OptionBase<never> {
  readonly tag: "none" = "none";
}

export const NONE = new None();
