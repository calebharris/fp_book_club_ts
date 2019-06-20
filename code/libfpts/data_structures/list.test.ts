import list, { Cons, List, Nil, nil } from "./list";

describe("List()", () => {
  test("returns Nil when passed no arguments", () => {
    expect(List()).toBe(nil());
  });

  test("returns a List of one element when passed one argument", () => {
    const l = List("Hello!");
    expect(l).toBeInstanceOf(Cons);
    if (l instanceof Cons) {
      expect(l.head).toEqual("Hello!");
      expect(l.tail).toBe(nil());
    }
  });
});

describe("addCorresponding()", () => {
  test("adds corresponding elements", () => {
    expect(List(1, 2, 3).addCorresponding(List(4, 5, 6))).toEqual(List(5, 7, 9));
  });

  test("results in a list the same length as the shortest argument - left", () => {
    expect(List(1, 2).addCorresponding(List(3, 4, 5))).toEqual(List(4, 6));
  });

  test("results in a list the same length as the shortest argument - right", () => {
    expect(List(1, 2, 3).addCorresponding(List(4, 5))).toEqual(List(5, 7));
  });

  test("retuns Nil if the left argument is Nil", () => {
    expect(List<number>().addCorresponding(List(1, 2))).toEqual(nil());
  });

  test("retuns Nil if the right argument is Nil", () => {
    expect(List(1, 2).addCorresponding(List())).toEqual(nil());
  });
});

describe("addOne()", () => {
  test("adds one to each element in a list", () => {
    expect(List(10, 11, 12).addOne()).toEqual(List(11, 12, 13));
  });
});

describe("append()", () => {
  test("is equal to the other argument when either is Nil", () => {
    expect(nil().append(List(1, 2))).toEqual(List(1, 2));
    expect(List(1, 2).append(nil())).toEqual(List(1, 2));
  });

  test("contains elements from both lists in order", () => {
    expect(List("a").append(List("b", "c"))).toEqual(List("a", "b", "c"));
  });
});

describe("concat()", () => {
  test("returns a flattened list", () => {
    expect(List(
      List(1, 2),
      List(3, 4),
      List(5, 6),
    ).concat()).toEqual(List(1, 2, 3, 4, 5, 6));
  });
});

describe("drop()", () => {
  test("of Nil throws an exception", () => {
    expect(() => nil().drop(5)).toThrow();
  });

  test("throws an exception when the list's length is <= 0", () => {
    expect(() => List("x", "y").drop(2)).toThrow();
    expect(() => List("x", "y").drop(3)).toThrow();
  });

  test("returns the list when n is 0", () => {
    expect(List("x", "y", "z").drop(0)).toEqual(List("x", "y", "z"));
  });

  test("returns a copy of the list missing the first n elements", () => {
    expect(List("x", "y", "z").drop(2)).toEqual(List("z"));
  });
});

describe("dropWhile()", () => {
  test("of Nil throws an exception", () => {
    expect(() => nil().dropWhile(a => a === false)).toThrow();
  });

  test("returns the whole list if p is the `false` constant function", () => {
    expect(List(1, 2, 3).dropWhile(a => false)).toEqual(List(1, 2, 3));
  });

  test("returns Nil if p is the `true` constant function", () => {
    expect(List(1, 2, 3).dropWhile(a => true)).toEqual(nil());
  });

  test("returns the list minus the matching prefix", () => {
    expect(List(1, 3, 4, 6).dropWhile(a => a % 2 === 1)).toEqual(List(4, 6));
  });
});

describe("filter()", () => {
  test("returns only elements matching the predicate", () => {
    expect(List(1, 2, 3).filter(a => a % 2 === 1)).toEqual(List(1, 3));
  });
});

describe("flatMap()", () => {
  test("returns a flattened List", () => {
    expect(List(1, 2).flatMap(a => List(a))).toEqual(List(1, 2));
  });

  test("allows for removing elements", () => {
    expect(List(1, 2).flatMap(a => nil())).toEqual(nil());
  });

  test("has no effect on an empty list", () => {
    expect(List().flatMap(a => List(a))).toEqual(nil());
  });
});

describe("foldLeft()", () => {
  test("returns the zero value for an empty list", () => {
    expect(List<string>().foldLeft(
      0,
      (b, a) => b + 1,
    )).toEqual(0);
  });

  test("applies the op from left to right", () => {
    expect(List("a", "b", "c").foldLeft(
      "",
      (b, a) => a + b,
    )).toEqual("cba");
  });
});

describe("foldRight()", () => {
  test("returns the zero value for an empty list", () => {
    expect(List<string>().foldRight(
      0,
      (a, b) => b + 1,
    )).toEqual(0);
  });

  test("applies the op from right to left", () => {
    expect(List("a", "b", "c").foldRight(
      "",
      (a, b) => a + b,
    )).toEqual("abc");
  });
});

