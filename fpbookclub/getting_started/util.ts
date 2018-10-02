export function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return function(a: A) {
    return partial1(a, f);
  };
}

export function partial1<A, B, C>(a: A, f: (a: A, b: B) => C): (b: B) => C {
  return function(b) {
    return f(a, b);
  };
}

export function uncurry<A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C {
  return function(a: A, b: B): C {
    return f(a)(b);
  };
}

export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return function(a: A) {
    return f(g(a));
  }
}
