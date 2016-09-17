import React, { PropTypes } from 'react';

export default class ParsonViewer extends React.Component {

  static propTypes = {
    parson: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.CANVAS_ID = 'parson-canvas-wrapper';
    this.OFFSET = 12;

    this.state = {
      canvas: null
    };

    this.updateCanvas = this.updateCanvas.bind(this);
  }

  componentDidMount() {
    this.updateCanvas(this.props.parson);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.parson !== nextProps.parson) {
      this.updateCanvas(nextProps.parson);
    }
  }

  updateCanvas(parson) {
    let { canvas } = this.state;
    if (canvas === null) {
      canvas = document.getElementById(this.CANVAS_ID);
      this.setState({
        canvas: canvas
      });
    }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 0;
    let y = 130;

    ctx.fillRect(x, y, this.OFFSET / 2, this.OFFSET / 2);
    ctx.stroke();

    for (var i = 0; i < parson.length; i++) {
      x += this.OFFSET;
      switch(parson[i]) {
        case 'u':
          y -= this.OFFSET;
          break;
        case 'd':
          y += this.OFFSET;
          break;
      }

      ctx.fillRect(x, y, this.OFFSET / 2, this.OFFSET / 2);
      ctx.stroke();
    }
  }

  render() {
    return (
      <canvas id={this.CANVAS_ID} width="600" height="260"></canvas>
    )
  }
}