import { List } from "../data_structures/list";

import {
  Option,
  Try,
  lift,
  none,
  sequence,
  some,
} from "./option";

describe("Try()", () => {
  const tryDecodeURI = (s: string) => Try(() => decodeURI(s));

  test("returns Some on a successful execution", () => {
    expect(tryDecodeURI("example")).toEqual(some("example"));
  });

  test("returns None on thrown exception", () => {
    expect(tryDecodeURI("%")).toEqual(none());
  });
});

describe("filter()", () => {
  test("returns None for a None", () => {
    expect(none().filter(x => true)).toEqual(none());
  });

  test("returns None if the predicate returns false", () => {
    expect(some("").filter(s => s.length > 0)).toEqual(none());
  });

  test("returns Some if the predicate returns true", () => {
    expect(some("").filter(s => s.length === 0)).toEqual(some(""));
  });
});

describe("flatMap()", () => {
  const thingWithName = some({ name: "Thomas" });
  const nameless = some({ species: "bird" });

  const extractName = (thing: any): Option<string> => {
    if (typeof thing === "object" && typeof thing.name === "string")
      return some(thing.name);
    else
      return none();
  };

  test("applies the function on a Some", () => {
    expect(thingWithName.flatMap(extractName)).toEqual(some("Thomas"));
    expect(nameless.flatMap(extractName)).toEqual(none());
  });
});

describe("getOrElse()", () => {
  test("returns the value of a Some", () => {
    expect(some("hello").getOrElse(() => "world")).toEqual("hello");
  });

  test("returns the default for None", () => {
    expect(none<string>().getOrElse(() => "world")).toEqual("world");
  });
});

describe("map()", () => {
  test("applies the function for on a Some", () => {
    expect(some("hello").map(s => s.length)).toEqual(some(5));
  });

  test("just returns None for a None", () => {
    expect(none<string>().map(s => s.length)).toEqual(none());
  });
});

describe("orElse()", () => {
  test("returns the default for a None", () => {
    expect(none<boolean>().orElse(() => some(true))).toEqual(some(true));
  });

  test("returns the Some for a Some", () => {
    expect(some(true).orElse(() => some(false))).toEqual(some(true));
  });
});

describe("lift()", () => {
  test("successfully transforms Math.abs", () => {
    const absOpt = lift(Math.abs);
    expect(absOpt(some(-3))).toEqual(some(3));
  });
});

describe("sequence()", () => {
  test("combines a list of options into an option of list", () => {
    expect(sequence(List(some(1), some(2), some(3)))).toEqual(some(List(1, 2, 3)));
  });

  test("returns none if any value is none", () => {
    expect(sequence(List(some(1), none(), some(3)))).toEqual(none());
  });

  test("returns none if the list is empty", () => {
    expect(sequence(List())).toEqual(none());
  });
});
