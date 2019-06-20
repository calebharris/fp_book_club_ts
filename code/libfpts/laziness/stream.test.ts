import { List } from "../data_structures/list";
import { Option, none, some } from "../error_handling/option";

import stream, { Cons, Empty, Stream } from "./stream";

describe("Stream()", () => {
  test("with no arguments returns an empty stream", () => {
    expect(Stream().tag).toBe("empty");
  });

  test("with one argument returns a cons", () => {
    expect(Stream(1).tag).toBe("cons");
  });

  test("with multiple arguments returns multiple conses", () => {
    expect(Stream(1, 2, 3).toList()).toEqual(List(1, 2, 3));
  });
});

describe("append()", () => {
  test("appends two streams", () => {
    expect(Stream(1).append(() => Stream(2)).toList()).toEqual(List(1, 2));
  });
});

describe("drop()", () => {
  test("with 0 returns the same stream", () => {
    expect(Stream(1, 2).drop(0).toList()).toEqual(List(1, 2));
  });

  test("on an empty stream returns the empty stream", () => {
    expect(Stream().drop(3)).toEqual(stream.empty());
  });

  test("with 1 returns everything after the first element", () => {
    expect(Stream(1, 2).drop(1).toList()).toEqual(List(2));
  });
});

describe("headOption()", () => {
  test("returns Some(val) from a non-empty stream", () => {
    expect(Stream(1).headOption().getOrElse(() => -1)).toEqual(1);
  });

  test("returns None from an empty stream", () => {
    expect(Stream<number>().headOption().getOrElse(() => -1)).toEqual(-1);
  });
});

describe("cons()", () => {
  test("memoizes the provided thunk", () => {
    let n = 0;
    const val = () => {
      return ++n;
    };

    const stm = stream.cons(val, () => stream.empty());
    expect(stm.headOption().getOrElse(() => -1)).toEqual(1);
    expect(stm.headOption().getOrElse(() => -1)).toEqual(1);
  });
});

describe("constant()", () => {
  test("creates a stream of constant values", () => {
    expect(stream.constant(7).take(3).toList()).toEqual(List(7, 7, 7));
  });
});

describe("dropWhile()", () => {
  test("of an empty stream returns an empty stream", () => {
    expect(Stream().dropWhile(a => true)).toEqual(stream.empty());
  });

  test("when every item passes the predicate returns empty", () => {
    expect(Stream(2, 4).dropWhile(n => n % 2 === 0)).toEqual(stream.empty());
  });

  test("drops the prefix of passing elements", () => {
    expect(Stream(2, 4, 1).dropWhile(n => n % 2 === 0).toList())
      .toEqual(List(1));
  });

  test("returns the whole stream if the first element fails", () => {
    expect(Stream(2, 4).dropWhile(n => n % 2 === 1).toList())
      .toEqual(List(2, 4));
  });
});

describe("exists()", () => {
  test("returns true if a matching element exists", () => {
    expect(Stream(1, 2, 3).exists(a => a === 2)).toEqual(true);
  });

  test("returns false if no matching element exists", () => {
    expect(Stream(1, 2, 3).exists(a => a === -1)).toEqual(false);
  });
});

describe("fibs()", () => {
  test("returns the Fibonacci sequence", () => {
    expect(stream.fibs().take(5).toList()).toEqual(List(0, 1, 1, 2, 3));
  });
});

describe("filter()", () => {
  test("returns a stream of only matching elements", () => {
    expect(Stream(1, 2, 3).filter(a => a % 2 === 1).toList())
      .toEqual(List(1, 3));
  });
});

describe("flatMap()", () => {
  test("does nothing on an empty stream", () => {
    expect(Stream().flatMap(a => Stream(a))).toEqual(stream.empty());
  });

  test("returns equal stream with unit function", () => {
    expect(Stream(1).flatMap(a => Stream(a)).toList()).toEqual(List(1));
  });

  test("applies function to stream", () => {
    expect(Stream(1).flatMap(a => Stream(a + 1)).toList()).toEqual(List(2));
  });
});

describe("foldRight()", () => {
  test("folds the stream", () => {
    expect(Stream(1, 2, 3).foldRight(() => 0, (a, b) => a + b())).toEqual(6);
  });
});

describe("forAll()", () => {
  test("returns false for an empty stream", () => {
    expect(Stream<number>().forAll((a: number) => a === 2)).toBeFalsy();
  });

  test("returns true if every element passes the predicate", () => {
    expect(Stream(2, 4, 6).forAll(a => a % 2 === 0)).toBeTruthy();
  });

  test("returns false if any element fails the predicate", () => {
    expect(Stream(2, 5, 6).forAll(a => a % 2 === 0)).toBeFalsy();
  });

  test("does not evaluate the tail after returning false", () => {
    let counter = 0;
    Stream(1, 2, 3).forAll(a => {
      counter++;
      return a > 1;
    });
    expect(counter).toEqual(1);
  });
});

