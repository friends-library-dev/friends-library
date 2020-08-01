// @ts-ignore
if (typeof window.Asciidoctor !== `function`) {
  throw new Error(`Asciidoctor.js must be loaded via a script tag`);
}

let instance: any;

export default function (): any {
  if (!instance) {
    // @ts-ignore
    instance = new window.Asciidoctor() as any;
  }
  return instance;
}
