export type Option<A> = Some<A> | None;

abstract class OptionBase<A> {
  isSome(): boolean {
    return (this instanceof Some);
  }

  map<B>(f: (a: A) => B): Option<B> {
    if (this instanceof Some) {
      return new Some(f(this.value));
    }
    return NONE;
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
