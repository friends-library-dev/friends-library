import React from 'react';
import { t } from 'ttag';
import { Link } from 'gatsby';
import { styled } from '@friends-library/ui';
import { Title, Name, Url } from '@friends-library/types';
import responsiveDocumentTitle from '../lib/responsive';

const DocumentTeaser = styled.div`
  color: #222;
  display: block;
  background-color: #ededed;
  text-decoration: none;
  margin-bottom: 1.5em;
  position: relative;
  max-width: 600px;

  :before {
    font-family: FontAwesome;
    content: '\\f02d';
    color: #ccc;
    position: absolute;
    font-size: 1.25em;
    top: 9.5px;
    left: 14.5px;
  }
`;

const Heading = styled.h3`
  font-weight: 300;
  margin: 0;
  padding: 0.65em;
  padding-left: 2.4em;
  line-height: 1.35em;
  background: #444;
  color: #fff;
`;

const StyledLink = styled(Link)`
  padding: 0.75em;
  background-color: ${p => p.theme.primary.hex};
  display: block;
  text-align: center;
  text-decoration: none;
  && {
    color: #fff;
  }
`;

const MetaUl = styled.ul`
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

interface Props {
  title: Title;
  friendName: Name;
  hasAudio: boolean;
  hasUpdatedEdition: boolean;
  tags: string[];
  url: Url;
}

export default ({ title, friendName, hasAudio, hasUpdatedEdition, tags, url }: Props) => {
  return (
    <DocumentTeaser>
      <Heading
        dangerouslySetInnerHTML={{
          __html: responsiveDocumentTitle(title, friendName),
        }}
      />
      <MetaUl>
        {hasAudio && (
          <li>
            <i className="fa fa-headphones" />
            {t`Audio Available`}
          </li>
        )}
        {hasUpdatedEdition && (
          <li>
            <i className="fa fa-rocket" />
            {t`Updated Available`}
          </li>
        )}
        <li>
          <i className="fa fa-clock-o" />
          999 {t`Pages`}
        </li>
        <li>
          <i className="fa fa-tags" />
          {tags.join(', ')}
        </li>
      </MetaUl>
      <StyledLink to={url}>{t`View Document`} &rarr;</StyledLink>
    </DocumentTeaser>
  );
};
