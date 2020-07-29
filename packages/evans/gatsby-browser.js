import '../ui/src/Tailwind.css';

export function onClientEntry() {
  // polyfill document.querySelectorAll().forEach support
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // catch uncaught errors
  if (process.env.NODE_ENV !== `development`) {
    window.onerror = (event, source, lineno, colno, err) => {
      window.fetch(`/.netlify/functions/site/log-error`, {
        method: `POST`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          error: err,
          event: event,
          source: source,
          lineno: lineno,
          colno: colno,
          location: `window.onerror`,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    };
  }
}
