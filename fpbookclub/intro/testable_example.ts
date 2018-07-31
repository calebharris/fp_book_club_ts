/**
 * A TypeScript program that's a little more testable, but still has side-
 * effects
 *
 * Adapted from Functional Programming in Scala listing 1.2
 **/

export class Coffee {
  readonly price: number = 2.99;
}

export class CreditCard {}

export interface Payments {
  /** Exists purely for its side-effects, since it doesn't return a value */
  charge(cc: CreditCard, amount: number): void
}

export class Cafe {
  buyCoffee(cc: CreditCard, p: Payments): Coffee {
    const cup = new Coffee();
    p.charge(cc, cup.price);
    return cup;
  }
}
