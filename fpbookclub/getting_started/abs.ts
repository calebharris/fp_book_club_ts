/**
 * abs.ts - a simple TypeScript program
 **/

// A comment!
/* A multiline (or block)
     comment */
/**
 * A documentation comment
 **/

// Exporting something makes it visible to
// code outside of this module
export function abs(n: number): number {        // abs takes a number and
                                                // returns a number
  if (n < 0)
    return -n;                                  // return the negation of n
  else                                          // if it's less than zero
    return n;
}

// Since this function isn't exported, it's
// only visible to code in this file
function formatAbs(x: number) {
  const msg = "The absolute value of " + x + " is " + abs(x);
  return msg;
}

// This line will be executed when the module
// is loaded, or when this file is executed
// directly
console.log(formatAbs(-42));                    // writes to standard out
