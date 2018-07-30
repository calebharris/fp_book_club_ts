/**
 * A TypeScript program with side-effects
 *
 * Adapted from Function Programming in Scala listing 1.1
 **/

export class Coffee {
  readonly price: number = 2.99;
}

export class CreditCard {
  charge(price: number) {
    console.log("Side effect! Charging the credit card...");
  }
}

export class Cafe {
  buyCoffee(cc: CreditCard): Coffee {
    let cup = new Coffee();
    cc.charge(cup.price);
    return cup;
  }
}

