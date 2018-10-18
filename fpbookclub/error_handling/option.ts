export type Option<A> = Some<A> | None;

abstract class OptionBase<A> {
  filter(p: (a: A) => boolean): Option<A> {

    throw new Error("Not implemented");
  }

  getOrElse(onEmpty: () => A): A {
    if (this.isSome()) {
      return this.value;
    }
    return onEmpty();
  }

  isNone(): this is None {
    return (this instanceof None);
  }

  isSome(): this is Some<A> {
    return (this instanceof Some);
  }

  map<B>(f: (a: A) => B): Option<B> {
    throw new Error("Not implemented");
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

export function none<A>(): Option<A> {
  return NONE;
}
