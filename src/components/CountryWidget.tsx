import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_COUNTRY_BY_NAME_QUERY } from "../graphql/queries/country.query";
import CountryCard from "./CountryCards/CountryCard";
import CountryModal from "./CountryModal/CountryModal";
import { Country } from "./ICountryWidget";
import Header from "./Header/Header";
import { searchOptions } from "../utils/constants";

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

  const [fetchCountryByName, { data: countryData }] = useLazyQuery(
    FETCH_COUNTRY_BY_NAME_QUERY
  );

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
    let apiUrl = `https://restcountries.com/v3.1/name/${searchTerm}?fields=name,capital,population,region,flag`;
    if (searchBy === "region") {
      apiUrl = `https://restcountries.com/v3.1/region/${searchTerm}?fields=name,capital,population,region,flag`;
    } else if (searchBy === "lang") {
      apiUrl = `https://restcountries.com/v3.1/lang/${searchTerm}?fields=name,capital,population,region,flag`;
    } else if (searchBy === "currency") {
      apiUrl = `https://restcountries.com/v3.1/currency/${searchTerm}?fields=name,capital,population,region,flag`;
    }
    try {
      const currentText = searchTerm;
      const res = await fetch(apiUrl);
      if (res.status != 200) {
        throw new Error();
      }
      const data = await res.json();
      return { data, currentText };
    } catch (e) {
      setDisplayedCountries([]);
      throw e;
    }
  };

  useEffect(() => {
    const fetchFilteredCountries = async () => {
      if (debouncedSearchTerm) {
        try {
          const { data, currentText } = await searchCountries(
            debouncedSearchTerm,
            searchBy.value
          );
          if (currentText === debouncedSearchTerm) {
            setDisplayedCountries(data?.slice(0, loadCount));
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setDisplayedCountries(countries?.slice(0, loadCount));
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
          ...countries.slice(prevCountries?.length, prevCountries?.length + 20),
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
          prevIndex < displayedCountries?.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : displayedCountries?.length - 1
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

  // const handleOptionClick = useCallback((country: Country) => {
  //   setSearchTerm(country.name.common);
  //   setHighlightedIndex(-1);
  //   setDisplayedCountries([country]);
  // }, []);

  return (
    <div className="m-4">
      <Header
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        handleKeyDown={handleKeyDown}
      />
      {!countries ||
      !displayedCountries ||
      countries?.length === 0 ||
      displayedCountries?.length === 0 ? (
        <div role="alert">No Results Found</div>
      ) : (
        <>
          <div
            role="list"
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-2"
          >
            {displayedCountries?.map((country, index) => (
              <div key={index} className="flex" role="listitem">
                <CountryCard
                  details={country}
                  onViewMore={() => handleViewMore(country)}
                />
              </div>
            ))}
          </div>
          <div
            ref={loadMoreRef}
            style={{ height: "1px" }}
            aria-hidden="true"
          ></div>
          {isModalOpen && (
            <CountryModal
              country={selectedCountry}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CountryListWidget;
