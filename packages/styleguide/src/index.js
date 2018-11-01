import * as React from 'react';
import ReactDOM from 'react-dom';
import Styleguide from './components/Styleguide';

ReactDOM.render(<Styleguide />, document.getElementById('root'));

// lol should SSR this instead ¯\_(ツ)_/¯
if (window.location.hash) {
  const id = window.location.hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => el.scrollIntoView(), 750);
  }
}
