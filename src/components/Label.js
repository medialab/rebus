import React, {Component} from 'react';

class Label extends Component {
  render = () => {
    const {
      props: {
        label,
        targetDimensions,
      }
        
    } = this;
    if (!label || !label.image) {
      return label;
    }
    const bindRef = image => {
      this.image = image;
    };

    const imageRatio = +label.image.imageHeight / +label.image.imageWidth;
    
    const labelWidth = targetDimensions.width * 1.5;
    const labelHeight = labelWidth * imageRatio;
    const left = Math.random() * (targetDimensions.width * 2) - targetDimensions.width;
    const top = Math.random() * (targetDimensions.width * 2) - targetDimensions.width;
    // const captionWidthRatio = +caption.width;
    // const imageWidth = +caption.image.imageWidth;
    // const captionInitialWidth = imageWidth * captionWidthRatio;
    
    const style = {
      width: labelWidth,
      height: labelHeight,
      left,
      top,
      position: 'absolute'
    }
    return (
      <img 
        ref={bindRef} 
        src={label.src} 
        alt={label.src}
        style={style}
      />
    )      
  }
}

export default Label;