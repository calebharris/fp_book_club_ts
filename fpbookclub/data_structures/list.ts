/**
 * list.ts - a functional singly linked list implementation using a
 * discriminated union, a.k.a. algebraic data type (ADT). Based on
 * guidance at
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
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
 * Returns a new list missing the first `n` elements of `l`
 **/
export function drop<A>(l: List<A>, n: number): List<A> {
  switch (l.tag) {
    case "nil":
      throw new Error("Attempt to drop from empty list");
    case "cons":
      if (n <= 0) return l;
      else return drop(l.tail, n - 1);
  }
}

/**
 * Uses recursion and pattern matching to apply a function that "folds"
 * every element of the list into a single value
 **/
export function foldRight<A, B>(l: List<A>, z: B, f: (a: A, b: B) => B): B {
  switch (l.tag) {
    case "nil": return z;
    case "cons": return f(l.head, foldRight(l.tail, z, f));
  }
}

/**
 * Multiplies a list of numbers together
 **/
export function product(ns: List<number>): number {
  return foldRight(ns, 1.0, (n, prod) => n * prod);
}

/**
 * Replaces the head of a list with a different value
 **/
export function setHead<A>(l: List<A>, a: A): List<A> {
  switch (l.tag) {
    case "nil": throw new Error("Attempt to set head of empty list");
    case "cons": return new Cons(a, l.tail);
  }
}

/**
 * Adds up a list of numbers
 **/
export function sum(ns: List<number>): number {
  return foldRight(ns, 0, (n, sum) => n + sum);
}

/**
 * Returns the tail of a list
 **/
export function tail<A>(l: List<A>): List<A> {
  switch (l.tag) {
    case "nil": throw new Error("Attempt to take tail of empty list");
    case "cons": return l.tail;
  }
}
