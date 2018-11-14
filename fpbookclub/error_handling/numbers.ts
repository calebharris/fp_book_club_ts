import { Option, none, some } from "./option";

/**
 * Returns `Some(n)` where `n` is the integer represented by the string `s`, or
 * `None` if `s` does not contain an integer.
 */
export function parseIntOpt(s: string): Option<number> {
  const i = parseInt(s, 10);
  if (isNaN(i))
    return none();
  else
    return some(i);
}
