import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_COUNTRY_BY_NAME_QUERY } from "../../graphql/queries/country.query";
import CountryCard from "../CountryCards/CountryCard";
import CountryModal from "../CountryModal/CountryModal";
import { Country } from "../ICountryWidget";
import Header from "../Header/Header";
import { searchOptions } from "../../utils/constants";
import axios from "axios";

const CountryListing: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [loadCount, setLoadCount] = useState<number>(20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem("searchTerm") || ""
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [searchBy, setSearchBy] = useState<{ value: string; label: string }>(
    JSON.parse(
      localStorage.getItem("searchBy") || JSON.stringify(searchOptions[0])
    )
  );

  const [fetchCountryByName, { data: countryData }] = useLazyQuery(
    FETCH_COUNTRY_BY_NAME_QUERY
  );

  useEffect(() => {
    const getCountries = async () => {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,population,region,flag"
      );
      const data = await res.data;
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
      const res = await axios.get(apiUrl);
      if (res.status != 200) {
        throw new Error();
      }
      const data = await res.data;
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
          // console.log(e);
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
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem("searchBy", JSON.stringify(searchBy));
  }, [searchBy]);

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
    },
    []
  );

  return (
    <div
      className="h-screen w-screen
     bg-custom-gradient"
     data-testid="country-listing"
    >
      <Header
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        setSearchTerm={setSearchTerm}
      />
      {!countries ||
      !displayedCountries ||
      countries?.length === 0 ||
      displayedCountries?.length === 0 ? (
        <div
          className="h-screen overflow-y-auto flex items-center justify-center text-lg"
          role="alert"
          data-testid="no-results"
        >
          No Results Found
        </div>
      ) : (
        <>
          {displayedCountries.length > 0 && searchTerm.length > 0 && (
            <div className="text-center my-4" data-testid="results-count">
              Showing {displayedCountries.length} out of {countries.length}{" "}
              results
            </div>
          )}
          <div
            role="list"
            data-testid="countries-list"
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-2"
          >
            {displayedCountries?.map((country, index) => (
              <div key={index} className="flex" role="listitem" data-testid={`country-item-${index}`}>
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
            data-testid="load-more"
          ></div>
          {isModalOpen && (
            <CountryModal
              country={selectedCountry}
              onClose={handleCloseModal}
              data-testid="country-modal"
            />
          )}
        </>
      )}
    </div>
  );
};

export default CountryListing;
