import * as t from "./tree";

const { Leaf, Branch, ...fns } = t;


describe("size", () => {
  test("of a Leaf is 1", () => {
    expect(fns.size(new Leaf("x"))).toEqual(1);
  });

  test("of a Branch and two Leaves is 3", () => {
    expect(fns.size(new Branch(new Leaf("x"), new Leaf("y")))).toEqual(3);
  });
});

describe("maximum", () => {
  test("of a Leaf is its value", () => {
    expect(fns.maximum(new Leaf(3))).toEqual(3);
  });

  test("of a Branch is the max of the subtrees", () => {
    expect(fns.maximum(new Branch(new Leaf(3), new Leaf(4)))).toEqual(4);
  });
});
