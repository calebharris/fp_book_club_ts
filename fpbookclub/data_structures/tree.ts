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
