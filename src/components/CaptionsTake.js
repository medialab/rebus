import React, {Component} from 'react';
import PropTypes from 'prop-types';
import extractTargetTerm from '../helpers/extractTargetTerm';
import findRelatedCaptions from '../helpers/findRelatedCaptions';
import {getImageSrc} from '../helpers/client';

import Caption from './Caption';
class CaptionsTake extends Component {

  render = () => {
    const {
      props: {
        children,
      },
      context: {
        captions = [],
        cluster = 'all clusters',
        imagesMap = {},
        settings = {}
      },
      target,
      container,
    } = this;

    const {
      cropCaptions = false,
    } = settings;

    const targetTerm = extractTargetTerm(children);
    const relatedImages = findRelatedCaptions(
      captions.filter(caption => {
        if (cluster === 'all clusters') {
          return true;
        }
        return caption.tweetCluster === cluster;
      })
    , targetTerm);
    const displayedCaptions = relatedImages.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }
      return 1;
    })
    .map(caption => ({
      ...caption,
      image: imagesMap[caption.image_id],
      src: getImageSrc(imagesMap[caption.image_id])
    }));
    const bindTargetRef = target => {
      this.target = target;
    }
    const bindContainer = container => {
      this.container = container;
    }
    let targetDimensions = {};
    let containerStyle = {};
    if (target && container) {
      targetDimensions = target.getBoundingClientRect();
      const containerDimensions = container.getBoundingClientRect();
      containerStyle = {
        left: (targetDimensions.x - containerDimensions.x), 
        top: (targetDimensions.y - containerDimensions.y),
      };
    }
    return (
      <span ref={bindContainer} className="captions-take">
        <span className="take-anchor" ref={bindTargetRef}>
          {targetTerm}
        </span>
        {
          displayedCaptions.map((caption, index) => {
            return (
              <div
                style={containerStyle}
                key={index} 
                className="caption-container"
              >
                <Caption 
                  key={index} 
                  caption={caption} 
                  targetDimensions={targetDimensions} 
                  cropCaption={cropCaptions}
                />
              </div>
            )
          })
        }
      </span>
    )

  }
}


CaptionsTake.contextTypes = {
  captions: PropTypes.array,
  imagesMap: PropTypes.object,
  cluster: PropTypes.string,
  settings: PropTypes.object,
}

export default CaptionsTake;