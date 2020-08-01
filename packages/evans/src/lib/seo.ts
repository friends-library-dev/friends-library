import { Lang } from '@friends-library/types';

export function bookPageMetaDesc(
  name: string,
  description: string,
  title: string,
  hasAudio: boolean,
  isCompilation: boolean,
  lang: Lang,
): string {
  const comp = isCompilation;
  const EN = lang === `en`;
  const ES = lang === `es`;
  title = `&ldquo;${title}&rdquo;`;
  return [
    EN ? `Free complete ebook` : `Obtén de forma gratuita el libro electrónico completo`,
    EN && hasAudio ? `and audiobook` : false,
    ES && hasAudio ? `y el audiolibro` : false,
    EN && !comp ? `of ${title} by ${name}, an early member` : false,
    ES && !comp ? `de ${title} escrito por ${name},` : false,
    EN && comp ? `of ${title}&mdash;a compilation written by early members` : false,
    ES && comp
      ? `de ${title}&mdash;una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros).`
      : false,
    EN ? `of the Religious Society of Friends (Quakers).` : false,
    ES && !comp ? `un antiguo miembro de la Sociedad de Amigos (Cuáqueros).` : false,
    EN ? `Download as MOBI, EPUB, PDF,` : `Descárgalo en formato MOBI, EPUB, PDF,`,
    EN && hasAudio ? `listen to a Podcast, MP3s, M4B,` : false,
    ES && hasAudio ? `escúchalo en Podcast, MP3, M4B,` : false,
    EN ? `or order a low-cost paperback.` : `o pide un libro impreso.`,
    description,
  ]
    .filter(Boolean)
    .join(` `);
}

export function friendPageMetaDesc(
  name: string,
  description: string,
  titles: string[],
  numAudioBooks: number,
  isCompilationsQuasiFriend: boolean,
  lang: Lang,
): string {
  const quotedTitles = titles.map((t) => `&ldquo;${t}&rdquo;`);
  const comp = isCompilationsQuasiFriend;
  const EN = lang === `en`;
  const ES = lang === `es`;
  const plural = quotedTitles.length > 1;
  const s = plural ? `s` : ``;
  const lastTitle = quotedTitles[quotedTitles.length - 1];
  return [
    EN ? `Free ebook${s}` : `Libro${s} electrónico${s}`,
    EN && numAudioBooks ? `and audiobook${numAudioBooks > 1 ? `s` : ``}` : false,
    ES && numAudioBooks ? `y audiolibro${numAudioBooks > 1 ? `s` : ``}` : false,
    EN && !comp ? `by early Quaker writer ${name}:` : false,
    ES && !comp ? `gratuito${s}, escrito${s} por ${name},` : false,
    ES && !comp ? `uno de los antiguos Cuáqueros:` : false,
    EN && comp ? `of` : false,
    ES && comp ? `gratuitos de` : false,
    quotedTitles.length < 3 ? quotedTitles.join(EN ? ` and ` : ` y `) : false,
    quotedTitles.length > 2 ? quotedTitles.slice(0, 2).join(`, `) + `,` : false,
    quotedTitles.length > 2 ? `${EN ? `and` : `y`} ${lastTitle}` : false,
    !comp ? `<.` : false,
    EN && comp ? `&mdash;${plural ? `compilations` : `a compilation`}` : false,
    EN && comp
      ? `written by early members of the Religious Society of Friends (Quakers).`
      : false,
    ES && comp
      ? `&mdash;${plural ? `compilaciones escritas` : `una compilación escrita`}`
      : false,
    ES && comp
      ? `por los primeros miembros de la Sociedad de Amigos (Cuáqueros).`
      : false,
    EN ? `Download as MOBI, EPUB, PDF,` : false,
    ES ? `Descargar como MOBI, EPUB, PDF,` : false,
    numAudioBooks > 0 && EN ? `listen to a Podcast, MP3s, M4B,` : false,
    numAudioBooks > 0 && ES ? `escuchar en Podcast, MP3s, M4B,` : false,
    EN ? `or order a low-cost paperback.` : `o pedir un libro impreso.`,
    description,
  ]
    .filter(Boolean)
    .join(` `)
    .replace(/ <\./g, `.`)
    .replace(/&rdquo; &mdash;/g, `&rdquo;&mdash;`)
    .replace(/&rdquo;(\.|,)/g, `$1&rdquo;`);
}

