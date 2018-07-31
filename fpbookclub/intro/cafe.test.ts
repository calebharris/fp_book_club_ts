import * as impure from "./impure_example"

describe("the impure version of Cafe.buyCoffee()", () => {
  const { CreditCard, Cafe } = impure;

  test("causes a side effect", () => {
    const cc = new CreditCard();
    expect(cc.didCharge).toEqual(false);
    new Cafe().buyCoffee(cc);
    expect(cc.didCharge).toEqual(true);
  })
});
