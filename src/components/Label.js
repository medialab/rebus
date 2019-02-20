import React, {Component} from 'react';

class Label extends Component {
  render = () => {
    const {
      props: {
        label,
        targetDimensions,
        index,
        layout,
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
    let left = Math.random() * (targetDimensions.width * 2) - targetDimensions.width;
    let top = Math.random() * (targetDimensions.width * 2) - targetDimensions.width;
    // const captionWidthRatio = +caption.width;
    // const imageWidth = +caption.image.imageWidth;
    // const captionInitialWidth = imageWidth * captionWidthRatio;
    if (layout === 'superpoze') {
      left = 0;
      top = -labelHeight / 2;
    } else if (layout === 'stack') {
      left = index * 5;
      top = index * 5;
    }
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