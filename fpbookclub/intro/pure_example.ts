/**
 * A TypeScript program that uses pure functions to describe a computation.
 * The description can be processed by a separate interpreter.
 *
 * Adapted from Functional Programming in Scala listing 1.3
 **/

export class Coffee {
  readonly price: number = 2.99;
}

export class CreditCard {}

/**
 * Represents an instruction to charge a given amount to a credit card.
 * Charges to the same credit card can be combined.
 **/
export class Charge {
  readonly cc: CreditCard;
  readonly amount: number;

  constructor(cc: CreditCard, amount: number) {
    this.cc = cc;
    this.amount = amount;
  }

  combine(other: Charge): Charge {
    if (this.cc == other.cc) {
      return new Charge(this.cc, this.amount + other.amount);
    } else {
      throw new Error("Can't combine charges to different cards");
    }
  }
}

export class Cafe {
  buyCoffee(cc: CreditCard): [Coffee, Charge] {
    const cup = new Coffee();
    const charge = new Charge(cc, cup.price);
    return [cup, charge];
  }

  /**
   * Return a bunch of coffees and single charge representing the total cost
   **/
  buyCoffees(cc: CreditCard, n: number): [Coffee[], Charge] {
    const cards: CreditCard[] = new Array(n).fill(cc);
    const purchases = Array.from(cards, cc => this.buyCoffee(cc));
    const [coffees, charges] = purchases.reduce(([coffees, charges], [coffee, charge]) => {
      coffees.push(coffee);
      charges.push(charge);
      return [coffees, charges];
    }, [new Array(), new Array()]) ;
    return [coffees, charges.reduce((l, r) => l.combine(r))];
  }
}
