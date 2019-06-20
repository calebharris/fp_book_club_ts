import { findFirst, findFirstString } from "./find_first";

const strings = ["lorem", "ipsum", "dolor", "sit"];
const numbers = [0, 1, 3, 6, 10];
const booleans = [true, true, true];

describe("findFirstString", () => {
  test("returns the index of the first matching string", () => {
    expect(findFirstString(strings, "ipsum")).toEqual(1);
  });

  test("returns -1 if no matching string is found", () => {
    expect(findFirstString(strings, "amet")).toEqual(-1);
  });
});

describe("findFirst", () => {
  test("works for strings", () => {
    expect(findFirst(strings, s => s === "ipsum")).toEqual(1);
    expect(findFirst(strings, s => s === "amet")).toEqual(-1);
  });

  test("...and numbers", () => {
    expect(findFirst(numbers, n => n === 6)).toEqual(3);
    expect(findFirst(numbers, n => n === 2)).toEqual(-1);
  });

  test("...and booleans", () => {
    expect(findFirst(booleans, b => b === true)).toEqual(0);
    expect(findFirst(booleans, b => b === false)).toEqual(-1);
  });
});
