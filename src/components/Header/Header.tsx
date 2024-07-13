import React, { useCallback } from "react";
import Select from "react-select";
import { searchOptions } from "../../utils/constants";

interface SearchOption {
  value: string;
  label: string;
}

interface HeaderProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  searchBy: SearchOption;
  setSearchBy: (option: SearchOption) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  handleSearchChange,
  searchTerm,
  searchBy,
  setSearchBy,
  handleKeyDown,
}) => {
  const handleSearchByChange = useCallback(
    (selectedOption: SearchOption | null) => {
      if (selectedOption) {
        setSearchBy(selectedOption);
      }
    },
    [setSearchBy]
  );

  return (
    <div className="flex justify-between flex-wrap">
      <h1 className="font-bold p-2">Countries</h1>
      <div className="w-full sm:w-96 h-10 border-black border border-solid rounded-md mb-2 flex items-center relative">
        <label htmlFor="searchBy" className="sr-only">
          Search By
        </label>
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
        <label htmlFor="countrySearch" className="sr-only">
          Search Term
        </label>
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder={`Search for a country by ${searchBy.label.toLowerCase()}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          aria-label={`Search for a country by ${searchBy.label.toLowerCase()}`}
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
  );
};

export default Header;
