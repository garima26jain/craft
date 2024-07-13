import React from "react";

interface CountryDetails {
  flag: string;
  name: {
    common: string;
  };
  population: number;
  region: string;
  capital?: string[];
}

interface CountryCardProps {
  details: CountryDetails;
  onViewMore: () => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ details, onViewMore }) => {
  const { flag, name, population, region, capital } = details;

  return (
    <div className="w-full border-black border border-solid rounded-md p-2 flex flex-col justify-between">
      <div className="text-center text-2xl">{flag}</div>
      <p className="text-center mb-2 font-semibold">{name.common}</p>
      {capital?.map((item, index) => (
        <p className="text-xs" key={index}>Capital: {item}</p>
      ))}
      <p className="text-xs">Population: {population}</p>
      <p className="text-xs">Region: {region}</p>
      <div className="flex justify-center mt-2">
        <button className="rounded-md p-2 bg-blue-400 text-white text-sm w-full" onClick={onViewMore}>
          View More
        </button>
      </div>
    </div>
  );
};

export default CountryCard;
