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
  const EN = lang === 'en';
  const ES = lang === 'es';
  return [
    EN ? 'Free complete ebook' : 'Obtén de forma gratuita el libro electrónico completo',
    EN && hasAudio ? 'and audiobook' : false,
    ES && hasAudio ? 'y el audiolibro' : false,
    EN && !comp ? `of ${title} by ${name}, an early member` : false,
    ES && !comp ? `de ${title} escrito por ${name},` : false,
    EN && comp ? `of ${title}, a compilation written by early members` : false,
    ES && comp
      ? `de ${title}, una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros).`
      : false,
    EN ? 'of the Religious Society of Friends (Quakers).' : false,
    ES && !comp ? 'un antiguo miembro de la Sociedad de Amigos (Cuáqueros).' : false,
    EN ? 'Download as MOBI, EPUB, PDF,' : 'Descárgalo en formato MOBI, EPUB, PDF,',
    EN && hasAudio ? 'listen to a Podcast, MP3s, M4B,' : false,
    ES && hasAudio ? 'escúchalo en Podcast, MP3, M4B,' : false,
    EN ? 'or order a low-cost paperback.' : 'o pide un libro impreso.',
    description,
  ]
    .filter(Boolean)
    .join(' ');
}

export function friendPageMetaDesc(
  name: string,
  description: string,
  titles: string[],
  numAudioBooks: number,
  isCompilationsQuasiFriend: boolean,
  lang: Lang,
): string {
  const comp = isCompilationsQuasiFriend;
  const EN = lang === 'en';
  const ES = lang === 'es';
  const plural = titles.length > 1;
  const s = plural ? 's' : '';
  const lastTitle = titles[titles.length - 1];
  return [
    EN ? `Free ebook${s}` : `Libro${s} electrónico${s}`,
    EN && numAudioBooks ? `and audiobook${numAudioBooks > 1 ? 's' : ''}` : false,
    ES && numAudioBooks ? `y audiolibro${numAudioBooks > 1 ? 's' : ''}` : false,
    EN && !comp ? `by early Quaker writer ${name}:` : false,
    ES && !comp ? `gratuito${s}, escrito${s} por ${name},` : false,
    ES && !comp ? 'uno de los antiguos Cuáqueros:' : false,
    EN && comp ? 'of' : false,
    ES && comp ? 'gratuitos de' : false,
    titles.length < 3 ? titles.join(EN ? ' and ' : ' y ') : false,
    titles.length > 2 ? titles.slice(0, 2).join(', ') + ',' : false,
    titles.length > 2 ? `${EN ? 'and' : 'y'} ${lastTitle}` : false,
    !comp ? '<.' : false,
    EN && comp ? `- ${plural ? 'compilations' : 'a compilation'}` : false,
    EN && comp
      ? 'written by early members of the Religious Society of Friends (Quakers).'
      : false,
    ES && comp
      ? `- ${plural ? 'compilaciones escritas' : 'una compilación escrita'}`
      : false,
    ES && comp
      ? 'por los primeros miembros de la Sociedad de Amigos (Cuáqueros).'
      : false,
    EN ? 'Download as MOBI, EPUB, PDF,' : false,
    ES ? 'Descargar como MOBI, EPUB, PDF,' : false,
    numAudioBooks > 0 && EN ? 'listen to a Podcast, MP3s, M4B,' : false,
    numAudioBooks > 0 && ES ? 'escuchar en Podcast, MP3s, M4B,' : false,
    EN ? 'or order a low-cost paperback.' : 'o pedir un libro impreso.',
    description,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/ <\./g, '.');
}
