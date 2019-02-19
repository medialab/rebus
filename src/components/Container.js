import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from "react-router-dom";
import {convertToRaw, CompositeDecorator} from 'draft-js';
import {EditorState, ContentState} from 'draft-js';
import debounce from 'lodash/debounce';
import schemaDefaults from 'json-schema-defaults';

import {
  getTweets,
  getCaptions,
  getPrintCss,
  getLabels,
  getImages,
  fetchConfig,
} from '../helpers/client';

import {
  hashtagStrategy, 
  tildeStrategy,
  dollarStrategy
} from '../helpers/draftStrategies';

import {settingsSchema} from './SettingsManager';

import EditorView from './EditorView';
import RendererView from './RendererView';

const startingText = `Les ~mouse de Paris sont nos amis ils nettoient la ville ils la débarrassent des déjections qui risqueraient sinon d’encombrer nos évacuations.
Ils sont indispensables à nos vies ils sont nos amis bien qu’en réfléchissant à une définition simple une définition raisonnable et rapide et durable de ce qu’il est convenu d’appeler ami on soit contraint d’admettre que l’indispensable n’y a pas sa place un ami n’est pas quelqu’un d’indispensable un ami n’est pas indispensable à la vieil n’est pas nécessaire il est même contingent c’est justement ce qui le rend précieux de ce point de vue là un ami n’est pas un rat et le rat peut-être n’est pas notre ami.
Un ami n’est pas quelqu’un d’indispensable.
Un ami n’est pas indispensable à la vie.
Il n’est pas nécessaire. 
Il est même contingent.
De ce point de vue là, un ami n’est pas un #rat et le $mouse, peut-être, n’est pas notre ami.`;

const HashtagSpan = ({children}) => 
  <span style={{color: 'blue'}}>
    {children}
  </span>

const TildeSpan = ({children}) => 
  <span style={{color: 'green'}}>
    {children}
  </span>
const DollarSpan = ({children}) => 
  <span style={{color: 'purple'}}>
    {children}
  </span>

/**
 * decorators from the draft editor
 */
const compositeDecorator = new CompositeDecorator([
  {
    strategy: hashtagStrategy,
    component: HashtagSpan,
  },
  {
    strategy: tildeStrategy,
    component: TildeSpan,
  },
  {
    strategy: dollarStrategy,
    component: DollarSpan,
  },
]);


class App extends Component {

  constructor(props) {
    super(props);
    const localText = localStorage.getItem('rebus/text');
    const startText = localText || startingText;
    const editorState = EditorState.createWithContent(
        ContentState.createFromText(startText)
    , compositeDecorator);
    const localMetadata = localStorage.getItem('rebus/metadata');
    const localSettings = localStorage.getItem('rebus/settings');
    let projectMetadata = {
      title: 'Rebus project title',
      subtitle: 'Rebus project subtitle',
      authors: 'Rebus project authors'
    };
    if (localMetadata) {
      try{
        projectMetadata = JSON.parse(localMetadata);
      } catch(e) {

      }
    }
    let settings = schemaDefaults(settingsSchema);
    if (localSettings) {
      try{
        settings = JSON.parse(localSettings);
      } catch(e) {

      }
    }

    this.state = {
      editorState,
      rawContent: convertToRaw(editorState.getCurrentContent()),
      tweets: [],
      captions: [],
      images: [],
      labels: [],
      captionsMap: {},
      renderCss: '',
      cluster: 'all clusters',
      autoUpdateEnabled: true,
      captionsLoaded: false,
      tweetsLoaded: false,
      labelsLoaded: false,
      imagesLoaded: false,
      projectMetadata,
      settingsOpen: false,
      settings,
    }
    this.updateRawContent = debounce(this.updateRawContent, 1000);
  }
  componentDidMount = () => {
    const position =  window.location.href;
    let group = 'default';
    const queryParts = position.split('?');
    if (queryParts.length > 1) {
      const queryRaw = queryParts.reverse()[0];
      const parts = queryRaw.split('&').map(p => p.split('='))
      const query = parts.reduce((res, tuple) => ({
        ...res,
        [tuple[0]]: decodeURIComponent(tuple[1])
      }), {});
      if (query.cluster) {
        this.setState({
          cluster: query.cluster,
        })
        // group = query.group;
      }
    }
    getPrintCss()
      .then((renderCss) => {
        this.setState({renderCss})
        return fetchConfig()
      })
      .then(config => {
        window.CONFIG = config;
        this.updateDataForGroup(group);
      })
      .catch(console.error)

  }

