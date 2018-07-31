import * as impure from "./impure_example"
import * as testable from "./testable_example"

describe("the impure version of Cafe.buyCoffee()", () => {
  const { CreditCard, Cafe } = impure;

  test("causes a side effect", () => {
    const cc = new CreditCard();
    expect(cc.didCharge).toEqual(false);
    new Cafe().buyCoffee(cc);
    expect(cc.didCharge).toEqual(true);
  });
});

describe("the more testable version of Cafe.buyCoffee()", () => {
  const { CreditCard, Cafe } = testable;
  type Payments = testable.Payments;
  type CreditCard = testable.CreditCard;

  test("still causes a side effect", () => {
    // note the need for a mock object
    // this weird syntax is just creating an anonymous implementation of
    //   Payments and immediately instantiating it
    const mockPayments = new class implements Payments {
      didCharge: boolean = false;

      charge(cc: CreditCard, amount: number): void {
        console.log("Another side effect");
        this.didCharge = true;
      }
    }();

    const cc = new CreditCard();

    expect(mockPayments.didCharge).toEqual(false);
    new Cafe().buyCoffee(cc, mockPayments);
    expect(mockPayments.didCharge).toEqual(true);
  });
});
