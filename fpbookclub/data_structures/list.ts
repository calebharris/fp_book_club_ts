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

//export function addCorresponding(a1: List<number>, a2: List<number>): List<number> {
//return zipWith(a1, a2, (n1, n2) => n1 + n2);
//}

export function addCorresponding(a1: List<number>, a2: List<number>): List<number> {
  return reverse(foldLeft(
    a1,
    [Nil as List<number>, a2],
    ([acc, rem], a) => {
      if (rem.tag === "cons") {
        return [new Cons(a + rem.head, acc), rem.tail];
      } else {
        return [acc, rem];
      }
    }
  )[0]);
}

export function addOne(l: List<number>): List<number> {
  return map(l, a => a + 1);
}

/**
 * Creates a new list by appending a2 to a1
 **/
export function append<A>(a1: List<A>, a2: List<A>): List<A> {
  return foldRight(a1, a2, (a, b) => new Cons(a, b));
}

/**
 * Returns a flattened List containing all elements of the given sublists in order
 **/
export function concat<A>(ll: List<List<A>>): List<A> {
  return foldRight(ll, List(), (a, b) => append(a, b));
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
 * Returns a new list missing the first contiguous sequence of elements that
 * match the predicate `p`
 **/
export function dropWhile<A>(l: List<A>, p: (a: A) => boolean): List<A> {
  switch (l.tag) {
    case "nil":
      throw new Error("Attempt to drop from empty list");
    case "cons":
      if (p(l.head)) {
        switch (l.tail.tag) {
          case "nil": return l.tail;
          default: return dropWhile(l.tail, p);
        }
      } else {
        return l;
      }
  }
}

/**
 * Returns all but the last element of `l`
 **/
export function init<A>(l: List<A>): List<A> {
  if (l.tag === "nil") {
    throw new Error("Attempt to get init of empty list");
  } else if (l.tail === Nil) {
    return Nil;
  }
  return new Cons(l.head, init(l.tail));
}

export function filter<A>(l: List<A>, p: (a: A) => boolean): List<A> {
  return flatMap(l, a => p(a) ? List(a) : List());
}

export function flatMap<A, B>(l: List<A>, f: (a: A) => List<B>): List<B> {
  return concat(map(l, f));
}

export function foldLeft<A, B>(l: List<A>, z: B, f: (b: B, a: A) => B): B {
  var state = z;
  while (l.tag !== "nil") {
    state = f(state, l.head);
    l = l.tail;
  }
  return state;
}

/**
 * Uses recursion and pattern matching to apply a function that "folds"
 * every element of the list into a single value
 **/
export function foldRight<A, B>(l: List<A>, z: B, f: (a: A, b: B) => B): B {
  return foldLeft(reverse(l), z, (b, a) => f(a, b));
}

/**
 * Returns the length of l
 **/
export function length<A>(l: List<A>): number {
  return foldLeft(l, 0, (b, a) => b + 1);
}

export function map<A, B>(la: List<A>, f: (a: A) => B): List<B> {
  return foldRight(la, List(), (a, b) => new Cons(f(a), b));
}

/**
 * Multiplies a list of numbers together
 **/
export function product(ns: List<number>): number {
  return foldRight(ns, 1.0, (n, prod) => n * prod);
}

/**
 * Returns the reverse of a list
 **/
export function reverse<A>(l: List<A>): List<A> {
  return foldLeft(l, List(), (b, a) => new Cons(a, b));
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

export function toString(l: List<number>): List<string> {
  return map(l, a => a.toString());
}
