import React from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import { Global, css } from '@emotion/core';
import { Uuid, Html } from '@friends-library/types';
import { embeddablePdfHtml } from '@friends-library/asciidoc';
import { State as AppState } from '../../type';
import chapterJob from '../../lib/chapter-job';
import Centered from '../Centered';
import throbber from '../../assets/throbber.gif';

const Rendered = styled.div`
  background: #eaeaea;
  color: black;
  min-height: 100vh;

  .page {
    background: white;
    max-width: 650px;
    padding: 0 75px 75px 75px;
    margin: auto;
    min-height: 100vh;
  }
`;

const globalStyles = css`
  html {
    font-size: 12.5pt !important;
    background: #eaeaea;
    counter-reset: footnotes;
  }

  h2 {
    margin-top: 0 !important;
    padding-top: 1.125in !important;
  }

  .footnote {
    counter-increment: footnotes;
    font-size: 0 !important;
    width: 0;
  }

  span.footnote::before {
    content: counter(footnotes);
    font-size: 0.85rem;
    display: inline-block;
    transform: translateY(-7px);
  }
`;

type OwnProps = {
  taskId: Uuid;
  file: string;
};

type Props = OwnProps & {
  html: Html;
};

type State = {
  cssLoaded: boolean;
};

class Component extends React.Component<Props, State> {
  state: State = { cssLoaded: false };

  componentDidMount() {
    const link = document.createElement('link');
    link.onload = () => {
      this.setState({ cssLoaded: true });
      const restoreScroll = sessionStorage.getItem(this.scrollKey());
      if (restoreScroll) {
        window.scrollTo(0, Number(restoreScroll));
      }
    };
    link.setAttribute('rel', 'stylesheet');
    link.type = 'text/css';
    link.href = 'https://flp-styleguide.netlify.com/pdf.css';
    document.head.appendChild(link);
    window.addEventListener('scroll', this.watchScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.watchScroll);
  }

  scrollKey() {
    const { taskId, file } = this.props;
    return `scroll:${taskId}--${file}`;
  }

  watchScroll = debounce(() => {
    sessionStorage.setItem(this.scrollKey(), String(window.scrollY));
  }, 200);

  render() {
    const { props, state } = this;
    return (
      <Rendered className="body">
        <Global styles={globalStyles} />
        <div className="page">
          {state.cssLoaded ? (
            <div className="inner" dangerouslySetInnerHTML={{ __html: props.html }} />
          ) : (
            <Centered>
              <h1 style={{ height: '100vh', opacity: 0.8, lineHeight: '100vh' }}>
                <img src={throbber} style={{ height: 45 }} />
              </h1>
            </Centered>
          )}
        </div>
      </Rendered>
    );
  }
}

const mapState = (state: AppState, { taskId, file }: OwnProps): Props => {
  const job = chapterJob(state, taskId, file);
  const html = embeddablePdfHtml(job);
  return {
    taskId,
    file,
    html,
  };
};

export default connect(mapState)(Component);
