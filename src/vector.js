export function vector(a, b) {
  return [a, b];
}

export function normalize(v) {
  const { pow, sqrt } = Math;

  return sqrt(square(v[0]) + square(v[1]) + square(v[2]));
}

function square(n) {
  return Math.pow(n, 2);
}

export function nInterpolate(a, b, t) {
  const result = add(a, scalar(t, subtract(b, a)));

  // Need fast approximation for normalize
  return scalar(1 / normalize(result), result);
}

export function interpolate(a, b, t) {
  return add(a, scalar(t, subtract(b, a)));
}

export function scalar(k, v) {
  return [
    k * v[0],
    k * v[1],
    k * v[2]
  ];
}

export function add(a, b) {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
  ];
}

export function subtract(a, b) {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ];
}
