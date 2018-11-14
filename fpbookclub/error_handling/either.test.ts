import * as ei from "./either";
type Either<E, A> = ei.Either<E, A>;
const { left, right, ...either } = ei;

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
