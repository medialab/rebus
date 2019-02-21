import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tweet from './Tweet';
import extractTargetTerm from '../helpers/extractTargetTerm';
import findRelatedTweets from '../helpers/findRelatedTweets';

const mapTweetToRender = tweet => ({
  ...tweet,
  id_str: tweet.id,
  user: {
    name: tweet.from_user_name,
    screen_name: tweet.from_user_realname,
    profile_image_url: tweet.from_user_profile_image_url,
  },
  entities: {
    // media: 
    //   tweet.medias_files.split(',')
    // ,
    // urls: [],
    // user_mentions: [],
    // hashtags: [],
    // symbols: []
  }
});

class TweetsTake extends Component {
  render = () => {
    const {
      props: {
        children,
      },
      context: {
        tweets = [],
        cluster = 'all clusters',
      },
      target,
      container,
    } = this;

    const {term: targetTerm, options = []} = extractTargetTerm(children);
    const relatedTweets = findRelatedTweets(
      tweets.filter(tweet => {
        if (cluster === 'all clusters') {
          return true;
        }
        return tweet.cluster === cluster;
      })
      , targetTerm);

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
        left: (targetDimensions.x - containerDimensions.x - targetDimensions.width/2), 
        top: (targetDimensions.y - containerDimensions.y - targetDimensions.height/2),
        // left: -(targetDimensions.width/2), 
        // top: -(targetDimensions.height/2),
      };
    }
    return (
      <span ref={bindContainer} className="tweet-take">
        <span className="take-anchor" ref={bindTargetRef}>{targetTerm}</span>
        {
          relatedTweets
          .map(tweet => {
            return (
              <div
                style={containerStyle}
                key={tweet.id} 
                className="tweet-container"
              >
                <Tweet 
                  targetDimensions={targetDimensions} 
                  data={mapTweetToRender(tweet)} 
                  targetTerm={targetTerm}
                />
              </div>
            )
          })
        }
      </span>
    )

  }
}


TweetsTake.contextTypes = {
  tweets: PropTypes.array,
  cluster: PropTypes.string,
}

export default TweetsTake;