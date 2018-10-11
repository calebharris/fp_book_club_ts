/**
 * tree.ts - a functional binary tree implementation
 **/

/**
 * A Tree node is either a Leaf or a Branch
 **/
export type Tree<A> = Leaf<A> | Branch<A>

/**
 * A Leaf is a value-containing node. It does not have child nodes.
 **/
export class Leaf<A> {
  tag: "leaf" = "leaf";
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }
}

/**
 * A Branch does not contain a value, but does have children.
 **/
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
 **/
export function depth<A>(t: Tree<A>): number {
  if (t.tag === "leaf") return 1;

  return Math.max(depth(t.left), depth(t.right)) + 1;
}

/**
 * Returns the result of folding over a `Tree` with `f`
 **/
export function fold<A, B>(t: Tree<A>,
                           f: (a: A) => B,
                           g: (l: B, r: B) => B): B {
  if (t.tag === "leaf") return f(t.value);

  return g(fold(t.left, f, g), fold(t.right, f, g));
}


/**
 * Returns a new tree of the same shape as the input tree, with each leaf
 * containing the result of applying `f` to each leaf in the input tree
 **/
export function map<A, B>(t: Tree<A>, f: (a: A) => B): Tree<B> {
  if (t.tag === "leaf") return new Leaf(f(t.value));

  return new Branch(map(t.left, f), map(t.right, f));
}

/**
 * Returns the maximum value from a tree of numbers
 **/
export function maximum(t: Tree<number>): number {
  if (t.tag === "leaf") {
    return t.value;
  } else {
    return Math.max(maximum(t.left), maximum(t.right));
  }
}

/**
 * Returns the total number of nodes in a tree
 **/
export function size(t: Tree<unknown>): number {
  if (t.tag === "leaf") {
    return 1;
  } else {
    return 1 + size(t.left) + size(t.right);
  }
}
