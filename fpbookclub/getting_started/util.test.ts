import { compose, curry, partial1, uncurry } from "./util";

describe("curry()", () => {
  test("returns two nested functions", () => {
    function add(x: number, y: number): number {
      return x + y
    };
    const curried_add = curry(add);
    const result = curried_add(1)(1);
    expect(result).toEqual(add(1, 1));
  });
});

describe("uncurry()", () => {
  test("returns a flat function", () => {
    const curried_add: (x: number) => (y: number) => number = (x) => {
      return (y: number) => x + y;
    };
    const uncurried_add = uncurry(curried_add);
    const result = uncurried_add(1, 1);
    expect(result).toEqual(curried_add(1)(1));
  });
});

describe("compose()", () => {
  test("returns a function equal to f and then g", () => {
    function addTen(x: number): number {
      return x + 10;
    };
    function triple(x: number): number {
      return x * 3;
    };
    const addTenAndTriple = compose(triple, addTen);
    const result = addTenAndTriple(1);
    expect(result).toEqual(33);
  });
});
