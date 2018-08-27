import {
  List,
  Cons,
  Nil,
  append,
  drop,
  dropWhile,
  product,
  setHead,
  sum,
  tail
} from "./list";

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

describe("append()", () => {
  test("is equal to the other argument when either is Nil", () => {
    expect(append(Nil, List(1, 2))).toEqual(List(1, 2));
    expect(append(List(1, 2), Nil)).toEqual(List(1, 2));
  });

  test("contains elements from both lists in order", () => {
    expect(append(List("a"), List("b", "c"))).toEqual(List("a", "b", "c"));
  });
});

describe("drop()", () => {
  test("of Nil throws an exception", () => {
    expect(() => drop(Nil, 5)).toThrow();
  });

  test("throws an exception when the list's length is <= 0", () => {
    expect(() => drop(List("x", "y"), 2)).toThrow();
    expect(() => drop(List("x", "y"), 3)).toThrow();
  });

  test("returns the list when n is 0", () => {
    expect(drop(List("x", "y", "z"), 0)).toEqual(List("x", "y", "z"));
  });

  test("returns a copy of the list missing the first n elements", () => {
    expect(drop(List("x", "y", "z"), 2)).toEqual(List("z"));
  });
});

describe("dropWhile()", () => {
  test("of Nil throws an exception", () => {
    expect(() => dropWhile(Nil, a => a === a));
  });

  test("returns the whole list if p is the `false` constant function", () => {
    expect(dropWhile(List(1, 2, 3), a => false)).toEqual(List(1, 2, 3));
  });

  test("returns Nil if p is the `true` constant function", () => {
    expect(dropWhile(List(1, 2, 3), a => true)).toEqual(Nil);
  });

  test("returns the list minus the matching prefix", () => {
    expect(dropWhile(List(1, 3, 4, 6), a => a % 2 === 1)).toEqual(List(4, 6));
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

describe("setHead()", () => {
  test("of Nil throws an exception", () => {
    expect(() => setHead(Nil, "x")).toThrow();
  });

  test("of one-element list returns new one-element list", () => {
    expect(setHead(List(1), 2)).toEqual(List(2));
  });

  test("of multi-element list returns list differing only in first element", () => {
    expect(setHead(List(1, 2), 3)).toEqual(List(3, 2));
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

describe("tail()", () => {
  test("of Nil throws an exception", () => {
    expect(() => tail(Nil)).toThrow();
  });

  test("of a one-element list is Nil", () => {
    expect(tail(List(1))).toEqual(Nil);
  });

  test("of a multi-element list is everything after the head", () => {
    expect(tail(List(1, 2))).toEqual(List(2));
  });
});
