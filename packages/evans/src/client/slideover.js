// @flow
const hamburger = document.querySelector('#Hamburger');
const content = document.querySelector('#App__Content');
const html = document.documentElement;

if (content && html) {
  content.addEventListener('transitionend', () => {
    html.classList.remove('App--slideover-transitioning')
  });
}

if (hamburger && html) {
  hamburger.addEventListener('click', () => {
    html.classList.toggle('App--slideover-open');
    html.classList.add('App--slideover-transitioning');
  });
}
