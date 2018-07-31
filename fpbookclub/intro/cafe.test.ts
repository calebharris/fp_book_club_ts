import { Coffee, CreditCard, Cafe } from "./impure_example"

test("returns a Coffee", () => {
  expect(new Cafe().buyCoffee(new CreditCard())).toEqual(new Coffee());
});
