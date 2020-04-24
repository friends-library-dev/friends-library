import React from 'react';
import { Helmet } from 'react-helmet';
import { t } from '@friends-library/locale';
import { LANG } from '../env';

interface Props {
  title: string;
  description: string | [string, string];
}

const Seo: React.FC<Props> = ({ title, description }) => (
  <Helmet>
    <title>
      {title} | {t`Friends Library`}
    </title>
    <meta
      name="description"
      content={
        Array.isArray(description) ? description[LANG === 'en' ? 0 : 1] : description
      }
    />
  </Helmet>
);

export default Seo;
