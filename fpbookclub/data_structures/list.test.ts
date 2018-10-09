import {
  List,
  Cons,
  Nil,
  addCorresponding,
  addOne,
  append,
  concat,
  drop,
  dropWhile,
  filter,
  flatMap,
  hasSubsequence,
  init,
  length,
  product,
  reverse,
  setHead,
  sum,
  tail,
  toString
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

describe("addCorresponding()", () => {
  test("adds corresponding elements", () => {
    expect(addCorresponding(List(1, 2, 3), List(4, 5, 6))).toEqual(List(5, 7, 9))
  });

  test("results in a list the same length as the shortest argument - left", () => {
    expect(addCorresponding(List(1, 2), List(3, 4, 5))).toEqual(List(4, 6));
  });

  test("results in a list the same length as the shortest argument - right", () => {
    expect(addCorresponding(List(1, 2, 3), List(4, 5))).toEqual(List(5, 7));
  });

  test("retuns Nil if the left argument is Nil", () => {
    expect(addCorresponding(List(), List(1, 2))).toEqual(Nil);
  });

  test("retuns Nil if the right argument is Nil", () => {
    expect(addCorresponding(List(1, 2), List())).toEqual(Nil);
  });
});

describe("addOne()", () => {
  test("adds one to each element in a list", () => {
    expect(addOne(List(10, 11, 12))).toEqual(List(11, 12, 13));
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

describe("concat()", () => {
  test("returns a flattened list", () => {
    expect(concat(List(
      List(1, 2),
      List(3, 4),
      List(5, 6)
    ))).toEqual(List(1, 2, 3, 4, 5, 6));
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
    expect(() => dropWhile(Nil, a => a === a)).toThrow();
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

describe("filter()", () => {
  test("returns only elements matching the predicate", () => {
    expect(filter(List(1, 2, 3), a => a % 2 === 1)).toEqual(List(1, 3));
  });
});

describe("flatMap()", () => {
  test("returns a flattened List", () => {
    expect(flatMap(List(1, 2), a => List(a))).toEqual(List(1, 2));
  });
});

describe("hasSubsequence()", () => {
  test("returns true if the subsequence is Nil", () => {
    expect(hasSubsequence(List(1, 2, 3), List())).toBeTruthy();
  });

  test("returns true if the subsequence exists", () => {
    expect(hasSubsequence(List("a", "b", "c"), List("b", "c"))).toBeTruthy();
  });

  test("returns false if the subsequence doesn't exist", () => {
    expect(hasSubsequence(List("a", "b", "c"), List("x", "y"))).toBeFalsy();
  });

  test("returns false if only a partial subsequence exists", () => {
    expect(hasSubsequence(List("a", "b", "c"), List("a", "y"))).toBeFalsy();
  });

  test("returns false if an interrupted subsequence exists", () => {
    expect(hasSubsequence(List("a", "b", "c", "a", "c"), List("a", "c"))).toBeTruthy();
  });
});

describe("init()", () => {
  test("of Nil throws an exception", () => {
    expect(() => init(Nil)).toThrow();
  });

  test("of one-element list is Nil", () => {
    expect(init(List("a"))).toEqual(Nil);
  });

  test("of longer list returns all but last element", () => {
    expect(init(List("a", "b", "c"))).toEqual(List("a", "b"));
  });
});

describe("length()", () => {
  test("returns 0 when list is Nil", () => {
    expect(length(Nil)).toEqual(0);
  });

  test("returns 1 for single-element list", () => {
    expect(length(List("a"))).toEqual(1);
  });

  test("returns 2 for two-element list", () => {
    expect(length(List("a", "b"))).toEqual(2);
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

describe("reverse()", () => {
  test("of Nil is Nil", () => {
    expect(reverse(List())).toEqual(Nil);
  });

  test("returns the reverse of a list", () => {
    expect(reverse(List(1, 2, 3))).toEqual(List(3, 2, 1));
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

describe("toString()", () => {
  test("converts each element to a string", () => {
    expect(toString(List(1, 2, 3))).toEqual(List("1", "2", "3"));
  });
});

