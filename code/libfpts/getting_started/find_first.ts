/**
 * Find the first string matching `key` in an array of strings
 */
export function findFirstString(ss: string[], key: string): number {
  let index = -1;                               // if the key isn't found
                                                // we'll return -1
  for (let i = 0; i < ss.length; ++i)
    if (ss[i] === key) {
      index = i;
      break;                                    // break the loop early if
                                                // the key is found
    }

  return index;
}

/**
 * Find the first anything passing predicate `p` in an array of anything
 */
export function findFirst<A>(as: A[], p: (a: A) => boolean): number {
  let index = -1;

  for (let i = 0; i < as.length; ++i)
    if (p(as[i])) {
      index = i;
      break;
    }

  return index;
}