describe("getTail()", () => {
  test("of Nil throws an exception", () => {
    expect(() => nil().getTail()).toThrow();
  });

  test("of a one-element list is Nil", () => {
    expect(List(1).getTail()).toEqual(nil());
  });

  test("of a multi-element list is everything after the head", () => {
    expect(List(1, 2).getTail()).toEqual(List(2));
  });
});

describe("hasSubsequence()", () => {
  test("returns true if the subsequence is Nil", () => {
    expect(List(1, 2, 3).hasSubsequence(List())).toBeTruthy();
  });

  test("returns true if the subsequence exists", () => {
    expect(List("a", "b", "c").hasSubsequence(List("b", "c"))).toBeTruthy();
  });

  test("returns false if the subsequence doesn't exist", () => {
    expect(List("a", "b", "c").hasSubsequence(List("x", "y"))).toBeFalsy();
  });

  test("returns false if only a partial subsequence exists", () => {
    expect(List("a", "b", "c").hasSubsequence(List("a", "y"))).toBeFalsy();
  });

  test("returns false if an interrupted subsequence exists", () => {
    expect(List("a", "b", "c", "a", "c").hasSubsequence(List("a", "c"))).toBeTruthy();
  });
});

describe("init()", () => {
  test("of Nil throws an exception", () => {
    expect(() => nil().init()).toThrow();
  });

  test("of one-element list is Nil", () => {
    expect(List("a").init()).toEqual(nil());
  });

  test("of longer list returns all but last element", () => {
    expect(List("a", "b", "c").init()).toEqual(List("a", "b"));
  });
});

describe("length()", () => {
  test("returns 0 when list is Nil", () => {
    expect(nil().length()).toEqual(0);
  });

  test("returns 1 for single-element list", () => {
    expect(List("a").length()).toEqual(1);
  });

  test("returns 2 for two-element list", () => {
    expect(List("a", "b").length()).toEqual(2);
  });
});

describe("map()", () => {
  test("has no effect on an empty list", () => {
    expect(List().map(a => List(a))).toEqual(nil());
  });

  test("does not return a flattened list", () => {
    expect(List(1, 2, 3).map(a => List(a))).toEqual(
      List(List(1), List(2), List(3)),
    );
  });

  test("respects the identity law of mapping", () => {
    expect(List(1, 2, 3).map(a => a)).toEqual(List(1, 2, 3));
  });
});

describe("product()", () => {
  test("returns 1.0 when passed an empty List", () => {
    expect(List<number>().product()).toEqual(1.0);
  });

  test("returns the correct product", () => {
    expect(List(1, 2, 3, 4).product()).toEqual(24.0);
  });
});

describe("reverse()", () => {
  test("of Nil is Nil", () => {
    expect(list.reverse(List())).toEqual(nil());
  });

  test("returns the reverse of a list", () => {
    expect(list.reverse(List(1, 2, 3))).toEqual(List(3, 2, 1));
  });
});

describe("setHead()", () => {
  test("of Nil throws an exception", () => {
    expect(() => nil().setHead("x")).toThrow();
  });

  test("of one-element list returns new one-element list", () => {
    expect(List(1).setHead(2)).toEqual(List(2));
  });

  test("of multi-element list returns list differing only in first element", () => {
    expect(List(1, 2).setHead(3)).toEqual(List(3, 2));
  });
});

describe("sum()", () => {
  test("returns zero when passed an empty List", () => {
    expect(List<number>().sum()).toEqual(0);
  });

  test("returns the correct sum", () => {
    expect(List(1, 2, 3).sum()).toEqual(6);
  });
});

describe("toString()", () => {
  test("converts each element to a string", () => {
    expect(List(1, 2, 3).toString()).toEqual(List("1", "2", "3"));
  });
});

describe("zipWith()", () => {
  test("returns an empty list if either argument is empty", () => {
    expect(List<string>().zipWith(List(1, 2, 3), (a, b) => a.repeat(b))).toEqual(List());
    expect(List("a", "b", "c").zipWith(List<number>(), (a, b) => a.repeat(b))).toEqual(List());
  });

  test("applies the operation to corresponding elements", () => {
    expect(List("a", "b", "c").zipWith(List(1, 2, 3), (a, b) => a.repeat(b))).toEqual(List("a", "bb", "ccc"));
  });

  test("stops at the end of the shortest list", () => {
    expect(List("a", "b").zipWith(List(1, 2, 3), (a, b) => a.repeat(b))).toEqual(List("a", "bb"));
    expect(List("a", "b", "c").zipWith(List(1, 2), (a, b) => a.repeat(b))).toEqual(List("a", "bb"));
  });
});
