import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CoverProps } from '@friends-library/types';
import { t } from '@friends-library/locale';
import { PathBlock } from '@friends-library/ui';
import { coverPropsFromQueryData } from '../lib/covers';
import { LANG } from '../env';

interface Props {
  HistoryBlurb: React.FC;
  JournalsBlurb: React.FC;
  DevotionalBlurb: React.FC;
  DoctrineBlurb: React.FC;
}

const GettingStartedPaths: React.FC<Props> = ({
  HistoryBlurb,
  DoctrineBlurb,
  DevotionalBlurb,
  JournalsBlurb,
}) => {
  const data = useStaticQuery(graphql`
    query RecommendedBooks {
      en_penn_pcr: document(
        slug: { eq: "primitive-christianity-revived" }
        friendSlug: { eq: "william-penn" }
      ) {
        ...RecommendedBook
      }
      es_penn_pcr: document(
        slug: { eq: "restauracion-del-cristianismo-primitivo" }
        friendSlug: { eq: "william-penn" }
      ) {
        ...RecommendedBook
      }
      en_sewel: document(
        slug: { eq: "history-of-quakers" }
        friendSlug: { eq: "william-sewel" }
      ) {
        ...RecommendedBook
      }
      es_sewel: document(
        slug: { eq: "historia-de-los-cuaqueros" }
        friendSlug: { eq: "william-sewel" }
      ) {
        ...RecommendedBook
      }
      en_gough: document(
        slug: { eq: "history-of-the-quakers-v1" }
        friendSlug: { eq: "john-gough" }
      ) {
        ...RecommendedBook
      }
      en_kelty: document(
        slug: { eq: "lives-of-primitive-quakers" }
        friendSlug: { eq: "mary-ann-kelty" }
      ) {
        ...RecommendedBook
      }
      en_barclay_uttermost: document(
        slug: { eq: "saved-to-the-uttermost" }
        friendSlug: { eq: "robert-barclay" }
      ) {
        ...RecommendedBook
      }
      en_phipps: document(
        slug: { eq: "original-and-present-state-of-man" }
        friendSlug: { eq: "joseph-phipps" }
      ) {
        ...RecommendedBook
      }
      en_ip_1: document(
        slug: { eq: "writings-volume-1" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        ...RecommendedBook
      }
      en_ip_2: document(
        slug: { eq: "writings-volume-2" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        ...RecommendedBook
      }
      en_barclay_waiting: document(
        slug: { eq: "waiting-upon-the-lord" }
        friendSlug: { eq: "robert-barclay" }
      ) {
        ...RecommendedBook
      }
      en_story_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "thomas-story" }
      ) {
        ...RecommendedBook
      }
      en_spalding_reasons: document(
        slug: { eq: "few-reasons-for-leaving" }
        friendSlug: { eq: "john-spalding" }
      ) {
        ...RecommendedBook
      }
      en_crisp_letters: document(
        slug: { eq: "letters" }
        friendSlug: { eq: "samuel-crisp" }
      ) {
        ...RecommendedBook
      }
      en_turford: document(
        slug: { eq: "walk-in-the-spirit" }
        friendSlug: { eq: "hugh-turford" }
      ) {
        ...RecommendedBook
      }
      en_penn_ncnc: document(
        slug: { eq: "no-cross-no-crown" }
        friendSlug: { eq: "william-penn" }
      ) {
        ...RecommendedBook
      }
      en_crisp_plain_pathway: document(
        slug: { eq: "plain-pathway" }
        friendSlug: { eq: "stephen-crisp" }
      ) {
        ...RecommendedBook
      }
      en_howgill: document(
        slug: { eq: "mysteries-of-gods-kingdom-declared" }
        friendSlug: { eq: "francis-howgill" }
      ) {
        ...RecommendedBook
      }
      en_shewen: document(
        slug: { eq: "meditations-experiences" }
        friendSlug: { eq: "william-shewen" }
      ) {
        ...RecommendedBook
      }
      en_piety_promoted: document(
        slug: { eq: "piety-promoted-v1" }
        friendSlug: { eq: "compilations" }
      ) {
        ...RecommendedBook
      }
      en_titip: document(
        slug: { eq: "truth-in-the-inward-parts-v1" }
        friendSlug: { eq: "compilations" }
      ) {
        ...RecommendedBook
      }
      en_richardson_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "john-richardson" }
      ) {
        ...RecommendedBook
      }
      en_pearson_life: document(
        slug: { eq: "life" }
        friendSlug: { eq: "jane-pearson" }
      ) {
        ...RecommendedBook
      }
      en_gratton_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "john-gratton" }
      ) {
        ...RecommendedBook
      }
      en_conran_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "john-conran" }
      ) {
        ...RecommendedBook
      }
      en_parnell_life: document(
        slug: { eq: "life" }
        friendSlug: { eq: "james-parnell" }
      ) {
        ...RecommendedBook
      }
      en_edmundson_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "william-edmundson" }
      ) {
        ...RecommendedBook
      }
      en_martin_journal: document(
        slug: { eq: "journal" }
        friendSlug: { eq: "isaac-martin" }
      ) {
        ...RecommendedBook
      }
      es_barclay_uttermost: document(
        slug: { eq: "esta-grande-salvacion" }
        friendSlug: { eq: "robert-barclay" }
      ) {
        ...RecommendedBook
      }
      es_phipps: document(
        slug: { eq: "estado-original-y-presente-del-hombre" }
        friendSlug: { eq: "joseph-phipps" }
      ) {
        ...RecommendedBook
      }
      es_ip_1: document(
        slug: { eq: "escritos-volumen-1" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        ...RecommendedBook
      }
      es_ip_2: document(
        slug: { eq: "escritos-volumen-2" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        ...RecommendedBook
      }
      es_barclay_waiting: document(
        slug: { eq: "esperando-en-el-senor" }
        friendSlug: { eq: "robert-barclay" }
      ) {
        ...RecommendedBook
      }
      es_penn_ncnc: document(
        slug: { eq: "no-cruz-no-corona" }
        friendSlug: { eq: "william-penn" }
      ) {
        ...RecommendedBook
      }
      es_howgill: document(
        slug: { eq: "algunos-de-los-misterios-del-reino" }
        friendSlug: { eq: "francis-howgill" }
      ) {
        ...RecommendedBook
      }
      es_crisp_plain_pathway: document(
        slug: { eq: "camino-simple" }
        friendSlug: { eq: "stephen-crisp" }
      ) {
        ...RecommendedBook
      }
      es_crisp_babylon_bethel: document(
        slug: { eq: "babilonia-hasta-bet-el" }
        friendSlug: { eq: "stephen-crisp" }
      ) {
        ...RecommendedBook
      }
      es_titip: document(
        slug: { eq: "verdad-en-lo-intimo" }
        friendSlug: { eq: "compilaciones" }
      ) {
        ...RecommendedBook
      }
      es_parnell_life: document(
        slug: { eq: "vida" }
        friendSlug: { eq: "james-parnell" }
      ) {
        ...RecommendedBook
      }
      es_sewel_cheevers: document(
        slug: { eq: "sufrimientos-de-catharine-evans-sarah-cheevers" }
        friendSlug: { eq: "william-sewel" }
      ) {
        ...RecommendedBook
      }
    }
  `);

  return (
    <>
      <PathBlock
        slug="history"
        title={LANG === `en` ? `History of the Quakers` : `Historia de los Cuáqueros`}
        books={prepareBooks([
          data.en_penn_pcr,
          data.en_sewel,
          data.en_kelty,
          data.en_gough,
          // spanish
          data.es_penn_pcr,
          data.es_sewel,
        ])}
        color="maroon"
      >
        <HistoryBlurb />
      </PathBlock>
      <PathBlock
        slug="doctrinal"
        title={LANG === `en` ? `The Quaker Doctrine` : `La Doctrina de los Cuáqueros`}
        books={prepareBooks([
          data.en_barclay_uttermost,
          data.en_phipps,
          data.en_ip_1,
          data.en_ip_2,
          data.en_barclay_waiting,
          data.en_story_journal,
          data.en_spalding_reasons,
          data.en_crisp_letters,
          // spanish
          data.es_barclay_uttermost,
          data.es_phipps,
          data.es_ip_1,
          data.es_ip_2,
          data.es_barclay_waiting,
        ])}
        color="blue"
      >
        <DoctrineBlurb />
      </PathBlock>
      <PathBlock
        slug="spiritual-life"
        title={t`Spiritual Life`}
        books={prepareBooks([
          data.en_turford,
          data.en_ip_1,
          data.en_ip_2,
          data.en_penn_ncnc,
          data.en_crisp_plain_pathway,
          data.en_howgill,
          data.en_shewen,
          data.en_piety_promoted,
          // spanish
          data.es_ip_1,
          data.es_ip_2,
          data.es_penn_ncnc,
          data.es_howgill,
          data.es_crisp_plain_pathway,
          data.es_crisp_babylon_bethel,
        ])}
        color="green"
      >
        <DevotionalBlurb />
      </PathBlock>
      <PathBlock
        slug="journal"
        title={LANG === `en` ? `Journals` : `Biográfico`}
        books={prepareBooks([
          data.en_titip,
          data.en_richardson_journal,
          data.en_pearson_life,
          data.en_gratton_journal,
          data.en_conran_journal,
          data.en_story_journal,
          data.en_parnell_life,
          data.en_edmundson_journal,
          data.en_martin_journal,
          // spanish
          data.es_titip,
          data.es_parnell_life,
          data.es_sewel_cheevers,
        ])}
        color="gold"
      >
        <JournalsBlurb />
      </PathBlock>
    </>
  );
};

export default GettingStartedPaths;

function prepareBooks(
  data: any[],
): (CoverProps & {
  documentUrl: string;
  authorUrl: string;
  htmlShortTitle: string;
  hasAudio: boolean;
})[] {
  return data.filter(Boolean).map((doc: any) => ({
    ...coverPropsFromQueryData(doc),
    size: `s` as const,
    hasAudio: doc.hasAudio === true,
    documentUrl: doc.url,
    authorUrl: doc.authorUrl,
    htmlShortTitle: doc.htmlShortTitle,
  }));
}
