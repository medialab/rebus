import React, {Component} from 'react';

class Caption extends Component {
  render = () => {
    const {
      props: {
        caption,
        targetDimensions,
        cropCaption = false,
        index,
        captionLayout = 'align',
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
    const top = - caption.y * imageFinalHeight - (caption.height * imageFinalHeight) / 2
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
        width: captionTargetWidth,
        // border: '3px solid red',
        height: captionTargetWidth * captionRatio,
        left: 0,
        top: -(captionTargetWidth * captionRatio * .5),
        overflow: 'hidden',
        position: 'absolute'
      }
      style.top += (containerStyle.height * .5)
      // style.left -= (containerStyle.width * .5)
      if (captionLayout === 'stack') {
        containerStyle.left = index * 5;
        containerStyle.top = index * 5;
      }
    } else {
      if (captionLayout === 'stack') {
        style.top += index * 5;
        style.left += index * 5;
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