describe("hasSubsequence()", () => {
  test("returns true if the subsequence exists", () => {
    expect(Stream(1, 2, 3).hasSubsequence(Stream(2, 3))).toBeTruthy();
  });

  test("return true if a different subsequence exists", () => {
    expect(Stream(1, 2, 3, 4).hasSubsequence(Stream(2, 3))).toBeTruthy();
  });

  test("returns false if the subsequence does not exist", () => {
    expect(Stream(1, 2, 3).hasSubsequence(Stream(5, 6))).toBeFalsy();
  });
});

describe("map()", () => {
  test("transforms the stream", () => {
    expect(Stream(1, 2, 3).map(a => a + 1).toList()).toEqual(List(2, 3, 4));
  });
});

describe("ones()", () => {
  test("produces all 1s", () => {
    expect(stream.ones.take(3).toList()).toEqual(List(1, 1, 1));
  });
});

describe("scanRight()", () => {
  test("produces all intermediate results of fold", () => {
    expect(Stream(1, 2, 3).scanRight(() => 0, (a, b) => a + b()).toList()).toEqual(List(6, 5, 3, 0));
  });

  test("produces zero value for empty input", () => {
    expect(Stream<number>().scanRight(() => 0, (a, b) => a + b()).toList()).toEqual(List(0));
  });
});

describe("shift()", () => {
  test("returns the head and tail of a stream", () => {
    const s = Stream(1, 2, 3);
    const [h, t] = s.shift();
    expect(h).toEqual(some(1));
    expect(t.toList()).toEqual(List(2, 3));
  });

  test("returns None and Empty for an empty stream", () => {
    const [h, t] = Stream().shift();
    expect(h).toEqual(none());
    expect(t).toEqual(stream.empty());
  });
});

describe("startsWith()", () => {
  test("returns false for an empty stream", () => {
    expect(stream.empty().startsWith(Stream(1))).toBeFalsy();
  });

  test("returns true if the argument is a prefix of the stream", () => {
    expect(Stream(1, 2, 3).startsWith(Stream(1, 2))).toBeTruthy();
  });

  test("returns false if the argument is not a prefix of the stream", () => {
    expect(Stream(1, 2, 3).startsWith(Stream(4))).toBeFalsy();
  });

  test("returns false if the argument is longer than the stream", () => {
    expect(Stream(1, 2).startsWith(Stream(1, 2, 3))).toBeFalsy();
  });

  test("works with an infinite stream", () => {
    expect(stream.ones.startsWith(Stream(1, 1))).toBeTruthy();
  });

  test("returns true if the argument is empty", () => {
    expect(Stream(1).startsWith(stream.empty())).toBeTruthy();
  });
});

describe("tails()", () => {
  test("returns all possible suffixes of input stream", () => {
    expect(Stream(1, 2).tails().map(s => s.toList()).toList()).toEqual(
      List(
        List(1, 2),
        List(2),
        List(),
      ),
    );
  });
});

describe("takeWhile()", () => {
  test("of an empty stream returns an empty stream", () => {
    expect(Stream().takeWhile(a => true)).toEqual(stream.empty());
  });

  test("when the first item fails the predicate returns empty", () => {
    expect(Stream(2, 4).takeWhile(n => n % 2 === 1)).toEqual(stream.empty());
  });

  test("returns the prefix of passing elements", () => {
    expect(Stream(2, 4, 1).takeWhile(n => n % 2 === 0).toList())
      .toEqual(List(2, 4));
  });

  test("returns the whole stream if every element passes", () => {
    expect(Stream(2, 4).takeWhile(n => n % 2 === 0).toList())
      .toEqual(List(2, 4));
  });
});

describe("toList()", () => {
  test("transforms the Stream into a List", () => {
    expect(Stream(1, 2, 3).toList()).toEqual(List(1, 2, 3));
  });
});

describe("zipWith()", () => {
  test("returns empty stream for two empty inputs", () => {
    expect(stream.empty().zipWith(stream.empty(), (a, b) => [a, b])).toEqual(stream.empty());
  });

  test("combines the streams with the given function", () => {
    expect(Stream(1, 2, 3).zipWith(
      Stream("a", "b", "c"),
      (a, b) => b.repeat(a)).toList(),
    ).toEqual(List("a", "bb", "ccc"));
  });

  test("stops when either input runs out of elements", () => {
    const x = Stream("a", "b", "c");
    const y = Stream("d", "e");
    const f = (a: string, b: string) => a + b;
    expect(x.zipWith(y, f).toList()).toEqual(List("ad", "be"));
    expect(y.zipWith(x, f).toList()).toEqual(List("da", "eb"));
  });
});

describe("zipAll()", () => {
  test("returns empty stream for two empty inputs", () => {
    expect(stream.empty().zipAll(stream.empty())).toEqual(stream.empty());
  });

  test("combines the streams into tuples, exhausting both", () => {
    const x = Stream("a", "b", "c");
    const y = Stream(1, 2);
    expect(x.zipAll(y).toList()).toEqual(
      List(
        [some("a"), some(1)],
        [some("b"), some(2)],
        [some("c"), none()],
      ),
    );
    expect(y.zipAll(x).toList()).toEqual(
      List(
        [some(1), some("a")],
        [some(2), some("b")],
        [none(), some("c")],
      ),
    );
  });
});
