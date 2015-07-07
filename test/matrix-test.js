import { Component } from 'react';
import { translate, rotate, scale, multiply } from '../matrix';
import { interpolate, nInterpolate } from '../vector';

// TO TEST
// Breaking down vectors into their identity forms, verifying each one interpolates correctly, then checking combined also interpolates correctly
// Good test could be the identity transformation




// TODO:
// Make additive tool that shows you the animation as you
// add effects onto it in a continuum.
//
// Will give you a timeline, contributing factor of each affect, and a preview
// maybe give a predictor?
//
// Maybe give option to keep adding a translation or a scale and see what happens
//
// translate
// scale
// rotate
export default class App extends Component {
  constructor() {
    super();

    this.state = {
      translate: { x: 400, y: 400 },
      scale: { x: 2, y: 2 },
      rotate: 45
    };

    this.handleOnclick = this.handleOnclick.bind(this);
  }

  handleOnclick() {
    if (this.state.to.x === 400) {
      this.setState({
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotate: 0
      });
    } else {
      this.setState({
        translate: { x: 400, y: 400 },
        scale: { x: 2, y: 2},
        rotate: 45
      });
    }
  }
// Provide keyframe UI to this
  render () {
    return (
      <section>
        <button onClick={this.handleOnclick}>Click me</button>

        <Stepper
          translate={this.state.translate}
          scale={this.state.scale}
          rotate={this.state.rotate}>
          {transform => <Box transform={transform} />}
        </Stepper>
      </section>
    );
  }
}

// just spline your time parameters to speed up / slow down

function print(m) {
  return m.reduce((p, r) => {
    return p + r.join(', ') + '\n';
  }, '');
}

function col(m) {
  return (i) => {
    return [m[0][i], m[1][i], m[2][i]];
  }
}

function mInterpolate(A, B, t, interpolate) {
  const colA = col(A);
  const colB = col(B);
  const [a, d, g] = interpolate(colA(0), colB(0), t);
  const [b, e, h] = interpolate(colA(1), colB(1), t);
  const [c, f, i] = interpolate(colA(2), colB(2), t);

  return [
    [a, b, c],
    [d, e, f],
    [g, h, i]
  ];
}

const step = 0.01;

class Stepper extends Component {
  constructor() {
    super();

    this.state = {
      position: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ]
    };

    this.renderFrame = this.renderFrame.bind(this);
  }

  static raf

  renderFrame(t, T, R, S) {
    this.raf = requestAnimationFrame(() => {
      const p = this.state.position;
      // const position = multiply(
      //   mInterpolate(p, T, t, interpolate),
      //   mInterpolate(p, R, t, nInterpolate),
      //   mInterpolate(p, S, t, interpolate)
      // );

      // const position = mInterpolate(p, T, t, interpolate);
      // const position = mInterpolate(p, R, t, nInterpolate);
      const position = mInterpolate(p, S, t, interpolate);

      this.setState({ position });

      if (t + step < 1) {
        this.renderFrame(t + step, T, R, S);
      }
    });
  }

  componentWillReceiveProps(props) {
    cancelAnimationFrame(this.raf);
    this.renderFrame(0);
  }

  componentDidMount() {
    // const T = translate(this.props.translate.x, this.props.translate.y);
    const T = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    // const R = rotate(this.props.rotate);
    const R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    const S = scale(this.props.scale.x, this.props.scale.y);
    // const S = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    this.renderFrame(0, T, R, S);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    // Make child just expose a transform property that it then hooks into?
    // In future can abstract components that have certain animations
    // and children passed into these components will be animated that way
    return this.props.children(CSSmatrix(this.state.position));
  }
}

function CSSmatrix(matrix) {
  return 'matrix(' +
    matrix[0][0] + ', ' +
    matrix[1][0] + ', ' +
    matrix[0][1] + ', ' +
    matrix[1][1] + ', ' +
    matrix[1][2] + ', ' +
    matrix[0][2] + ')';
}

// Abstract this to render children and have this control
// placement of children with respect to what's put into it
class Box {
  render() {
    return (
      <div style={{
        background: 'black',
        width: 100,
        height: 100,
        transform: this.props.transform
      }} />
    );
  }
}
