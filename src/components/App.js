import { Component } from 'react';

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
      to: { x: 400, y: 400 },
      scale: { x: 2, y: 2 }
    };

    this.handleOnclick = this.handleOnclick.bind(this);
  }

  handleOnclick() {
    if (this.state.to.x === 400)
      this.setState({ to: { x: 0, y: 0 }, scale: { x: 1, y: 1 } });
    else
      this.setState({ to: { x: 400, y: 400 }, scale: { x: 2, y: 2} });
  }

  render () {
    return (
      <section>
        <button onClick={this.handleOnclick}>Click me</button>
        <Stepper to={this.state.to} scale={this.state.scale}>
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
  constructor() {
    super();

    this.state = {
      offset: { x: 0, y: 0 },
      scale: { x: 1, y: 1 }
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
    this.renderFrame(0);
  }

  componentDidMount() {
    this.renderFrame(0);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    // Make child just expose a transform property that it then hooks into?
    // In future can abstract components that have certain animations
    // and children passed into these components will be animated that way
    return this.props.children(
      CSSmatrix(
        this.state.scale.x,
        0,
        0,
        this.state.scale.y,
        this.state.offset.x,
        this.state.offset.y
      ));
  }
}

function CSSmatrix(...values) {
  return `matrix(${values.join(', ')})`;
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
