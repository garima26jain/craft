import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { FETCH_COUNTRIES_QUERY, FETCH_COUNTRY_BY_NAME_QUERY } from "../graphql/queries/country.query";
import CountryCard from "./CountryCard";
import CountryModal from "./CountryModal";
import Search from "../assets/search-mobile.svg";

interface NativeName {
  language: string;
  official: string;
  common: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Flag {
  png: string;
  svg: string;
  alt: string;
}

interface Language {
  key: string;
  value: string;
}

interface Country {
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

const CountryListWidget: React.FC = () => {
  const { data, loading, error } = useQuery(FETCH_COUNTRIES_QUERY);
  const [countries, setCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [loadCount, setLoadCount] = useState<number>(20); // Initial number of countries to display
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [fetchCountryByName, { data: countryData, loading: countryLoading, error: countryError }] = useLazyQuery(FETCH_COUNTRY_BY_NAME_QUERY);
console.log({countryData});

  useEffect(() => {
    if (data && data.countries) {
      setCountries(data.countries);
      setDisplayedCountries(data.countries.slice(0, loadCount));
    }
  }, [data, loadCount]);

  useEffect(() => {
    if (countryData && countryData.countryByName) {
      setSelectedCountry(countryData.countryByName);
      setIsModalOpen(true);
      document.body.classList.add("no-scroll");
    }
  }, [countryData]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setLoadCount((prevCount) => prevCount + 20);
        setDisplayedCountries((prevCountries) => [
          ...prevCountries,
          ...countries.slice(prevCountries.length, prevCountries.length + 20),
        ]);
      }
    },
    [countries]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleViewMore = (country: Country) => {
    fetchCountryByName({ variables: { name: country.name.common } });
  };

  const handleCloseModal = () => {
    setSelectedCountry(null);
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  if (loading && displayedCountries.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="m-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="font-bold p-2">Countries</h1>
        <div className="w-full sm:w-96 h-10 p-2 border-black border border-solid rounded-md mb-2 flex">
          <input type="text" className="w-full" />
          <button className="flex justify-end">
            <img src={Search} alt="Search" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-2">
        {displayedCountries.map((country, index) => (
          <div key={index} className="flex">
            <CountryCard details={country} onViewMore={() => handleViewMore(country)} />
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      <div ref={loadMoreRef} style={{ height: "1px" }}></div>
      {isModalOpen && <CountryModal country={selectedCountry} onClose={handleCloseModal} />}
    </div>
  );
};

export default CountryListWidget;
