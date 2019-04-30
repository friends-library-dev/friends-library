import React, { useState } from 'react';
import { PrintSizeAbbrev } from '@friends-library/types';
import Cover from './Cover/Cover';
import { coverCss } from './Cover/css';
import './App.css';

function makePdf(props: any): void {
  fetch(`http://localhost:9988`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });
}

const App: React.FC = () => {
  const [printSize, setPrintSize] = useState<PrintSizeAbbrev>('s');
  const [title] = useState<string>('The Life and Letters of Rebecca Jones');
  const [author] = useState<string>('Rebecca Jones');
  const coverProps = { title, author, printSize, pages: 598 };
  return (
    <div className={`App web trim--${printSize}`}>
      <select
        value={printSize}
        onChange={e => setPrintSize(e.target.value as PrintSizeAbbrev)}
      >
        <option value="s">Pocket Book</option>
        <option value="m">Standard</option>
        <option value="l">Digest</option>
        <option value="xl">6x9</option>
        <option value="xxl">Extra Large</option>
      </select>
      <p>
        The print size is <code>{printSize}</code>
      </p>
      <Cover {...coverProps} />
      <style>{coverCss(coverProps, 'web')}</style>
      <button onClick={() => makePdf(coverProps)}>MAKE PDF!</button>
    </div>
  );
};

export default App;
