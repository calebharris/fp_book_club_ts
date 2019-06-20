import rng, { SimpleRNG } from "./RNG";

describe("nonNegativeInt", () => {
  test("does not return negative ints", () => {
    const testRng = new SimpleRNG(197491923327988n);
    expect(rng.nonNegativeInt(testRng)[0]).toBeGreaterThanOrEqual(0);
  });

  test("thomas' test", () => {
    const testRng = new SimpleRNG(1059025964525n);
    expect(rng.nonNegativeInt(testRng)[0]).toEqual(1281479697);
  });
});

describe("double", () => {
  test("returns a value in the range [0, 1)", () => {
    const testRng = new SimpleRNG(42n);
    const [n, rng2] = rng.double(testRng);
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThan(1);
  });
});

describe("intDouble", () => {
  test("returns an int, double pair", () => {
    const testRng = new SimpleRNG(42n);
    const [[n, d], rng2] = rng.intDouble(testRng);
    expect(Number.isInteger(n)).toBeTruthy();
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThan(1);
  });
});

describe("double3", () => {
  test("returns 3 doubles", () => {
    const testRng = new SimpleRNG(42n);
    const [[d1, d2, d3], rng2] = rng.double3(testRng);
    expect(d1).toBeGreaterThanOrEqual(0);
    expect(d1).toBeLessThan(1);

    expect(d2).toBeGreaterThanOrEqual(0);
    expect(d2).toBeLessThan(1);

    expect(d3).toBeGreaterThanOrEqual(0);
    expect(d3).toBeLessThan(1);
  });
});
