import { parseIntOpt } from "./numbers";
import { Option, some, none } from "./option";

describe("parseIntOpt()", () => {
  test("returns NaN if the string contains no integer", () => {
    expect(parseIntOpt("adfsad")).toEqual(none());
  });

  test("returns Some(n) if the string contains an integer", () => {
    expect(parseIntOpt("123")).toEqual(some(123));
  });
});
