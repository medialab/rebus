import React, {Component} from 'react';
import PropTypes from 'prop-types';
import extractTargetTerm from '../helpers/extractTargetTerm';
import findRelatedLabels from '../helpers/findRelatedLabels';
import {getImageSrc} from '../helpers/client';

import Label from './Label';
class LabelsTake extends Component {

  render = () => {
    const {
      props: {
        children,
      },
      context: {
        labels = [],
        cluster = 'all clusters',
        imagesMap = {},
        settings = {},
      },
      target,
      container,
    } = this;

    const {
      labelsLayout: initialLabelsLayout = 'random',
      imagesWidth : initialImagesWidth = 'word width'

    } = settings;

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
    let labelsLayout = initialLabelsLayout;
    if (options.includes('align')) {
      labelsLayout = 'align';
    } else if (options.includes('stack')) {
      labelsLayout = 'stack';
    } else if (options.includes('superpoze')) {
      labelsLayout = 'superpoze';
    }

    const {term: targetTerm, options = []} = extractTargetTerm(children);
    const relatedImages = findRelatedLabels(
      labels.filter(label => {
        if (cluster === 'all clusters') {
          return true;
        }
        return label.tweetCluster === cluster;
      })
      , targetTerm);
    const displayedLabels = relatedImages.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }
      return 1;
    })
    .map(label => ({
      ...label,
      image: imagesMap[label.image_id],
      src: getImageSrc(imagesMap[label.image_id])
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

    if (labelsLayout === 'stack') {
      containerStyle.left = -(displayedLabels.length / 2) * 5;
      containerStyle.top = -(displayedLabels.length / 2) * 5;
    }
    return (
      <span 
        ref={bindContainer}
        style={{
          minWidth: imagesWidth === 'word width' ? undefined : +imagesWidth * 1.3,
          display: imagesWidth === 'word width' ? undefined : 'inline-block'
        }}
        className="labels-take"
      >
        <span className="take-anchor" ref={bindTargetRef}>
          {targetTerm}
        </span>
        {
          displayedLabels.map((label, index) => {
            return (
              <div
                style={containerStyle}
                key={index} 
                className="label-container"
              >
                <Label 
                  key={index} 
                  label={label} 
                  index={index}
                  layout={labelsLayout}
                  targetDimensions={{
                    ...targetDimensions,
                    width: imagesWidth === 'word width' ? targetDimensions.width : +imagesWidth

                  }} 
                />
              </div>
            )
          })
        }
      </span>
    )

  }
}


LabelsTake.contextTypes = {
  labels: PropTypes.array,
  imagesMap: PropTypes.object,
  cluster: PropTypes.string,
  settings: PropTypes.object,
}

export default LabelsTake;