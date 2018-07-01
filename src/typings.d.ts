/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.html' {
  const content: string;
  export default content;
}

declare type TLang = 'nl' | 'en' | 'fr' | 'de';
