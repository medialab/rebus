import React, {Component} from 'react';
import PropTypes from 'prop-types';
import redraft from 'redraft';
import {
  hashtagStrategy, 
  tildeStrategy,
  dollarStrategy
} from '../helpers/draftStrategies';
import TweetsTake from './TweetsTake';
import CaptionsTake from './CaptionsTake';
import LabelsTake from './LabelsTake';

/**
 *  You can use inline styles or classNames inside your callbacks
 */
const styles = {
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 20,
  },
};
 
// just a helper to add a <br /> after a block
const addBreaklines = (children) => children.map((child, i) => [child, <br key={i + 1} />]);
 
/**
 * Define the renderers
 */
const renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => <span key={key} style={styles.code}>{children}</span>,
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children) => children.map((child, index) => <div className="unstyled" key={index}>{child}</div>),
    blockquote: (children, index) => <blockquote key={index} >{addBreaklines(children)}</blockquote>,
    'header-one': (children, index) => children.map(child => <h1 key={index}>{child}</h1>),
    'header-two': (children, index) => children.map(child => <h2 key={index}>{child}</h2>),
    // You can also access the original keys of the blocks
    'code-block': (children, { keys }) => <pre style={styles.codeBlock} key={keys[0]}>{addBreaklines(children)}</pre>,
    // or depth for nested lists
    'unordered-list-item': (children, { depth, keys }) => <ul key={keys[keys.length - 1]} className={`ul-level-${depth}`}>{children.map(child => <li>{child}</li>)}</ul>,
    'ordered-list-item': (children, { depth, keys }) => <ol key={keys.join('|')} className={`ol-level-${depth}`}>{children.map((child, index) => <li key={keys[index]}>{child}</li>)}</ol>,
    // If your blocks use meta data it can also be accessed like keys
    // atomic: (children, { keys, data }) => children.map((child, i) => <Atomic key={keys[i]} {...data[i]} />),
  },
  /**
   * Entities receive children and the entity data
   */
  // entities: {
  //   // key is the entity key value from raw
  //   LINK: (children, data, { key }) => <Link key={key} to={data.url}>{children}</Link>,
  // },
  decorators: [
    {
      strategy: hashtagStrategy,
      component: ({ children, key }) => {
        return <TweetsTake key={key}>{children}</TweetsTake>
      },
    },
    {
      strategy: tildeStrategy,
      component: ({ children, key }) => <CaptionsTake key={key}>{children}</CaptionsTake>,
    },
    {
      strategy: dollarStrategy,
      component: ({ children, key }) => <LabelsTake key={key}>{children}</LabelsTake>,
    },
  ],
}

class RendererView extends Component {
  shouldComponentUpdate = (props, state, context) => {
    return context.autoUpdateEnabled;
  }
  
  render = () => {
    const {
      context: {
        rawContent,
        renderCss = '',
        projectMetadata = {},
        settings = {},
      }
    } = this;

    const {
      title,
      subtitle,
      authors,
      description
    } = projectMetadata;

    const {
      lineHeight = '2'
    } = settings;
    const rendered = redraft(rawContent, renderers);
    
    return (
      <div className="renderer-view">
        <div className="poster-container">
          <div 
            className={`poster-contents`}
            style={{
              lineHeight: +lineHeight + 'em'
            }}
          >
          {rendered}
          </div>
          <div className="poster-footer-container">
            <footer className="poster-footer">
              <div className="main-footer-contents">
                <h1 className="project-title">{title}</h1>
                <h2 className="project-subtitle">{subtitle}</h2>
                <h2 className="project-authors">{authors}</h2>
                <div className="project-presentation">
                  {description}
                </div>
              </div>
              <div className="footer-meta">
                <h1 className="project-workshop-title">
                  Especes de milieux | 2019
                </h1>
                <h3 className="project-animators">
                  Donato Ricci
                  <br/>
                  Robin de Mourat
                </h3>
                <img 
                  className="logo"
                  alt="logo"
                  src={process.env.PUBLIC_URL + '/logo-ensci.svg'}
                />
              </div>
            </footer>
          </div>
        </div>
        <style>{renderCss}</style>
      </div>
    )
  }
    
}

RendererView.contextTypes = {
  rawContent: PropTypes.object,
  renderCss: PropTypes.string,
  autoUpdateEnabled: PropTypes.bool,
  projectMetadata: PropTypes.object,
  settings: PropTypes.object,
}
export default RendererView;