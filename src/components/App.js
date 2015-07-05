import { Component } from 'react';
import { translate, rotate, scale, multiply } from '../matrix';

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

function interpolate(x, y, t) {
  return x + t * (y - x);
}

//  matrix(1, 0, 0, 1, 399.998413085938, 399.998413085938);

const step = 0.01;

class Stepper extends Component {
  constructor(props) {
    super(props);

    this.matrix = multiply(
      rotate(props.rotate),
      scale(props.scale.x, props.scale.y),
      translate(props.translate.x, props.translate.y)
    );

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

  renderFrame(t) {
    this.raf = requestAnimationFrame(() => {
      const offset = {
        x: interpolate(this.state.offset.x, this.props.to.x, t),
        y: interpolate(this.state.offset.y, this.props.to.y, t)
      };

      const scale = {
        x: interpolate(this.state.scale.x, this.props.scale.x, t),
        y: interpolate(this.state.scale.y, this.props.scale.y, t)
      };

      if (Math.abs(offset.x - this.props.to.x) <= 0.001) {
        cancelAnimationFrame(this.raf);
      } else {
        this.setState({ offset, scale });
        this.renderFrame(t + step);
      }
    });
  }

  componentWillReceiveProps(props) {
    cancelAnimationFrame(this.raf);
    // this.renderFrame(0);
  }

  componentDidMount() {
    // this.renderFrame(0);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    // Make child just expose a transform property that it then hooks into?
    // In future can abstract components that have certain animations
    // and children passed into these components will be animated that way
    return this.props.children(this.state.position);
  }
}

function CSSmatrix(matrix) {
  return 'matrix(' +
    matrix[0][0] + ', ' +
    matrix[0][1] + ', ' +
    matrix[0][2] + ', ' +
    matrix[1][0] + ', ' +
    matrix[1][1] + ', ' +
    matrix[1][2] + ')';
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
