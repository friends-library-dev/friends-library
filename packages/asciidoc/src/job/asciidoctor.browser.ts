// @ts-ignore
if (typeof window.Asciidoctor !== 'function') {
  throw new Error('Asciidoctor.js must be loaded via a script tag');
}
// @ts-ignore
const asciidoctor = new window.Asciidoctor() as any;
export default asciidoctor;
