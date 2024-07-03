import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_COUNTRY_BY_NAME_QUERY } from "../graphql/queries/country.query";
import CountryCard from "./CountryCard";
import CountryModal from "./CountryModal";
import Select from "react-select";

// Define interfaces for Country properties
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

const searchOptions = [
  { value: "name", label: "Name" },
  { value: "region", label: "Region" },
  { value: "lang", label: "Language" },
  { value: "currency", label: "Currency" },
];

const CountryListWidget: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [loadCount, setLoadCount] = useState<number>(20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [searchBy, setSearchBy] = useState<{ value: string; label: string }>(
    searchOptions[0]
  );

  const [
    fetchCountryByName,
    { data: countryData},
  ] = useLazyQuery(FETCH_COUNTRY_BY_NAME_QUERY);

  useEffect(() => {
    const getCountries = async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,population,region,flag"
      );
      const data = await res.json();
      setCountries(data);
      setDisplayedCountries(data.slice(0, loadCount));
    };
    getCountries();
  }, []);

  useEffect(() => {
    if (countryData && countryData.countryByName) {
      setSelectedCountry(countryData.countryByName);
      setIsModalOpen(true);
      document.body.classList.add("no-scroll");
    }
  }, [countryData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const searchCountries = async (searchTerm: string, searchBy: string) => {
    let apiUrl = `https://restcountries.com/v3.1/name/${searchTerm}`;
    if (searchBy === "region") {
      apiUrl = `https://restcountries.com/v3.1/region/${searchTerm}`;
    } else if (searchBy === "lang") {
      apiUrl = `https://restcountries.com/v3.1/lang/${searchTerm}`;
    } else if (searchBy === "currency") {
      apiUrl = `https://restcountries.com/v3.1/currency/${searchTerm}`;
    }
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const fetchFilteredCountries = async () => {
      if (debouncedSearchTerm) {
        const filteredData = await searchCountries(
          debouncedSearchTerm,
          searchBy.value
        );
        setDisplayedCountries(filteredData.slice(0, loadCount));
      } else {
        setDisplayedCountries(countries.slice(0, loadCount));
      }
    };
    fetchFilteredCountries();
  }, [debouncedSearchTerm, loadCount, countries, searchBy]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setLoadCount((prevCount) => prevCount + 20);
        setDisplayedCountries((prevCountries) => [
          ...(Array.isArray(prevCountries) ? prevCountries : []),
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

  const handleViewMore = useCallback(
    (country: Country) => {
      fetchCountryByName({ variables: { name: country.name.common } });
    },
    [fetchCountryByName]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedCountry(null);
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setHighlightedIndex(-1);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          prevIndex < displayedCountries.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : displayedCountries.length - 1
        );
      } else if (event.key === "Enter" && highlightedIndex >= 0) {
        const selectedCountry = displayedCountries[highlightedIndex];
        setSearchTerm(selectedCountry.name.common);
        setHighlightedIndex(-1);
        setDisplayedCountries([selectedCountry]);
      }
    },
    [displayedCountries, highlightedIndex]
  );

  const handleOptionClick = useCallback((country: Country) => {
    setSearchTerm(country.name.common);
    setHighlightedIndex(-1);
    setDisplayedCountries([country]);
  }, []);

  const handleSearchByChange = useCallback((selectedOption) => {
    setSearchBy(selectedOption);
  }, []);

  if (countries.length === 0) {
    return <div>No Results Found</div>;
  }

  return (
    <div className="m-4">
      <div className="flex justify-between flex-wrap">
        <h1 className="font-bold p-2">Countries</h1>
        <div className="w-full sm:w-96 h-10 border-black border border-solid rounded-md mb-2 flex items-center relative">
          <Select
            value={searchBy}
            onChange={handleSearchByChange}
            options={searchOptions}
            className="mr-2 border-black"
            styles={{
              control: (provided) => ({
                ...provided,
                minWidth: "100px",
                boxShadow: "none",
                background: "white",
                borderColor: "black",
              }),
              container: (provided) => ({
                ...provided,
                flex: "0 0 auto",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                padding: 0,
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                padding: 0,
              }),
            }}
          />
          <input
            type="text"
            className="flex-1 outline-none"
            placeholder={`Search for a country by ${searchBy.label.toLowerCase()}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {/* {searchTerm && displayedCountries.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-solid border-gray-300 max-h-40 overflow-y-auto z-10">
              {displayedCountries.map((country, index) => (
                <div
                  key={index}
                  className={`p-2 cursor-pointer ${highlightedIndex === index ? "bg-gray-100" : ""}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleOptionClick(country)}
                >
                  {country.name.common}
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-2">
        {displayedCountries.map((country, index) => (
          <div key={index} className="flex">
            <CountryCard
              details={country}
              onViewMore={() => handleViewMore(country)}
            />
          </div>
        ))}
      </div>
      <div ref={loadMoreRef} style={{ height: "1px" }}></div>
      {isModalOpen && (
        <CountryModal country={selectedCountry} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CountryListWidget;
