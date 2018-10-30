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

describe("depth",  () => {
  test("of a Leaf is 1", () => {
    expect(fns.depth(new Leaf("hello"))).toEqual(1);
  });

  test("of a Branch with two Leaves is 2", () => {
    expect(fns.depth(new Branch(new Leaf("hello"), new Leaf("world")))).toEqual(2);
  });

  test("of an unbalanced tree returns longest path", () => {
    expect(fns.depth(
        new Branch(
          new Leaf("hello"),
          new Branch(
            new Leaf("there"),
            new Leaf("people")
          )
        )
    )).toEqual(3);
  });
});

describe("map", () => {
  test("with identity function creates identical copy", () => {
    const id: <A>(a: A) => A = a => a;
    const ogTree = new Branch(new Leaf("one"), new Leaf("two"));
    const copyTree = fns.map(ogTree, id);
    expect(copyTree).toEqual(copyTree);
    expect(copyTree).not.toBe(ogTree);
  });

  test("applies the function", () => {
    expect(fns.map(new Leaf("lowercase"), s => s.toUpperCase())).toEqual(new Leaf("LOWERCASE"));
  });
});
