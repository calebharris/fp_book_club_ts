import * as util from "util";

import { InspectOptions } from "../shims";

/**
 * list.ts - a functional singly linked list implementation using a
 * discriminated union, a.k.a. algebraic data type (ADT). Based on
 * guidance at
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */

/**
 * The "root" definition of our List data type, with one type parameter, `A`.
 * Note that List is defined entirely by its constituent types, using
 * TypeScript's type union syntax, `|`.
 */
export type List<A> = Cons<A> | Nil<A>;

/**
 * Base class to enable calling some `List` functions with dot syntax
 * (e.g. `myList.map(i => i * 2)`). This style of library construction is not
 * covered in Chapter 3, so if you're confused, check out Chapter 4!
 */
abstract class ListBase<A> {

  /**
   * Custom inspection function so that we see `List(1, 2, 3)` in the console
   * instead of `Cons { head: 1, tail: Cons { ...`
   */
  [util.inspect.custom](this: List<A>, depth: number, options: InspectOptions): string {
    if (depth < 0)
      return options.stylize("[List]", "special");

    const nextOpts = Object.assign({}, options);
    if (typeof options.depth === "number")
      nextOpts.depth = options.depth - 1;

    const inner = this.foldLeft("", (b, a) => `${b}, ${util.inspect(a, nextOpts)}`).substr(2);
    return options.stylize("List(", "special") + inner + options.stylize(")", "special");
  }

  addCorresponding(this: List<number>, that: List<number>): List<number> {
    return addCorresponding(this, that);
  }

  addOne(this: List<number>): List<number> {
    return addOne(this);
  }

  append(this: List<A>, that: List<A>): List<A> {
    return append(this, that);
  }

  // We need a new type variable here because `A` is `List<something>`, so if
  // we just returned `List<A>`, we would in fact be returning
  // `List<List<something>>`, which is not our intent.
  concat<B>(this: List<List<B>>): List<B> {
    return concat(this);
  }

  drop(this: List<A>, n: number): List<A> {
    return drop(this, n);
  }

  dropWhile(this: List<A>, p: (a: A) => boolean): List<A> {
    return dropWhile(this, p);
  }

  filter(this: List<A>, p: (a: A) => boolean): List<A> {
    return filter(this, p);
  }

  foldLeft<B>(this: List<A>, z: B, f: (b: B, a: A) => B): B {
    return foldLeft(this, z, f);
  }

  foldRight<B>(this: List<A>, z: B, f: (a: A, b: B) => B): B {
    return foldRight(this, z, f);
  }

  flatMap<B>(this: List<A>, f: (a: A) => List<B>): List<B> {
    return flatMap(this, f);
  }

  getTail(this: List<A>): List<A> {
    return getTail(this);
  }

  hasSubsequence(this: List<A>, that: List<A>): boolean {
    return hasSubsequence(this, that);
  }

  init(this: List<A>): List<A> {
    return init(this);
  }

  isEmpty(this: List<A>): this is Nil<A> {
    return this.tag === "nil";
  }

  length(this: List<A>): number {
    return length(this);
  }

  map<B>(this: List<A>, f: (a: A) => B): List<B> {
    return map(this, f);
  }

  product(this: List<number>): number {
    return product(this);
  }

  reverse(this: List<A>): List<A> {
    return reverse(this);
  }

  setHead(this: List<A>, a: A): List<A> {
    return setHead(this, a);
  }

  sum(this: List<number>): number {
    return sum(this);
  }

  toString(this: List<A>): List<string> {
    return toString(this);
  }

  zipWith<B, C>(this: List<A>, that: List<B>, f: (a: A, b: B) => C): List<C> {
    return zipWith(this, that, f);
  }
}

/**
 * Nil represents the empty list
 */
export class Nil<A> extends ListBase<A> {
  /**
   * There is only one instance of Nil
   */
  static readonly NIL: List<never> = new Nil();

  readonly tag: "nil" = "nil";

  private constructor() {
    super();
  }
}

/**
 * A link in the list, containing a value in `head` and a pointer to
 * the remainder of the list in `tail`. Every tail is a complete List
 * in its own right, with Nil signifying the "end" of the list.
 */
export class Cons<A> extends ListBase<A> {
  readonly tag: "cons" = "cons";

  constructor(readonly head: A, readonly tail: List<A>) {
    super();
  }
}

/**
 * Creates a List from a variable number of arguments.
 */
export const List = <A>(...vals: A[]): List<A> => {
  if (vals.length === 0)
    return nil();
  else
    return cons(vals[0], List(...vals.slice(1)));
};

/**
 * Given two lists of numbers, return a list containing the sums of
 * corresponding elements. If one list is longer than the other, the longer
 * list's excess elements will be ignored.
 */
export const addCorresponding = (a1: List<number>, a2: List<number>): List<number> =>
  zipWith(a1, a2, (n1, n2) => n1 + n2);

/**
 * Given a list of numbers, return a list containing the result of adding one
 * to each element.
 */
export const addOne = (l: List<number>): List<number> =>
  map(l, a => a + 1);

/**
 * Creates a new list by appending a2 to a1
 */
export const append = <A>(a1: List<A>, a2: List<A>): List<A> =>
  foldRight(a1, a2, (a, b) => new Cons(a, b));

/**
 * Returns a flattened List containing all elements of the given sublists in order
 */
export const concat = <A>(ll: List<List<A>>): List<A> =>
  foldRight(ll, List(), (a, b) => append(a, b));

