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
    <div className="w-full border-black border border-solid rounded-md p-2 bg-gradient-to-r from-blue-100 to-red-200 transform duration-300 hover:scale-105">
      <div className="text-center text-2xl">{flag}</div>
      <p className="text-center mb-2 font-extrabold">{name.common}</p>
      <div className="grid grid-cols-3 place-items-center font-semibold">
        {capital?.map((item, index) => (
          <div className="text-xs grid-item p-5" key={index}>
            Capital <div className="font-light">{item}</div>
          </div>
        ))}
        <div className="text-xs grid-item p-5">
          Population <div className="font-light">{population}</div>
        </div>
        <div className="text-xs">
          Region <div className="font-light">{region}</div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <button
          className="rounded-md p-2 bg-blue-400 text-white text-sm w-full"
          onClick={onViewMore}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default CountryCard;
