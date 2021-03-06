import React, {Component} from 'react';
import PropTypes from 'prop-types';

export const settingsSchema = {
  properties: {
    cropCaptions: {
      description: 'crop captions',
      type: 'boolean'
    },

    captionsLayout: {
      description: 'captions layout',
      type: 'string',
      enum: ['align', 'stack']
    },
    
    imagesWidth: {
      description: 'images width',
      type: 'string',
      enum: ['word width', '10', '20', '50', '100', '150', '200', '250', '300', '350', '400', '450', '500']
    },
    
    labelsLayout: {
      description: 'labels layout',
      type: 'string',
      enum: ['stack', 'random', 'superpoze']
    },
    grabOnlyExactTweetMatches: {
      description: 'grab only tweets that match exactly the words',
      type: 'boolean',
    },

    lineHeight: {
      description: 'poster text line height',
      type: 'string',
      enum: ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2']
    }
    
  },
  default: {
    cropCaptions: false,
    labelsLayout: 'random',
    imagesWidth: 'word width',
    captionsLayout: 'align',
    grabOnlyExactTweetMatches: false,
    lineHeight: 'double'
  }
}

class SettingsManager extends Component {
  constructor(props) {
    super(props);
  }

  updateSettings = (key, value) => {
    const newSettings = {
      ...this.context.settings,
      [key]: value
    };
    this.context.updateSettings(newSettings);
  }

  makeUi = (model, key, value) => {
    switch(model.type) {
      case 'boolean':
        const onYes = () => {
          this.updateSettings(key, true);
        }
        const onNo = () => {
          this.updateSettings(key, false);
        }
        return (
          <ul className="multiple-choices">
            <li onClick={onYes}>
              <input 
              type="radio" 
              onChange={onYes}
              value={true}
                     checked={value === true}
              />
              <label>Yes</label>
            </li>
            <li onClick={onNo}>
              <input 
              type="radio" 
              value={false}
              checked={value === false}
              onChange={onNo}
              />
              <label>No</label>
            </li>
          </ul>
        );
      case 'string':
        if (model.enum) {
          return (
            <ul className="multiple-choices">
              {
                model.enum.map((thatValue, index) => {
                  const handleClick = () => {
                    this.updateSettings(key, thatValue);
                  }
                  return (
                    <li onClick={handleClick} key={index}>
                      <input 
                        onChange={handleClick} 
                        type="radio" 
                        id="no" 
                        value={thatValue}
                        checked={value === thatValue}
                      />
                      <label>
                        {thatValue}
                      </label>
                    </li>
                  )
                })
              }
            </ul>
          );
        }
        return null;
      default:
        return null;
    }
  }

  render = () => {
    const {
      props: {

      },
      context: {
        settings,
        updateSettings,
      },
      makeUi
    } = this;
    return (
      <div>
        {
          Object.keys(settingsSchema.properties).map((key, index) => {
            const model = settingsSchema.properties[key];
            return (
              <div key={index}>
                <h3>{model.description}</h3>
                {makeUi(model, key, settings[key])}
              </div>
            )
          })
        }
      </div>
    )
  }
}

SettingsManager.contextTypes = {
  settings: PropTypes.object,
  updateSettings: PropTypes.func,
}

export default SettingsManager;