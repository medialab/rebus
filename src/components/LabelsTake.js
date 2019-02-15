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
      },
      target,
      container,
    } = this;

    const targetTerm = extractTargetTerm(children);
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
    return (
      <span ref={bindContainer} className="labels-take">
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
                  targetDimensions={targetDimensions} 
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
}

export default LabelsTake;