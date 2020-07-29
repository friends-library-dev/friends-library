import '../ui/src/Tailwind.css';

export function onClientEntry() {
  // polyfill document.querySelectorAll().forEach support
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
}
