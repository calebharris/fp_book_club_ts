import { List, Cons, Nil, tail, setHead, drop, dropWhile, append, product, sum } from "./list";

describe("List()", () => {
  test("returns Nil when passed no arguments", () => {
    expect(List()).toBe(Nil);
  });

  test("returns a List of one element when passed one argument", () => {
    const l = List("Hello!");
    expect(l).toBeInstanceOf(Cons);
    if (l instanceof Cons) {
      expect(l.head).toEqual("Hello!");
      expect(l.tail).toBe(Nil);
    }
  });
});

describe("tail()", () => {
  test("removes the first element", () => {
    expect(tail(List(1, 2))).toEqual(List(2));
  });
  test("returns nil when the only element of a list is removed", () => {
    expect(tail(List(1))).toEqual(Nil);
  });
  test("does something when nil", () => {
    expect(tail(List())).toEqual(Nil);
  });
});

describe("setHead()", () => {
  test("replaces first element", () => {
    expect(setHead(List(1, 2, 3), 4)).toEqual(List(4,2,3));
  });
});

describe("drop()", () => {
  test("removes 2 elements", () => {
    expect(drop(List(1,2,3,4), 2)).toEqual(List(3,4));
  });
});

describe("dropWhile()", () => {
  test("removes stuff", () => {
    expect(dropWhile(List(2,2,2,2,3,4,5), i => i % 2 === 0)).toEqual(List(3,4,5));
  });
});

describe("append()", () => {
  test("is equal to the other argument when either is Nil", () => {
    expect(append(Nil, List(1, 2))).toEqual(List(1, 2));
    expect(append(List(1, 2), Nil)).toEqual(List(1, 2));
  });

  test("contains elements from both lists in order", () => {
    expect(append(List("a"), List("b", "c"))).toEqual(List("a", "b", "c"));
  });
});

describe("product()", () => {
  test("returns 1.0 when passed an empty List", () => {
    expect(product(List())).toEqual(1.0);
  });

  test("returns the correct product", () => {
    expect(product(List(1, 2, 3, 4))).toEqual(24.0);
  });
});

describe("sum()", () => {
  test("returns zero when passed an empty List", () => {
    expect(sum(List())).toEqual(0);
  });

  test("returns the correct sum", () => {
    expect(sum(List(1, 2, 3))).toEqual(6);
  });
});
