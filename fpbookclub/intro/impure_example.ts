/**
 * A TypeScript program with side-effects
 *
 * Adapted from Functional Programming in Scala listing 1.1
 */

export class Coffee {
  readonly price: number = 2.99;
}

export class CreditCard {
  charge(price: number) {
    // The next comment just turns off a static analysis rule that forbids calls
    // to the console, which are generally not appropriate for production code,
    // but useful in this case.
    // tslint:disable-next-line:no-console
    console.log("Side effect! Charging the credit card...");
  }
}

export class Cafe {
  buyCoffee(cc: CreditCard): Coffee {
    const cup = new Coffee();
    cc.charge(cup.price);
    return cup;
  }
}
