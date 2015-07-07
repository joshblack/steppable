export function translate(x, y) {
  return [
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
  ];
}

export function scale(x, y) {
  return [
    [x, 0, 0],
    [0, y, 0],
    [0, 0, 1]
  ];
}

export function rotate(alpha) {
  // Convert to radians
  const a = alpha * (Math.PI / 180);

  return [
    [Math.cos(a), -Math.sin(a), 0],
    [Math.sin(a), Math.cos(a), 0],
    [0, 0, 1]
  ];
}

export function multiply(...matrices) {
  return matrices.reduce((p, m) => mult(p, m));
}

function mult(a, b) {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
      a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
      a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
    ],
    [
      a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
      a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
      a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
    ]
  ];
}
