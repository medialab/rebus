import Tabletop from 'tabletop';
import get from 'axios';

import getConfig from './getConfig';

const RENDER_CSS_URL = process.env.PUBLIC_URL + '/render.css';
const CONFIG_URL = process.env.PUBLIC_URL + '/config.json';

export const fetchConfig = () => 
  new Promise((resolve, reject) => {
    get(CONFIG_URL)
      .then(({data}) => resolve(data))
      .catch(reject)
  })

export const getPrintCss = () => 
  new Promise((resolve, reject) => {
    get(RENDER_CSS_URL)
      .then(({data}) => resolve(data))
      .catch(reject)
  })

export const getTweets = (group = 'default') => {
  const config = getConfig();
  if (!config.sources[group]) {
    return new Promise((r, reject) => reject('no config'));
  }
  const {
    sources: {
      [group]: {
        tweetsSpreadsheetGoogleDriveId
      }
    }
  } = config;
  return new Promise((resolve) => {
    Tabletop.init({ 
      key: tweetsSpreadsheetGoogleDriveId, 
      simpleSheet: true,
      callback: (data) => {
        resolve(data);
      } 
    })
  })
}

export const getCaptions = (group = 'default') => {
  const config = getConfig();
  if (!config.sources[group]) {
    return new Promise((r, reject) => reject('no config'));
  }
  const {
    sources: {
      [group]: {
        captionsGoogleDriveId
      }
    }
  } = config;
  return new Promise((resolve, reject) => {

    Tabletop.init({ 
      key: captionsGoogleDriveId, 
      simpleSheet: true,
      callback: (data) => {
        try{
          resolve(
            data.map(caption => ({
              ...caption,
              caption: caption.name.toLowerCase()
            }))
            )
        } catch(e) {
          reject(e);
        }
      } 
    })
  })
}
export const getLabels = (group = 'default') => {
  const config = getConfig();
  if (!config.sources[group]) {
    return new Promise((r, reject) => reject('no config'));
  }
  const {
    sources: {
      [group]: {
        labelsGoogleDriveId
      }
    }
  } = config;
  return new Promise((resolve, reject) => {

    Tabletop.init({ 
      key: labelsGoogleDriveId, 
      simpleSheet: true,
      callback: (data) => {
        try{
          resolve(
            data.map(label => ({
              ...label,
              description: label.description.toLowerCase()
            }))
            )
        } catch(e) {
          reject(e);
        }
      } 
    })
  })
}
export const getImages = (group = 'default') => {
  const config = getConfig();
  if (!config.sources[group]) {
    return new Promise((r, reject) => reject('no config'));
  }
  const {
    sources: {
      [group]: {
        imagesGoogleDriveId
      }
    }
  } = config;
  return new Promise((resolve, reject) => {

    Tabletop.init({ 
      key: imagesGoogleDriveId, 
      simpleSheet: true,
      callback: (data) => {
        try{
          resolve(data);
        } catch(e) {
          reject(e);
        }
      } 
    })
  })
}

export const getImageSrc = (image = {}, group = 'default') => {
  const config = getConfig();
  if (!config.sources[group]) {
    return undefined;
  }
  const {
    sources: {
      [group]: {
        imagesSrcBase    
      }
    }
    
  } = config;

  const {id, imageType} = image;

  return `${imagesSrcBase}/${id}.${imageType}`
}