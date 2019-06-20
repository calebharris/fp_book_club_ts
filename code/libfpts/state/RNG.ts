export interface RNG {
  nextInt(): [number, RNG];
}

const MAX_INT_32 = 2147483647;
const MIN_INT_32 = -2147483648;

export class SimpleRNG implements RNG {
  readonly seed: bigint;

  constructor(seed: bigint) {
    this.seed = BigInt.asIntN(64, seed);
  }

  /* tslint:disable:no-bitwise */
  nextInt(): [number, RNG] {
    const newSeed = BigInt.asIntN(64, this.seed * 0x5deece66dn + 0xbn) & 0xffffffffffffn;
    const nextRNG = new SimpleRNG(newSeed);
    const n = Number(BigInt.asIntN(32, newSeed >> 16n));
    return [n, nextRNG];
  }
  /* tslint:enable:no-bitwise */
}

export const nonNegativeInt = (rng: RNG): [number, RNG] => {
  const [x, rng2] = rng.nextInt();
  if (x === MIN_INT_32)
    return [0, rng2];
  if (x < 0)
    return [-x, rng2];
  else
    return [x, rng2];
};

export const double = (rng: RNG): [number, RNG] => {
  const [x, rng2] = nonNegativeInt(rng);
  return [x / (MAX_INT_32 + 1.0), rng2];
};

export const double3 = (rng: RNG): [[number, number, number], RNG] => {
  const [d1, rng2] = double(rng);
  const [d2, rng3] = double(rng2);
  const [d3, rng4] = double(rng3);
  return [[d1, d2, d3], rng4];
};

export const intDouble = (rng: RNG): [[number, number], RNG] => {
  const [n, rng2] = rng.nextInt();
  const [d, rng3] = double(rng2);
  return [[n, d], rng3];
};

export default { double, double3, intDouble, nonNegativeInt, SimpleRNG };
