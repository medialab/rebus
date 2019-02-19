import React, {Component} from 'react';

class Caption extends Component {
  render = () => {
    const {
      props: {
        caption,
        targetDimensions,
        cropCaption = false,
      },
    } = this;
    if (!caption || !caption.image) {
      return null;
    }
    const bindRef = image => {
      this.image = image;
    };
    const imageRatio = +caption.image.imageHeight / +caption.image.imageWidth;
    
    const captionTargetWidth = targetDimensions.width;
    const captionWidthRatio = +caption.width;
    const captionRatio = caption.width / caption.height;
    const imageWidth = +caption.image.imageWidth;
    const captionInitialWidth = imageWidth * captionWidthRatio;
    
    const imageFinalWidth = (imageWidth * captionTargetWidth) / captionInitialWidth;
    const imageFinalHeight = imageFinalWidth * imageRatio;
    const left = - caption.x * imageFinalWidth;
    const top = - caption.y * imageFinalHeight - targetDimensions.height
    const style = {
      width: imageFinalWidth,
      height: imageFinalHeight,
      left,
      top,
      position: 'absolute'
    }
    let containerStyle = {};
    if (cropCaption) {
      containerStyle = {
        width: captionTargetWidth * 1.3,
        height: captionTargetWidth * captionRatio * 1.3 * 2,
        left: 0,
        top: -(captionTargetWidth * captionRatio)*1.3 * 2 * .5,
        overflow: 'hidden',
        position: 'absolute'
      }
    }
    return (
      <div style={containerStyle}>
        <img 
          ref={bindRef} 
          src={caption.src} 
          alt={caption.src}
          style={style}
        />
      </div>
    )
      
  }
}

export default Caption;