  static childContextTypes = {
    editorState: PropTypes.object,
    handleUpdateState: PropTypes.func,
    captions: PropTypes.array,
    images: PropTypes.array,
    imagesMap: PropTypes.object,
    labels: PropTypes.array,
    rawContent: PropTypes.object,
    tweets: PropTypes.array,
    renderCss: PropTypes.string,
    autoUpdateEnabled: PropTypes.bool,
    setAutoUpdateEnabled: PropTypes.func,
    updateCluster: PropTypes.func,
    cluster: PropTypes.string,
    group: PropTypes.string,
    updateDataForGroup: PropTypes.func,
    dataLoaded: PropTypes.bool,
    projectMetadata: PropTypes.object,
    setProjectMetadata: PropTypes.func,
    settingsOpen : PropTypes.bool,
    toggleSettings: PropTypes.func,
    settings: PropTypes.object,
    updateSettings: PropTypes.func,
  }

  getChildContext = () => ({
    editorState: this.state.editorState,
    handleUpdateState: this.handleUpdateState,
    rawContent: this.state.rawContent,
    tweets: this.state.tweets,
    captions: this.state.captions,
    images: this.state.images,
    imagesMap: this.state.imagesMap,
    labels: this.state.labels,
    updateCluster: this.updateCluster,
    cluster: this.state.cluster,
    renderCss: this.state.renderCss,
    autoUpdateEnabled: this.state.autoUpdateEnabled,
    setAutoUpdateEnabled: this.setAutoUpdateEnabled,
    group: this.state.group,
    updateDataForGroup: this.updateDataForGroup,
    dataLoaded: this.state.captionsLoaded 
    && this.state.imagesLoaded
    && this.state.labelsLoaded
    && this.state.tweetsLoaded,
    projectMetadata: this.state.projectMetadata,
    setProjectMetadata: this.setProjectMetadata,
    toggleSettings: this.toggleSettings,
    settingsOpen: this.state.settingsOpen,
    settings: this.state.settings,
    updateSettings: this.updateSettings,
  })

  setProjectMetadata = projectMetadata => {
    this.setState({projectMetadata});
    localStorage.setItem('rebus/metadata', JSON.stringify(projectMetadata));
  }

  updateCluster = cluster => {
    this.setState({cluster});
  }

  updateSettings = settings => {
    localStorage.setItem('rebus/settings', JSON.stringify(settings));
    this.setState({settings});
  }

  toggleSettings = () => {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })
  }

  updateDataForGroup = group => {
    this.setState({
      group,
      captionsLoaded: false,
      tweetsLoaded: false,
      imagesLoaded: false,
      labelsLoaded: false,
    })

    getTweets(group)
      .then(tweets => {
        this.setState({
          tweets,
          tweetsLoaded: true,
        })
      })
      .catch(console.error);

    getImages(group)
      .then(images => {
        const imagesMap = images.reduce((res, image) => ({
          ...res,
          [image.id]: image
        }), {})
        this.setState({
          images,
          imagesLoaded: true,
          imagesMap,
        })
      })
      .catch(console.error);

    getLabels(group)
      .then(labels => {
        this.setState({
          labels,
          labelsLoaded: true,
        })
      })
      .catch(console.error);
      
    getCaptions(group)
      .then(captions => {
          this.setState({
            captions,
            captionsLoaded: true,
          });
      }) 
      .catch(console.error)
  }

  setAutoUpdateEnabled = value => {
    this.setState({
      autoUpdateEnabled: value
    })
  }

  updateRawContent = editorState => {
    const rawContent = convertToRaw(
      editorState.getCurrentContent()
    );
    const rawStr = rawContent.blocks.map(b => b.text).join('\n');
    localStorage.setItem('rebus/text', rawStr);
    this.setState({rawContent});
    setTimeout(this.setState({rawContent}));
  }

  handleUpdateState = editorState => {
    this.setState({editorState});
    this.updateRawContent(editorState);
  }
  render() {
    return (
        <div>
          <Route path="/" exact component={EditorView} />
          <Route path="/render/" exact component={RendererView} />
        </div>
    );
  }
}

export default App;
