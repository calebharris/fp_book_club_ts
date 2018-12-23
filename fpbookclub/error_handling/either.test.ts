import { List } from "../data_structures/list";

import either, { Either, left, right } from "./either";

describe("flatMap()", () => {
  test("on `Left`, returns `Left` with unaltered value", () => {
    expect((left("x") as Either<string, number>).flatMap((n: number) => right(n))).toEqual(left("x"));
  });

  test("on `Right`, returns result of applying `f` to value", () => {
    expect(right("x").flatMap(s => right(s))).toEqual(right("x"));
  });
});

describe("map()", () => {
  test("on `Left`, returns `Left` with unaltered value", () => {
    expect((left<string, number>("x")).map(n => n * 2)).toEqual(left("x"));
  });

  test("on `Right`, returns `Right` with result of applying `f` to value", () => {
    expect(right(2).map(n => n * 2)).toEqual(right(4));
  });

  test("does not unwrap function's return value", () => {
    expect(right(2).map(n => right(n))).toEqual(right(right(2)));
  });
});

describe("map2()", () => {
  test("if either argument is `Left`, returns that `Left`", () => {
    expect(either.map2(left<string, string>("x"), right(1), (a, b) => a + b)).toEqual(left("x"));
    expect(either.map2(right("x"), left("y"), (a, b) => a + b)).toEqual(left("y"));
  });

  test("if both arguments are `Left`, returns the first `Left`", () => {
    expect(either.map2(left<string, string>("x"), left<string, number>("y"), (a, b) => a + b)).toEqual(left("x"));
  });

  test("if both arguments are `Right`, returns the result of `f` in a `Right`", () => {
    expect(either.map2(right("x"), right(1), (a, b) => a + b)).toEqual(right("x1"));
  });
});

describe("orElse()", () => {
  test("on `Left`, returns the result of evaluating `b`", () => {
    expect(left<string, number>("x").orElse(() => right(1))).toEqual(right(1));
  });

  test("on `Right`, returns `this`", () => {
    expect(right(1).orElse(() => right(2))).toEqual(right(1));
  });
});

describe("sequence()", () => {
  test("returns `Right(Nil)` if the list is empty", () => {
    expect(either.sequence(List<Either<string, number>>())).toEqual(right(List()));
  });

  test("returns `Left` if any member of the list is `Left`", () => {
    expect(either.sequence(List(right(1), left("oops")))).toEqual(left("oops"));
  });

  test("returns `Right` if every member of the list is `Right`", () => {
    expect(either.sequence(List(right(1), right(2)))).toEqual(right(List(1, 2)));
  });
});

describe("traverse()", () => {
  test("returns `Right(Nil)` if the list is empty", () => {
    expect(either.traverse(List<number>(), n => right(n))).toEqual(right(List()));
  });

  test("returns `Left` if any transformation result is `Left`", () => {
    expect(either.traverse(List(1, 2), n => n === 2 ? left("oops") : right(n))).toEqual(left("oops"));
  });

  test("returns `Right` if every element's transformation is `Right`", () => {
    expect(
      either.traverse(List(1, 2, 3), n => right(n.toString())),
    ).toEqual(
      right(List("1", "2", "3")),
    );
  });
});

describe("Try()", () => {
  const tryDecodeURI = (s: string) => either.Try(() => decodeURI(s));

  test("returns Right on a successful execution", () => {
    expect(tryDecodeURI("example")).toEqual(right("example"));
  });

  test("returns Left on a thrown exception", () => {
    expect(tryDecodeURI("%")).toEqual(left(new URIError("URI malformed")));
  });

  test("works for code that abuses throw", () => {
    expect(either.Try(() => {
      // tslint:disable-next-line no-string-throw
      throw "This is not an error";
    })).toEqual(left(new Error("This is not an error")));
  });
});
