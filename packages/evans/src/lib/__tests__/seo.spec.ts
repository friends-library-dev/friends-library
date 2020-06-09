import { Lang } from '@friends-library/types';
import { friendPageMetaDesc, bookPageMetaDesc } from '../seo';

describe(`bookPageMetaDesc()`, () => {
  const cases: [string, string, string, boolean, Lang, boolean, string][] = [
    [
      `Compilations`,
      `About TITIP`,
      `TITIP`,
      true,
      `en`,
      true,
      `Free complete ebook and audiobook of &ldquo;TITIP&rdquo;&mdash;a compilation written by early members of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About TITIP`,
    ],
    [
      `Compilaciones`,
      `About TITIP`,
      `TITIP`,
      true,
      `es`,
      true,
      `Obtén de forma gratuita el libro electrónico completo y el audiolibro de &ldquo;TITIP&rdquo;&mdash;una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descárgalo en formato MOBI, EPUB, PDF, escúchalo en Podcast, MP3, M4B, o pide un libro impreso. About TITIP`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      true,
      `en`,
      false,
      `Free complete ebook and audiobook of &ldquo;Journal&rdquo; by George Fox, an early member of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About George`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      false,
      `en`,
      false,
      `Free complete ebook of &ldquo;Journal&rdquo; by George Fox, an early member of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, or order a low-cost paperback. About George`,
    ],
    [
      `George Fox`,
      `About George`,
      `Journal`,
      true,
      `es`,
      false,
      `Obtén de forma gratuita el libro electrónico completo y el audiolibro de &ldquo;Journal&rdquo; escrito por George Fox, un antiguo miembro de la Sociedad de Amigos (Cuáqueros). Descárgalo en formato MOBI, EPUB, PDF, escúchalo en Podcast, MP3, M4B, o pide un libro impreso. About George`,
    ],
  ];
  test.each(cases)(
    `should produce correct meta description`,
    (author, desc, title, numAudio, lang, isComp, expected) => {
      expect(bookPageMetaDesc(author, desc, title, numAudio, isComp, lang)).toBe(
        expected,
      );
    },
  );
});

describe(`friendPageMetaDesc()`, () => {
  const cases: [string, string, string[], number, boolean, Lang, string][] = [
    [
      `George Fox`,
      `About George.`,
      [`Journal`],
      1,
      false,
      `en`,
      `Free ebook and audiobook by early Quaker writer George Fox: &ldquo;Journal.&rdquo; Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`],
      0,
      false,
      `en`,
      `Free ebook by early Quaker writer George Fox: &ldquo;Journal.&rdquo; Download as MOBI, EPUB, PDF, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`, `Excerpts`],
      0,
      false,
      `en`,
      `Free ebooks by early Quaker writer George Fox: &ldquo;Journal,&rdquo; &ldquo;Epistles,&rdquo; and &ldquo;Excerpts.&rdquo; Download as MOBI, EPUB, PDF, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`],
      2,
      false,
      `en`,
      `Free ebooks and audiobooks by early Quaker writer George Fox: &ldquo;Journal&rdquo; and &ldquo;Epistles.&rdquo; Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About George.`,
    ],
    [
      `George Fox`,
      `About George.`,
      [`Journal`, `Epistles`],
      1,
      false,
      `en`,
      `Free ebooks and audiobook by early Quaker writer George Fox: &ldquo;Journal&rdquo; and &ldquo;Epistles.&rdquo; Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About George.`,
    ],
    [
      `Compilations`,
      `About George.`,
      [`Journal`, `Epistles`],
      1,
      true,
      `en`,
      `Free ebooks and audiobook of &ldquo;Journal&rdquo; and &ldquo;Epistles&rdquo;&mdash;compilations written by early members of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About George.`,
    ],
    [
      `Compilations`,
      `About TITIP.`,
      [`TITIP`],
      1,
      true,
      `en`,
      `Free ebook and audiobook of &ldquo;TITIP&rdquo;&mdash;a compilation written by early members of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About TITIP.`,
    ],
    [
      `Compilations`,
      `About TITIP.`,
      [`TITIP`, `PP v1`],
      1,
      true,
      `en`,
      `Free ebooks and audiobook of &ldquo;TITIP&rdquo; and &ldquo;PP v1&rdquo;&mdash;compilations written by early members of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. About TITIP.`,
    ],
    [
      `George Fox`,
      `Hola George.`,
      [`Journal`, `Epistles`],
      1,
      false,
      `es`,
      `Libros electrónicos y audiolibro gratuitos, escritos por George Fox, uno de los antiguos Cuáqueros: &ldquo;Journal&rdquo; y &ldquo;Epistles.&rdquo; Descargar como MOBI, EPUB, PDF, escuchar en Podcast, MP3s, M4B, o pedir un libro impreso. Hola George.`,
    ],
    [
      `Compilaciones`,
      `Hola Compilaciones.`,
      [`La Verdad en lo Íntimo`, `El Pietoto Promotedo`],
      1,
      true,
      `es`,
      `Libros electrónicos y audiolibro gratuitos de &ldquo;La Verdad en lo Íntimo&rdquo; y &ldquo;El Pietoto Promotedo&rdquo;&mdash;compilaciones escritas por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar como MOBI, EPUB, PDF, escuchar en Podcast, MP3s, M4B, o pedir un libro impreso. Hola Compilaciones.`,
    ],
    [
      `Compilaciones`,
      `Hola Compilaciones.`,
      [`La Verdad en lo Íntimo`],
      1,
      true,
      `es`,
      `Libro electrónico y audiolibro gratuitos de &ldquo;La Verdad en lo Íntimo&rdquo;&mdash;una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros). Descargar como MOBI, EPUB, PDF, escuchar en Podcast, MP3s, M4B, o pedir un libro impreso. Hola Compilaciones.`,
    ],
  ];

  test.each(cases)(
    `should produce correct meta description`,
    (author, desc, titles, numAudio, isComp, lang, expected) => {
      expect(friendPageMetaDesc(author, desc, titles, numAudio, isComp, lang)).toBe(
        expected,
      );
    },
  );
});
