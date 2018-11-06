import { compose, curry, partial1, uncurry } from "./util";

describe("curry()", () => {
  test("returns two nested functions", () => {
    const add = (x: number, y: number) => x + y;
    const curriedAdd = curry(add);
    const result = curriedAdd(1)(1);
    expect(result).toEqual(add(1, 1));
  });
});

describe("uncurry()", () => {
  test("returns a flat function", () => {
    const curriedAdd = (x: number) => (y: number) => x + y;
    const uncurriedAdd = uncurry(curriedAdd);
    const result = uncurriedAdd(1, 1);
    expect(result).toEqual(curriedAdd(1)(1));
  });
});

describe("compose()", () => {
  test("returns a function equal to f and then g", () => {
    const addTen = (x: number) => x + 10;
    const triple = (x: number) => x * 3;
    const addTenAndTriple = compose(triple, addTen);
    const result = addTenAndTriple(1);
    expect(result).toEqual(33);
  });
});
