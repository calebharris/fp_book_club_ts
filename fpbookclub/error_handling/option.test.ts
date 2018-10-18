import {
  Option,
  Some,
  None,
  NONE,
  none
} from "./option";

describe("getOrElse()", () => {
  test("returns the value of a Some", () => {
    expect(new Some("hello").getOrElse(() => "world")).toEqual("hello");
  });

  test("returns the default for None", () => {
    expect(none<string>().getOrElse(() => "world")).toEqual("world");
  });
});

describe("isSome()", () => {
  test("returns true for a Some", () => {
    expect(new Some("hello").isSome()).toBeTruthy();
  });

  test("returns false for a None", () => {
    expect(NONE.isSome()).toBeFalsy();
  });
});
