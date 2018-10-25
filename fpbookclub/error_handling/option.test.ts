import {
  Option,
  Some,
  None,
  NONE,
  lift,
} from "./option";

describe("filter()", () => {
  test("returns None for a None", () => {
    expect(NONE.filter(x => true)).toEqual(NONE);
  });

  test("returns None if the predicate returns false", () => {
    expect(new Some("").filter(s => s.length > 0)).toEqual(NONE);
  });

  test("returns Some if the predicate returns true", () => {
    expect(new Some("").filter(s => s.length === 0)).toEqual(new Some(""));
  });
});

describe("flatMap()", () => {
  const thingWithName = new Some({ name: "Thomas" });
  const nameless = new Some({ species: "bird" });

  const extractName = (thing: any): Option<string> => {
    if (typeof thing === "object" && typeof thing.name === "string") {
      return new Some(thing.name);
    } else {
      return NONE;
    }
  }

  test("applies the function on a Some", () => {
    expect(thingWithName.flatMap(extractName)).toEqual(new Some("Thomas"));
    expect(nameless.flatMap(extractName)).toEqual(NONE);
  });
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
  test("returns the default for a None", () => {
    expect(NONE.orElse(() => new Some(true))).toEqual(new Some(true));
  });

  test("returns the Some for a Some", () => {
    expect(new Some(true).orElse(() => new Some(false))).toEqual(new Some(true));
  });
});

describe("lift()", () => {
  test("successfully transforms Math.abs", () => {
    const absOpt = lift(Math.abs);
    expect(absOpt(new Some(-3))).toEqual(new Some(3));
  });
});
