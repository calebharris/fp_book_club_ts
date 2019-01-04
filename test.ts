abstract class Baz {
  test(this: Foo | Bar) {
    if (this.tag === "bar") return false;

    return run(() => this.p);
  }
}

class Foo extends Baz {
  tag: "foo" = "foo";
  p: boolean;
}

class Bar extends Baz {
  tag: "bar" = "bar";
}

function run(f: () => boolean) {
  return f();
}

function id(b: boolean) {
  return b;
}
