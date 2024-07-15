import React, { useCallback, useState, useEffect, useRef } from "react";
import { searchOptions } from "../../utils/constants";

interface SearchOption {
  value: string;
  label: string;
}

export interface HeaderProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  searchBy: SearchOption;
  setSearchBy: (option: SearchOption) => void;
  setSearchTerm: (term: string) => void;
}

export const CustomSelect: React.FC<{
  value: SearchOption;
  options: SearchOption[];
  onChange: (option: SearchOption) => void;
}> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0); // Default to the first option
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelectClick = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: SearchOption, index: number) => {
    onChange(option);
    setHighlightedIndex(index);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : options.length - 1
      );
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      handleOptionClick(options[highlightedIndex], highlightedIndex);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // Ensure the default selection is highlighted
    const defaultIndex = options.findIndex(
      (option) => option.value === value.value
    );
    if (defaultIndex !== -1) {
      setHighlightedIndex(defaultIndex);
    }
  }, [value, options]);

  return (
    <div
      className="relative"
      ref={selectRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="border border-black rounded-md p-2 cursor-pointer flex justify-between items-center"
        onClick={handleSelectClick}
      >
        {value.label}
        <span className="ml-2">&#x25BC;</span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 z-10">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${
                highlightedIndex === index ? "bg-gray-300" : ""
              }`}
              onClick={() => handleOptionClick(option, index)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  handleSearchChange,
  searchTerm,
  searchBy,
  setSearchBy,
  setSearchTerm,
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
    <div className="flex justify-between flex-wrap mx-4">
      <div className="font-bold p-2 text-lg">Countries</div>
      <div
        role="select-input"
        className="w-[500px] h-10 border-black border border-solid rounded-md my-2 flex items-center relative bg-white"
      >
        <label htmlFor="searchBy" className="sr-only">
          Search By
        </label>
        <CustomSelect
          value={searchBy}
          onChange={handleSearchByChange}
          options={searchOptions}
        />
        <label htmlFor="countrySearch" className="sr-only">
          Search Term
        </label>
        <input
          type="text"
          className="ml-2 flex-1 outline-none"
          placeholder={`Search for a country by ${searchBy.label.toLowerCase()}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label={`Search for a country by ${searchBy.label.toLowerCase()}`}
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-0 px-2 text-gray-500"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            &#x2715;
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
