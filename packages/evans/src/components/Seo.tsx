import React from 'react';
import { Helmet } from 'react-helmet';
import { t } from '@friends-library/ui';

interface Props {
  title: string;
}

const Seo: React.FC<Props> = ({ title }) => (
  <Helmet>
    <title>
      {title} | {t`Friends Library`}
    </title>
  </Helmet>
);

export default Seo;
