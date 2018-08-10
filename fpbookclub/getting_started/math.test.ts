import { AssertionError } from "assert";
import { abs, factorialFor, factorialRecursive, factorialWhile, fib, formatResult, isSorted } from "./math";

describe("abs", () => {
  test("calculates the absolute value of a number", () => {
    expect(abs(-100)).toEqual(100);
    expect(abs(100)).toEqual(100);
    expect(abs(0)).toEqual(0);
  });
});

describe("factorialRecursive", () => {
  test("calculates the factorial of an integer", () => {
    expect(factorialRecursive(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => factorialRecursive(1.1)).toThrow(AssertionError);
  });
});

describe("factorialWhile", () => {
  test("calculates the factorial of an integer", () => {
    expect(factorialWhile(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => factorialWhile(1.1)).toThrow(AssertionError);
  });
});

describe("factorialFor", () => {
  test("calculates the factorial of an integer", () => {
    expect(factorialFor(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => factorialFor(1.1)).toThrow(AssertionError);
  });
});

describe("fib", () => {
  test("returns acceptable base cases", () => {
    expect(fib(1)).toEqual(0);
    expect(fib(2)).toEqual(1);
  });

  test("returns 1 for an input of 3", () => {
    expect(fib(3)).toEqual(1);
  });

  test("returns 2 for an input of 4", () => {
    expect(fib(4)).toEqual(2);
  });
});

describe("formatResult", () => {
  test("formats the result of a computation", () => {
    expect(formatResult("factorial", 6, factorialFor)).toEqual(
      "The factorial of 6 is 720");
  });
});

describe("isSorted", () => {
  test("returns true for [0, 1]", () => {
    expect(isSorted([0, 1], (a, b) => a <= b)).toEqual(true);
  });
});
