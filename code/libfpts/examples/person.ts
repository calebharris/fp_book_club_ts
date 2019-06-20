import { Either, left, map2, right } from "../error_handling/either";

export class Person {
  constructor(readonly name: Name, readonly age: Age) { }
}

export class Name {
  constructor(readonly name: string) { }
}

export class Age {
  constructor(readonly age: number)  { }
}

export const mkName = (name: string): Either<string, Name> => {
  if (name === "")
    return left("Name is empty.");
  else
    return right(new Name(name));
};

export const mkAge = (age: number): Either<string, Age> => {
  if (age < 0)
    return left("Age is out of range.");
  else
    return right(new Age(age));
};

export const mkPerson = (name: string, age: number): Either<string, Person> =>
  map2(mkName(name), mkAge(age), (n, a) => new Person(n, a));

export default { Age, Name, Person, mkAge, mkName, mkPerson };
