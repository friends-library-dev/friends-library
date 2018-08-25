// @flow
import * as React from 'react';
import {css} from 'glamor';
import url from '../lib/url';
import {classes} from '../lib/css';
import EditionClass from '../classes/Edition';
import * as descriptions from './descriptions';
import {h2, h3} from './Typography';

const description = css`
  font-size: 0.95em;
  line-height: 1.4em;
  color: #888;
`;

const title = css`
  :first-letter {
    text-transform: capitalize;
  }
`;

type Props = {
  edition: EditionClass,
};

const Edition = ({ edition }: Props) => {
  const description = edition.description || descriptions[edition.type];
  return (
    <section>
      <h1 className={classes(title, h2)}>
        {edition.type} edition:
      </h1>
      <p
        className={description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <h2 className={h3}>Formats:</h2>
      <ul>
        {edition.formats.map(format => (
          <li key={format.type}>
            <a href={url(format)}>{format.type}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Edition;
