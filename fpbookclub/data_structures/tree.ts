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
