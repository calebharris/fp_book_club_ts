/**
 * list.ts - a functional singly linked list implementation using a
 * discriminated union, a.k.a. algebraic data type (ADT). Based on
 * guidance at
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 **/

/**
 * Every List instance is either another Cons or a Nil
 **/
export type List<A> = Cons<A> | Nil;

/**
 * The empty list
 **/
export interface Nil {
  tag: "nil";
}

export const Nil: Nil = { tag: "nil" };

/**
 * A link in the list, containing a value in `head` and a pointer to
 * the remainder of the list in `tail`
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

export function List<A>(...vals: A[]): List<A> {
  if (vals.length === 0) {
    return Nil;
  } else {
    return new Cons(vals[0], List(...vals.slice(1)));
  }
}

export function sum(ns: List<number>): number {
  switch (ns.tag) {
    case "nil": return 0;
    case "cons": return ns.head + sum(ns.tail);
  }
}

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

