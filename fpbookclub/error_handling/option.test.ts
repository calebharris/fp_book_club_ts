import {
  Option,
  Some,
  None,
  NONE,
} from "./option";

describe("filter()", () => {
});

describe("flatMap()", () => {
});

describe("getOrElse()", () => {
  test("returns the value of a Some", () => {
    expect(new Some("hello").getOrElse(() => "world")).toEqual("hello");
  });

  test("returns the default for None", () => {
    expect(NONE.getOrElse(() => "world")).toEqual("world");
  });
});

describe("map()", () => {
  test("applies the function for on a Some", () => {
    expect(new Some("hello").map(s => s.length)).toEqual(new Some(5));
  });

  test("just returns None for a None", () => {
    expect(NONE.map((s: string) => s.length)).toEqual(new None());
  });
});

describe("orElse()", () => {
});
