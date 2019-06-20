import { AssertionError } from "assert";

import { List } from "../data_structures/list";
import { Option, none, some } from "../error_handling/option";

import * as math from "./math";

describe("abs", () => {
  test("calculates the absolute value of a number", () => {
    expect(math.abs(-100)).toEqual(100);
    expect(math.abs(100)).toEqual(100);
    expect(math.abs(0)).toEqual(0);
  });
});

describe("factorialRecursive", () => {
  test("calculates the factorial of an integer", () => {
    expect(math.factorialRecursive(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => math.factorialRecursive(1.1)).toThrow(AssertionError);
  });
});

describe("factorialWhile", () => {
  test("calculates the factorial of an integer", () => {
    expect(math.factorialWhile(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => math.factorialWhile(1.1)).toThrow(AssertionError);
  });
});

describe("factorialFor", () => {
  test("calculates the factorial of an integer", () => {
    expect(math.factorialFor(6)).toEqual(720);
  });

  test("throws an exception with non-integer arguments", () => {
    expect(() => math.factorialFor(1.1)).toThrow(AssertionError);
  });
});

describe("fib", () => {
  test("returns acceptable base cases", () => {
    expect(math.fib(1)).toEqual(0);
    expect(math.fib(2)).toEqual(1);
  });

  test("returns 1 for an input of 3", () => {
    expect(math.fib(3)).toEqual(1);
  });

  test("returns 2 for an input of 4", () => {
    expect(math.fib(4)).toEqual(2);
  });
});

describe("fibTail", () => {
  test("returns acceptable base cases", () => {
    expect(math.fibTail(1)).toEqual(0);
    expect(math.fibTail(2)).toEqual(1);
  });

  test("returns 1 for an input of 3", () => {
    expect(math.fibTail(3)).toEqual(1);
  });

  test("returns 2 for an input of 4", () => {
    expect(math.fibTail(4)).toEqual(2);
  });
});

describe("fibTree", () => {
  test("returns acceptable base cases", () => {
    expect(math.fibTree(1)).toEqual(0);
    expect(math.fibTree(2)).toEqual(1);
  });

  test("returns 1 for an input of 3", () => {
    expect(math.fibTree(3)).toEqual(1);
  });

  test("returns 2 for an input of 4", () => {
    expect(math.fibTree(4)).toEqual(2);
  });
});

describe("formatResult", () => {
  test("formats the result of a computation", () => {
    expect(math.formatResult("factorial", 6, math.factorialFor)).toEqual(
      "The factorial of 6 is 720");
  });
});

describe("isSorted", () => {
  test("returns true for [0, 1]", () => {
    expect(math.isSorted([0, 1], (a, b) => a <= b)).toEqual(true);
  });
});

describe("variance", () => {
  test("returns some(0) when list has all same values", () => {
    expect(math.variance(List(1, 1, 1))).toEqual(some(0));
  });

  test("returns some(1) for List(2, 4)", () => {
    expect(math.variance(List(2, 4))).toEqual(some(1));
  });

  test("returns none for an empty list", () => {
    expect(math.variance(List())).toEqual(none());
  });
});
