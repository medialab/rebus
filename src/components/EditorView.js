import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import {Editor} from 'draft-js';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import RendererView from './RendererView';
import SettingsManager from './SettingsManager';
import Modal from 'react-modal';

Modal.setAppElement(document.body);

const EditorView = (noProps, {
  handleUpdateState,
  editorState,
  autoUpdateEnabled,
  setAutoUpdateEnabled,
  cluster,
  updateDataForGroup,
  dataLoaded,
  projectMetadata,
  tweets = [],
  setProjectMetadata,
  updateCluster,
  toggleSettings,
  settingsOpen
}) => {
  const handleClickPrint = () => {
    window.frames.preview.focus();
    window.frames.preview.print();
  }
  const toggleAutoUpdate = () => {
    setAutoUpdateEnabled(!autoUpdateEnabled)
  }
  const clusters = [
    'all clusters',
    ...uniq(tweets.map(t => t.cluster)).sort()
  ]
  const {
    title,
    subtitle,
    authors,
    description,
  } = projectMetadata;
  const handleMetadataChange = (e, key) => {
    const value = e.target.value;
    setProjectMetadata({
      ...projectMetadata,
      [key]: value
    })
  }
  return (
    <div className="editor-container">
      <div className="editor-column editing-column">
        <div className="text-editor-container">

          <Editor
            editorState={editorState}
            onChange={handleUpdateState}
            placeholder={'Écrivez votre rébus ici en convoquant des #tweets, des ~légendes, ou des $labels'}
          />
          <div className="metadata-edition">
            <div className="control">
              <label>
                Project title
              </label>
              <input
                className="input"
                placeholder="project title"
                value={title}
                onChange={e => handleMetadataChange(e, 'title')}
              />
            </div>
            <div className="control">
              <label>
                Project subtitle
              </label>
              <input
                className="input"
                placeholder="project subtitle"
                value={subtitle}
                onChange={e => handleMetadataChange(e, 'subtitle')}
              />
            </div>
            <div className="control">
              <label>
                Project authors
              </label>
              <input
                className="input"
                placeholder="project authors"
                value={authors}
                onChange={e => handleMetadataChange(e, 'authors')}
              />
            </div>

          </div>

          <div className="textarea-container">
            <label>
              Project description
            </label>
            <textarea
              className="textarea"
              placeholder="project description"
              value={description} 
              onChange={e => handleMetadataChange(e, 'description')}
            />
          </div>
            
        </div>
        <h1 className="baseline"><a href="https://medialab.sciences-po.fr" target="blank" rel="noopener">médialab Sciences Po</a> | <i>rébus</i></h1>
      </div>
      <div className="editor-column preview-column">
        <Frame 
          name="preview" 
          id="preview"
          head={
            <link rel="stylesheet" src={`${process.env.PUBLIC_URL}/fonts.css`} />
          }
        >
        <FrameContextConsumer>
        {( { document, window } ) => (
          <RendererView window={window} document={document} />
        )}
      </FrameContextConsumer>
        </Frame>
        <div className="footer-buttons">
          <button onClick={toggleAutoUpdate}>
            {autoUpdateEnabled ? 'disable auto-update': 'enable auto-update'}
          </button>
          <button onClick={toggleSettings}>
            settings
          </button>
          <div>
            {
              clusters.map((thatCluster, index) => {
                const handleClick = () => {
                  updateCluster(thatCluster);
                }
                return (
                  <a onClick={handleClick} className={`corpus-link-btn ${thatCluster === cluster ? 'is-active': ''}`} key={index} href={`#/?cluster=${encodeURIComponent(thatCluster)}`}>
                    {thatCluster}
                  </a>
                );
              })
            }
            {
              !dataLoaded && <i>loading corpus</i>
            }
          </div>
          {/*<Link to="render">go to rendering view</Link>*/}
          <button onClick={handleClickPrint}>
            print
          </button>
        </div>
      </div>

      <Modal
        isOpen={settingsOpen}
        onRequestClose={toggleSettings}
        contentLabel="Settings"
        style={{
          content: {
            maxWidth: '40%'
          }
        }}
      >
        <SettingsManager />
      </Modal>
    </div>
  )
}

EditorView.contextTypes = {
  handleUpdateState: PropTypes.func,
  editorState: PropTypes.object,
  autoUpdateEnabled: PropTypes.bool,
  setAutoUpdateEnabled: PropTypes.func,
  cluster: PropTypes.string,
  updateDataForGroup: PropTypes.func,
  dataLoaded: PropTypes.bool,
  projectMetadata: PropTypes.object,
  setProjectMetadata: PropTypes.func,
  tweets: PropTypes.array,
  updateCluster: PropTypes.func,
  toggleSettings: PropTypes.func,
  settingsOpen: PropTypes.bool,
}
export default EditorView;