import { abs } from "./abs";

test("abs computes the absolute value of a number", () => {
  expect(abs(-42)).toEqual(42);
  expect(abs(42)).toEqual(42);
  expect(abs(0)).toEqual(0);
});