/**
 * Smart constructor for creating a new list from a value and an existing list
 */
export const cons = <A>(h: A, t: List<A>): List<A> => new Cons(h, t);

/**
 * Returns a new list missing the first `n` elements of `l`
 */
export const drop = <A>(l: List<A>, n: number): List<A> => {
  if (l.tag === "nil")
      throw new Error("Attempt to drop from empty list");

  if (n <= 0) return l;
  else return drop(l.tail, n - 1);
};

/**
 * Returns a new list missing the first contiguous sequence of elements that
 * match the predicate `p`
 */
export const dropWhile = <A>(l: List<A>, p: (a: A) => boolean): List<A> => {
  if (l.tag === "nil")
      throw new Error("Attempt to drop from empty list");

  if (p(l.head))
    switch (l.tail.tag) {
      case "nil": return l.tail;
      default: return dropWhile(l.tail, p);
    }

  return l;
};

/**
 * Returns a list containing only the elemtns of `l` for which the predicate `p`
 * is `true`.
 */
export const filter = <A>(l: List<A>, p: (a: A) => boolean): List<A> =>
  flatMap(l, a => p(a) ? List(a) : List());

/**
 * Returns a list where each element `a` of the input list, `l`, has been replaced
 * by the elements of the list resulting from applying `f` to `a`.
 */
export const flatMap = <A, B>(l: List<A>, f: (a: A) => List<B>): List<B> =>
  foldRight(l, List(), (a, acc) => append(f(a), acc));

/**
 * Folds every element of the list into a single value by recursively applying
 * the provided function, starting at the left-hand side of the list.
 */
export const foldLeft = <A, B>(l: List<A>, z: B, f: (b: B, a: A) => B): B => {
  let state = z;
  while (l.tag !== "nil") {
    state = f(state, l.head);
    l = l.tail;
  }
  return state;
};

/**
 * Folds every element of the list into a single value by recursively applying
 * the provided function, starting at the right-hand side of the list.
 */
export const foldRight = <A, B>(l: List<A>, z: B, f: (a: A, b: B) => B): B =>
  foldLeft(reverse(l), z, (b, a) => f(a, b));

/**
 * Returns the tail of a list
 */
export const getTail = <A>(l: List<A>): List<A> => {
  if (l.tag === "nil")
    throw new Error("Attempt to take tail of empty list");

  return l.tail;
};

/**
 * Returns `true` if `sup` contains the entirety of `sub`, in order and without
 * interruption, starting in any position. Returns `false` otherwise.
 */
export const hasSubsequence = <A>(sup: List<A>, sub: List<A>): boolean => {
  const folded = foldLeft(sup, sub, (rem, cur) => {
    if (rem.tag === "nil")
      return nil();
    else if (cur === rem.head)
      return rem.tail;
    else
      return sub;
  });
  return folded === nil();
};

/**
 * Returns all but the last element of `l`
 */
export const init = <A>(l: List<A>): List<A> => {
  if (l.tag === "nil")
    throw new Error("Attempt to get init of empty list");

  if (l.tail === nil())
    return nil();

  return new Cons(l.head, init(l.tail));
};

/**
 * Returns the length of l
 */
export const length = <A>(l: List<A>): number =>
  foldLeft(l, 0, (len, a) => len + 1);

/**
 * Returns a new list where each element is the result of applying `f`
 * to the corresponding element in `la`
 */
export const map = <A, B>(la: List<A>, f: (a: A) => B): List<B> =>
  flatMap(la, a => List(f(a)));

/**
 * Smart constructor for an empty list
 */
export const nil = <A>(): List<A> => Nil.NIL;

/**
 * Multiplies a list of numbers together
 */
export const product = (ns: List<number>): number =>
  foldLeft(ns, 1.0, (prod, n) => n * prod);

/**
 * Returns the reverse of a list
 */
export const reverse = <A>(l: List<A>): List<A> =>
  foldLeft(l, List(), (rev, a) => new Cons(a, rev));

/**
 * Replaces the head of a list with a different value
 */
export const setHead = <A>(l: List<A>, a: A): List<A> => {
  if (l.tag === "nil")
    throw new Error("Attempt to set head of empty list");

  return new Cons(a, l.tail);
};

/**
 * Adds up a list of numbers
 */
export const sum = (ns: List<number>): number =>
  foldLeft(ns, 0, (tot, n) => n + tot);

/**
 * Retuns a list containing the string representations of the elements of the
 * input list.
 */
export const toString = <A>(l: List<A>): List<string> =>
  map(l, a => a.toString());

/**
 * Returns a list comprising the results of applying `f` to corresponding
 * elements of the provided lists
 */
export const zipWith = <A, B, C>(
    la: List<A>,
    lb: List<B>,
    f: (a: A, b: B) => C): List<C> =>
  reverse(foldLeft<A, [List<C>, List<B>]>(
    la,
    [nil(), lb],
    ([acc, rem], a) => {
      if (rem.tag === "cons")
        return [new Cons(f(a, rem.head), acc), rem.tail];
      else
        return [acc, rem];
    },
  )[0]);

export default {
  Cons,
  List,
  Nil,
  addCorresponding,
  addOne,
  append,
  concat,
  cons,
  drop,
  dropWhile,
  filter,
  flatMap,
  getTail,
  hasSubsequence,
  init,
  length,
  nil,
  product,
  reverse,
  setHead,
  sum,
  toString,
};
