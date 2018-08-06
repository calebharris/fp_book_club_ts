import { AssertionError } from "assert";
import { abs, factorialFor, factorialRecursive, factorialWhile, formatResult } from "./math";

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

describe("formatResult", () => {
  test("formats the result of a computation", () => {
    expect(formatResult("factorial", 6, factorialFor)).toEqual(
      "The factorial of 6 is 720");
  });
});
