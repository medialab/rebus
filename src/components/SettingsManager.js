import React, {Component} from 'react';
import PropTypes from 'prop-types';

export const settingsSchema = {
  properties: {
    cropCaptions: {
      description: 'crop captions',
      type: 'boolean'
    },
    labelsLayout: {
      description: 'labels layout',
      type: 'string',
      enum: ['stack', 'random', 'superpoze']
    }
  },
  default: {
    cropCaptions: false,
    labelsLayout: 'random'
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