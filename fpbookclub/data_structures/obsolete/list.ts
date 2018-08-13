/**
 * list.ts - a functional singly linked list implementation using a
 * discriminated union, a.k.a. algebraic data type (ADT). Based on
 * guidance at
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 *
 * Note: this was List before the introduction of `foldRight` and the
 * reimplementation of `sum` and `product` in terms of `foldRight`
 **/

/**
 * The "root" definition of our List data type, with one type parameter, `A`.
 * Note that List is defined entirely by its constituent types, using
 * TypeScript's type union syntax, `|`.
 **/
export type List<A> = Cons<A> | Nil;

/**
 * Nil represents the empty list
 **/
export interface Nil {
  tag: "nil";
}

/**
 * There is only one instance of Nil
 **/
export const Nil: Nil = { tag: "nil" };

/**
 * A link in the list, containing a value in `head` and a pointer to
 * the remainder of the list in `tail`. Every tail is a complete List
 * in its own right, with Nil signifying the "end" of the list.
 **/
export class Cons<A> {
  tag: "cons" = "cons";
  readonly head: A;
  readonly tail: List<A>;

  constructor(head: A, tail: List<A>) {
    this.head = head;
    this.tail = tail;
  }
}

/**
 * Creates a List from a variable number of arguments.
 **/
export function List<A>(...vals: A[]): List<A> {
  if (vals.length === 0) {
    return Nil;
  } else {
    return new Cons(vals[0], List(...vals.slice(1)));
  }
}

/**
 * Creates a new list by appending a2 to a1
 **/
export function append<A>(a1: List<A>, a2: List<A>): List<A> {
  switch (a1.tag) {
    case "nil":
      return a2;
    case "cons":
      return new Cons(a1.head, append(a1.tail, a2));
  }
}
/**
 * Uses recursion and pattern matching to add up a list of numbers
 **/
export function sum(ns: List<number>): number {
  switch (ns.tag) {
    // the sum of the empty list is 0
    case "nil": return 0;

    // the sum of a list is the value in the head plus the sum of the tail
    case "cons": return ns.head + sum(ns.tail);
  }
}

/**
 * Multiplies a list of numbers together, using the same technique as `sum`
 **/
export function product(ns: List<number>): number {
  switch (ns.tag) {
    case "nil": return 1.0;
    case "cons":
      if (ns.head === 0.0)
        return 0.0;
      else
        return ns.head * product(ns.tail);
  }
}

