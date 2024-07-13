export interface CountryModalProps {
    country: {
      name: {
        common: string;
        official?: string;
        nativeName: {
          language: string;
          official: string;
          common: string;
        }[];
      };
      flag?: string;
      population: number;
      region: string;
      capital?: string[];
      currencies?: {
        code?: string;
        name: string;
        symbol: string;
      }[];
      borders?: string[];
      flags: {
        png?: string;
        svg?: string;
        alt?: string;
      };
      languages: {
        key: string;
        value: string;
      }[];
    } | null;
    onClose: () => void;
  }