export interface NativeName {
    language: string;
    official: string;
    common: string;
  }
  
  export  interface Currency {
    code: string;
    name: string;
    symbol: string;
  }
  
  export interface Flag {
    png: string;
    svg: string;
    alt: string;
  }
  
  export interface Language {
    key: string;
    value: string;
  }
  
  export interface Country {
    name: {
      common: string;
      official: string;
      nativeName: NativeName[];
    };
    flag: string;
    population: number;
    region: string;
    capital?: string[];
    currencies: Currency[];
    borders?: string[];
    flags: Flag;
    languages: Language[];
  }

  export interface SearchOption{
    value: string; 
    label: string; 
  }
  