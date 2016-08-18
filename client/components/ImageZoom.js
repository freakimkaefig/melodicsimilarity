import React, { PropTypes } from 'react';
import { IMAGE_WIDTH, IMAGE_HEIGHT } from '../constants/SongsheetConstants';
import $ from 'jquery';
import '../stylesheets/ImageZoom.less';

export default class ImageZoom extends React.Component {

  static propTypes = {
    itemKey: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    scale: PropTypes.number
  };

  static defaultProps = {
    ...React.Component.defaultProps,
    image: '',
    scale: 2.4,
    store: null
  };

  constructor(props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseOver(e) {
    $(e.currentTarget).children('.image-zoom').css({
      'transform': 'scale(' + this.props.scale + ')',
      'cursor': 'move'
    });
  }

  onMouseOut(e) {
    $(e.currentTarget).children('.image-zoom').css({
      'transform': 'scale(1)'
    });
  }

  onMouseMove(e) {
    $(e.currentTarget).children('.image-zoom').css({
      'transform-origin': ((e.pageX - $(e.currentTarget).offset().left) / $(e.currentTarget).width()) * 100 + '% ' + ((e.pageY - $(e.currentTarget).offset().top) / $(e.currentTarget).height()) * 100 + '%'
    });
  }

  updateWrapper() {
    console.log("Update image zoom");
    if (this.props.image != '') {
      let $imageZoomWrapper = $('#image-zoom-wrapper-' + this.props.itemKey);
      $imageZoomWrapper.css({
        'height': (IMAGE_HEIGHT / IMAGE_WIDTH) * $imageZoomWrapper.width()
      });
    }
  }

  render() {
    let imageStyle = {
      backgroundImage: 'url(' + this.props.image + ')'
    };

    return (
      <div id={`image-zoom-wrapper-${this.props.itemKey}`} className="image-zoom-wrapper">
        <div className="image-zoom-container" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onMouseMove={this.onMouseMove}>
          <div className="image-zoom" style={imageStyle} data-scale={this.props.scale}>
            <img src={this.props.image} className="img-responsive" />
          </div>
        </div>
      </div>
    );
  }
}