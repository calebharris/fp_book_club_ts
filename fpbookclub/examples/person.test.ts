import { Either, Left, Right, left, right } from "../error_handling/either";

import person, { Age, Name, Person } from "./person";

describe("mkName", () => {
  test("returns a `Left` if the string is empty", () => {
    expect(person.mkName("")).toBeInstanceOf(Left);
  });

  test("returns a `Right` of the string if it is not empty", () => {
    expect(person.mkName("joe")).toEqual(right(new Name("joe")));
  });
});

describe("mkAge", () => {
  test("returns a `Left` if the number is less than 0", () => {
    expect(person.mkAge(-2)).toBeInstanceOf(Left);
  });

  test("returns a `Right` of the number if it is not negative", () => {
    expect(person.mkAge(2)).toEqual(right(new Age(2)));
  });
});

describe("mkPerson", () => {
  test("returns a `Left` if the name is invalid", () => {
    expect(person.mkPerson("", 22)).toBeInstanceOf(Left);
  });
});
