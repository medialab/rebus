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
      cropCaptions : initialCropCaptions = false,
      imagesWidth : initialImagesWidth = 'word width',
      captionsLayout : initialCaptionsLayout = 'align'
    } = settings;

    const {term: targetTerm, options = []} = extractTargetTerm(children);
    const cropCaptions = options.includes('crop') ? 'crop' : initialCropCaptions;
    let imagesWidth = initialImagesWidth;
    options.forEach(o => {
      const match = o.match(/width([\d]+)/);
      if (match && match[1]) {
        const candidate = +match[1];
        if (!isNaN(candidate)) {
          imagesWidth  = candidate;
        }
      }
    })
    let captionsLayout = initialCaptionsLayout;
    if (options.includes('align')) {
      captionsLayout = 'align';
    } else if (options.includes('stack')) {
      captionsLayout = 'stack';
    }
    const relatedImages = findRelatedCaptions(
      captions.filter(caption => {
        // console.log(caption.tweetCluster, cluster, caption.tweetCluster === cluster)
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
      if (captionsLayout === 'stack') {
        containerStyle.left -= (displayedCaptions.length * .5) * 5
        containerStyle.top -= (displayedCaptions.length * .5) * 5
      }
    }
    return (
      <span 
        ref={bindContainer} 
        className="captions-take"
        style={{
          minWidth: imagesWidth === 'word width' ? undefined : +imagesWidth,
          display: imagesWidth === 'word width' ? undefined : 'inline-block'

        }}
      >
        <span className="take-anchor" ref={bindTargetRef}>
          {targetTerm}
        </span>
        {
          displayedCaptions
          .map((caption, index) => {
            return (
              <div
                style={containerStyle}
                key={index} 
                className="caption-container"
              >
                <Caption 
                  key={index} 
                  caption={caption} 
                  targetDimensions={{
                    ...targetDimensions,
                    width: imagesWidth === 'word width' ? targetDimensions.width : +imagesWidth
                  }} 
                  cropCaption={cropCaptions}
                  index={index}
                  captionLayout={captionsLayout}
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