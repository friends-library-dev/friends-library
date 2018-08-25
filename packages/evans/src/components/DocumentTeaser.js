// @flow
import * as React from 'react';
import { css } from 'glamor';
import url from '../lib/url';
import responsiveDocumentTitle from '../lib/responsive';
import Document from '../classes/Document';

const element = css`
  color: #222;
  display: block;
  background-color: #ededed;
  text-decoration: none;
  margin-bottom: 1.5em;
  position: relative;
  max-width: 600px;

  :before {
    font-family: FontAwesome;
    content: "\\f02d";
    color: #ccc;
    position: absolute;
    font-size: 1.25em;
    top: 9.5px;
    left: 14.5px;
  }
`;

const title = css`
  font-weight: 300;
  margin: 0;
  padding: 0.65em;
  padding-left: 2.4em;
  line-height: 1.35em;
  background: #444;
  color: #fff;
`;

const link = css`
  padding: 0.75em;
  background-color: #1e87f0;
  color: #fff;
  display: block;
  text-align: center;
  text-decoration: none;
`;

const meta = css`
  list-style: none;
  margin: 0;
  padding: 1em 2em;
  border-right: 1px solid #999;
  border-left: 1px solid #999;

  & .fa {
    color: #666;
    padding-right: 0.4em;
  }
`;

type Props = {
  document: Document,
};

const DocumentTeaser = (props: Props) => {
  const { document } = props;
  return (
    <div className={element}>
      <h3
        className={title}
        dangerouslySetInnerHTML={{ __html: responsiveDocumentTitle(document) }}
      />
      <ul className={meta}>
        {document.hasAudio() &&
          <li>
            <i className="fa fa-headphones" />
              Audio Available
          </li>
        }
        {document.hasModernizedEdition() &&
          <li>
            <i className="fa fa-rocket" />
              Modern Available
          </li>
        }
        <li>
          <i className="fa fa-clock-o" />
          {document.shortestEdition().pages} Pages
        </li>
        <li>
          <i className="fa fa-tags" />
          {document.tags.join(', ')}
        </li>
      </ul>
      <a className={link} href={url(document)}>
        View Document &rarr;
      </a>
    </div>
  );
};

export default DocumentTeaser;
