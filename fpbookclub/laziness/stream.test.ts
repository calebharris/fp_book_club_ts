import { List } from "../data_structures/list";
import { Option } from "../error_handling/option";

import stream, { Cons, Empty, Stream } from "./stream";

describe("Stream()", () => {
  test("with no arguments returns an empty stream", () => {
    expect(Stream().tag).toBe("empty");
  });

  test("with arguments returns a cons", () => {
    expect(Stream(1).tag).toBe("cons");
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

describe("toList()", () => {
  test("transforms the Stream into a List", () => {
    expect(Stream(1, 2, 3).toList()).toEqual(List(1, 2, 3));
  });
});
