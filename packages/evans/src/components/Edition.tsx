import React from 'react';
import { EditionType } from '@friends-library/types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import { t } from 'ttag';
import * as descriptions from '../descriptions';
import { h2, h3 } from '../typography';

const desc = css`
  font-size: 0.95em;
  line-height: 1.4em;
  color: #888;
`;

const EditionHeading = styled.h1`
  compose: ${h2};
  :first-letter {
    text-transform: capitalize;
  }
`;

interface Props {
  edition: {
    description?: string;
    type: EditionType;
    formats: {
      type: string;
      url: string;
    }[];
  };
}

const Edition: React.SFC<Props> = ({ edition }) => {
  const description = edition.description || descriptions[edition.type];
  return (
    <section>
      <EditionHeading>
        {edition.type} {t`edition`}:
      </EditionHeading>
      <p css={desc} dangerouslySetInnerHTML={{ __html: description }} />
      <h2 css={h3}>{t`Formats`}:</h2>
      <ul>
        {edition.formats.map(format => (
          <li key={format.type}>
            <Link to={format.url}>{format.type}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Edition;
