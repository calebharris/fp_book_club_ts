import { abs, factorialRecurse } from "./math";

describe("abs", () => {
  test("calculates the absolute value of a number", () => {
    expect(abs(-100)).toEqual(100);
    expect(abs(100)).toEqual(100);
    expect(abs(0)).toEqual(0);
  });
});

describe("factorial", () => {
  test("calculates the factorial of an integer", () => {
    expect(factorialRecurse(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => factorialRecurse(1.1)).toThrow();
  });
});
