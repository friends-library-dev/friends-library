import React from 'react';
import { storiesOf } from '@storybook/react';
import Audio from '../src/icons/Audio';
import Calendar from '../src/icons/Calendar';
import Clock from '../src/icons/Clock';
import Download from '../src/icons/Download';
import Ebook from '../src/icons/Ebook';
import Epub from '../src/icons/Epub';
import Flag from '../src/icons/Flag';
import Mobi from '../src/icons/Mobi';
import Pdf from '../src/icons/Pdf';
import PlayTriangle from '../src/icons/PlayTriangle';
import Rotate from '../src/icons/Rotate';
import Search from '../src/icons/Search';
import Tags from '../src/icons/Tags';
import ThinLogo from '../src/icons/ThinLogo';
import Book from '../src/icons/Book';
import Headphones from '../src/icons/Headphones';
import Bookmark from '../src/icons/Bookmark';
import Globe from '../src/icons/Globe';
import Star from '../src/icons/Star';

storiesOf(`Icons`, module).add(`Icons`, () => (
  <div className="flex flex-xcol flex-wrap items-start">
    <Bg title="Star">
      <Star tailwindColor="white" />
    </Bg>
    <Bg title="Globe">
      <Globe tailwindColor="white" />
    </Bg>
    <Bg title="Bookmark">
      <Bookmark tailwindColor="white" />
    </Bg>
    <Bg title="Headphones">
      <Headphones tailwindColor="white" />
    </Bg>
    <Bg title="Book">
      <Book tailwindColor="white" />
    </Bg>
    <Bg title="Audio">
      <Audio tailwindColor="white" />
    </Bg>
    <Bg title="Calendar">
      <Calendar />
    </Bg>
    <Bg title="Clock">
      <Clock tailwindColor="white" />
    </Bg>
    <Bg title="Download">
      <Download tailwindColor="white" />
    </Bg>
    <Bg title="Ebook" size={20}>
      <Ebook tailwindColor="white" />
    </Bg>
    <Bg title="Epub" size={20}>
      <Epub tailwindColor="white" />
    </Bg>
    <Bg title="Flag">
      <Flag />
    </Bg>
    <Bg title="Mobi" size={20}>
      <Mobi tailwindColor="white" />
    </Bg>
    <Bg title="Pdf" size={20}>
      <Pdf tailwindColor="white" />
    </Bg>
    <Bg title="PlayTriangle" size={40}>
      <PlayTriangle tailwindColor="white" />
    </Bg>
    <Bg title="Rotate" size={16}>
      <Rotate tailwindColor="white" />
    </Bg>
    <Bg title="Search">
      <Search tailwindColor="white" />
    </Bg>
    <Bg title="Tags">
      <Tags tailwindColor="white" />
    </Bg>
    <Bg title="ThinLogo">
      <ThinLogo />
    </Bg>
  </div>
));

const Bg: React.FC<{ size?: number; title?: string }> = ({
  children,
  title,
  size = 10,
}) => (
  <div className="m-10 flex flex-col items-center justify-start">
    <h1 className="text-monospace text-red-700 text-center mb-4">&lt;{title} /&gt;</h1>
    <div
      className={`bg-flprimary w-${size} h-${size} flex items-center justify-center rounded-full text-white`}
    >
      {children}
    </div>
  </div>
);
