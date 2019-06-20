/**
 * tree.ts - a functional binary tree implementation
 */

/**
 * A Tree node is either a Leaf or a Branch
 */
export type Tree<A> = Leaf<A> | Branch<A>;

/**
 * A Leaf is a value-containing node. It does not have child nodes.
 */
export class Leaf<A> {
  tag: "leaf" = "leaf";
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }
}

/**
 * A Branch does not contain a value, but does have children.
 */
export class Branch<A> {
  tag: "branch" = "branch";
  readonly left: Tree<A>;
  readonly right: Tree<A>;

  constructor(left: Tree<A>, right: Tree<A>) {
    this.left = left;
    this.right = right;
  }
}

/**
 * Returns the maximum path length from the root node to a leaf
 */
export const depth = (t: Tree<unknown>): number =>
  fold(t, a => 1, (l, r) => Math.max(l, r) + 1);

/**
 * Returns the result of folding over a `Tree` with `f`
 */
export const fold = <A, B>(t: Tree<A>,
                           f: (a: A) => B,
                           g: (l: B, r: B) => B): B => {
  if (t.tag === "leaf")
    return f(t.value);
  else
    return g(fold(t.left, f, g), fold(t.right, f, g));
};

/**
 * Returns a new tree of the same shape as the input tree, with each leaf
 * containing the result of applying `f` to each leaf in the input tree
 */
export const map = <A, B>(t: Tree<A>, f: (a: A) => B): Tree<B> =>
  fold(
    t,
    a => new Leaf(f(a)) as Tree<B>,
    (l, r) => new Branch(l, r),
  );

/**
 * Returns the maximum value from a tree of numbers
 */
export const maximum = (t: Tree<number>): number =>
  fold(t, n => n, (l, r) => Math.max(l, r));

/**
 * Returns the total number of nodes in a tree
 */
export const size = (t: Tree<unknown>): number =>
  fold(t, x => 1, (l, r) => l + r + 1);