export const PAGE_META_DESCS = {
  audiobooks: {
    en: `Browse %NUM_AUDIOBOOKS% free audiobooks from early members of the Religious Society of Friends (Quakers). Download as a podcast, MP3s, or an M4B file – or listen online in your browser. All books are available in e-Book format as well for free download as EPUB, MOBI, or PDF, and paperback copies are also available at very low cost.`,
    es: `Dale un vistazo a nuestros audiolibros gratuitos de los primeros miembros de la Sociedad Religiosa de Amigos (Cuáqueros). Puedes descargar el audio como un podcast, MP3, o un archivo M4B - o reproducirlo en línea desde tu navegador. También, los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB, MOBI, PDF. Libros impresos también están disponibles por un precio muy económico.`,
  },
  contact: {
    en: `Got a question? — or are you having any sort of technical trouble with our books or website? Want to reach out for any other reason? We’d love to hear from you! You can expect to hear back within a day or two.`,
    es: `¿Tienes alguna pregunta? — ¿o estás teniendo algún tipo de problema técnico con nuestros libros o con el sitio? ¿Quieres ponerte en contacto por alguna otra razón? ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o dos.`,
  },
  explore: {
    en: `Explore %NUM_ENGLISH_BOOKS% books written by early members of the Religious Society of Friends (Quakers) – available for free download as EPUB, MOBI, PDF, and audiobooks. Browse %NUM_UPDATED_EDITIONS% updated editions, %NUM_AUDIOBOOKS% audiobooks, and recently added titles, or view books by geographic region or time period.`,
    es: `Explora nuestros %NUM_SPANISH_BOOKS% libros escritos por los primeros miembros de la Sociedad de Amigos (Cuáqueros), disponibles de forma gratuita en formatos digitales EPUB, MOBI, PDF, y audiolibros. Puedes navegar por todos nuestros libros y audiolibros, o buscar libros en la categoría particular que más te interese.`,
  },
  friends: {
    en: `Friends Library currently contains books written by %NUM_FRIENDS% early members of the Religious Society of Friends (Quakers), and more authors are being added regularly. View all authors here, including William Penn, Isaac Penington, Robert Barclay, and George Fox. All books are available in their entirety for free download as EPUB, MOBI, PDF, and a growing number are available as audiobooks. Paperback copies are also available at very low cost.`,
    es: `Actualmente la Biblioteca de Amigos contiene libros escritos por %NUM_FRIENDS% antiguos Amigos, y constantemente estamos añadiendo nuevos autores. Aquí puedes ver todos nuestros autores, incluyendo William Penn, Isaac Penington, Robert Barclay, y George Fox. Los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB, MOBI, PDF, y algunos han sido grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
  },
  'getting-started': {
    en: `View hand-picked reading recommendations to help you get started with our %NUM_ENGLISH_BOOKS% books written by early members of the Religious Society of Friends (Quakers). Recommendations come in four categories: History, Doctrine, Spiritual Life, and Journals. All books are available in their entirety for free download as EPUB, MOBI, PDF, and a growing number are available as audiobooks. Paperback copies are also available at very low cost.`,
    es: `Hemos seleccionado algunos de nuestros libros favoritos de los antiguos miembros de la Sociedad de Amigos (Cuáqueros), y los hemos organizado en categorías para ayudarte a comenzar. Nuestras recomendaciones están organizadas en cuatro categorías: Historia, Doctrina, Vida Espiritual, y Biografía. Los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB, MOBI, PDF, y algunos han sido grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
  },
};
