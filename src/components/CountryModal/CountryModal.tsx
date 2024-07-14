import React from "react";
import { CountryModalProps } from "../ICountryModal";

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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-slate-200 p-10 rounded-lg shadow-lg m-2">
        <button className="absolute top-2 right-2" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-center mb-2 font-semibold">{name.common}</h3>
        <div className="text-center my-4 ">
          <img
            src={flags?.svg}
            alt={flags?.alt}
            className="mx-auto h-60 flag-animation"
          />
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:pr-4">
            {name?.nativeName?.length > 0 && (
              <ul className="text-xs mb-2">
                <li className="font-semibold">Native Name:</li>
                {name.nativeName.map((native, index) => (
                  <li className="list-none" key={index}>
                    ({native.language}): {native.common} ({native.official})
                  </li>
                ))}
              </ul>
            )}
            {capital?.map((cap, index) => (
              <p className="text-xs mb-2" key={index}>
                <span className="font-semibold">Capital:</span> {cap}
              </p>
            ))}
            <p className="text-xs mb-2">
              <span className="font-semibold">Population:</span> {population}
            </p>
            <p className="text-xs mb-2">
              <span className="font-semibold">Region:</span> {region}
            </p>
          </div>
          <div className="flex-1 md:pl-4">
            {currencies?.map((currency, index) => (
              <p className="text-xs mb-2" key={index}>
                <span className="font-semibold">Currency:</span> {currency.name}{" "}
                ({currency.symbol})
              </p>
            ))}
            <p className="text-xs mb-2">
              <span className="font-semibold">Borders:</span>{" "}
              {borders?.join(", ") || "None"}
            </p>
            {languages?.length > 0 && (
              <ul className="text-xs">
                <li className="font-semibold">Languages:</li>
                {languages.map((language, index) => (
                  <li className="list-none ml-4" key={index}>
                    {language.key} ({language.value})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
