import { Option, some, none } from "./option";

/**
 * Returns `Some(n)` where `n` is the integer represented by the string `s`, or
 * `None` if `s` does not contain an integer.
 **/
export function parseIntOpt(s: string): Option<number> {
  const i = parseInt(s);
  if (isNaN(i)) return none();
  return some(i);
}
