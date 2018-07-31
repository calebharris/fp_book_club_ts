import * as impure from "./impure_example";
import * as testable from "./testable_example";
import * as pure from "./pure_example";

describe("the impure version of Cafe", () => {
  //destructuring assignment to be able to call CreditCard() and Cafe() without
  //  the `impure` prefix.
  const { CreditCard, Cafe } = impure;

  test("causes a side effect when you buyCoffee()", () => {
    const cc = new CreditCard();
    const cup = new Cafe().buyCoffee(cc);

    //not much to usefully assert here. How do we know the charge happened,
    //and was for the right amount?
    expect(cup).toBeTruthy();
  });
});

describe("the more testable version of Cafe", () => {
  const { CreditCard, Cafe } = testable;

  //type aliases, again to remove the need for the module variable prefix
  type Payments = testable.Payments;
  type CreditCard = testable.CreditCard;

  test("still causes a side effect when you buyCoffee()", () => {
    //note the need for a mock object
    //this weird syntax is just creating an anonymous implementation of
    //  Payments and immediately instantiating it
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

describe("the pure version of Cafe", () => {
  const { CreditCard, Cafe } = pure;

  // no more awkward mock objects or tracking of side effects
  test("simply returns a Charge when you buyCoffee()", () => {
    const cc = new CreditCard();
    const [cup, charge] = new Cafe().buyCoffee(cc);
    expect(charge.cc).toEqual(cc);
    expect(charge.amount).toEqual(cup.price);
  });

  test("allows us to combine charges for batch processing", () => {
    const cc = new CreditCard();
    const [coffees, charge] = new Cafe().buyCoffees(cc, 3);
    expect(coffees.length).toBe(3);
    expect(charge.amount).toBe(3 * coffees[0].price);
  });
});
