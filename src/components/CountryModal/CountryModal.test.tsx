import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CountryModal from "./CountryModal";

const mockCountry = {
  name: {
    common: "Test Country",
    nativeName: [
      { language: "en", common: "Test Country", official: "Republic of Test Country" }
    ],
  },
  population: 1000000,
  region: "Test Region",
  capital: ["Test City"],
  currencies: [
    { name: "Test Dollar", symbol: "T$" }
  ],
  borders: ["Test Neighbor"],
  flags: { svg: "test-flag.svg", alt: "Test Flag" },
  languages: [
    { key: "en", value: "English" }
  ],
};

describe("CountryModal Component", () => {
  test("renders correctly with country data", () => {
    render(<CountryModal country={mockCountry} onClose={jest.fn()} />);
    expect(screen.getByText("Test Country")).toBeInTheDocument();
    expect(screen.getByText("Population: 1000000")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<CountryModal country={mockCountry} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText("×"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("does not render modal when country is null", () => {
    const { container } = render(<CountryModal country={null} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
