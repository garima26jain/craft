import React from "react";

interface CountryModalProps {
  country: {
    name: {
      common: string;
      official: string;
      nativeName: {
        language: string;
        official: string;
        common: string;
      }[];
    };
    flag: string;
    population: number;
    region: string;
    capital?: string[];
    currencies: {
      code: string;
      name: string;
      symbol: string;
    }[];
    borders?: string[];
    flags: {
      png: string;
      svg: string;
      alt: string;
    };
    languages: {
      key: string;
      value: string;
    }[];
  } | null;
  onClose: () => void;
}

const CountryModal: React.FC<CountryModalProps> = ({ country, onClose }) => {
  if (!country) return null;

  const {
    name,
    population,
    region,
    capital,
    currencies,
    borders,
    flags,
    languages,
  } = country;

  console.log();
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg m-2 w-full">
        <button className="absolute right-4" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-center mb-2 font-semibold">{name.official}</h3>
        {name?.nativeName?.map((native, index) => (
          <p className="text-xs" key={index}>
            Native Name ({native.language}): {native.common} ({native.official})
          </p>
        ))}
        {capital?.map((item, index) => (
          <p className="text-xs" key={index}>
            Capital: {item}
          </p>
        ))}
        <p className="text-xs">Population: {population}</p>
        <p className="text-xs">Region: {region}</p>
        {currencies?.map((currency, index) => (
          <p className="text-xs" key={index}>
            Currency: {currency.name} ({currency.symbol})
          </p>
        ))}
        <p className="text-xs">Borders: {borders?.join(", ") || "None"}</p>
        {languages?.map((language, index) => (
          <p className="text-xs" key={index}>
            Language: {language.key} ({language.value})
          </p>
        ))}
        <div className="text-center mt-4">
          <img src={flags?.svg} alt={flags?.alt} className="mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
