import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryModal from './CountryModal';
import { CountryModalProps } from '../ICountryModal';

test("CountryModal does not render when 'country' is null", () => {
  const mockProps: CountryModalProps = {
    country: null,
    onClose: jest.fn(),
  };

  render(<CountryModal {...mockProps} />);

  const modalElement = screen.queryByRole('dialog');
  expect(modalElement).not.toBeInTheDocument();
});

test("CountryModal renders correctly with provided country details", () => {
  const mockCountry = {
    name: { common: "Germany", nativeName: [{ language: "de", common: "Deutschland", official: "Bundesrepublik Deutschland" }] },
    population: 83000000,
    region: "Europe",
    capital: ["Berlin"],
    currencies: [{ name: "Euro", symbol: "€" }],
    borders: ["France", "Poland", "Austria"],
    flags: { svg: "https://restcountries.com/v3.1/data/deu.svg", alt: "Flag of Germany" },
    languages: [{ key: "de", value: "German" }],
  };

  const mockOnClose = jest.fn();

  render(<CountryModal country={mockCountry} onClose={mockOnClose} />);

  const modalElement = screen.getByRole('dialog');
  expect(modalElement).toBeInTheDocument();

  const flagElement = screen.getByAltText("Flag of Germany");
  expect(flagElement).toBeInTheDocument();

  const nameElement = screen.getByText("Germany");
  expect(nameElement).toBeInTheDocument();

  const nativeNameElement = screen.getByText("(de): Deutschland (Bundesrepublik Deutschland)");
  expect(nativeNameElement).toBeInTheDocument();

  const capitalElement = screen.getByText("Berlin");
  expect(capitalElement).toBeInTheDocument();

  const populationElement = screen.getByText("83000000");
  expect(populationElement).toBeInTheDocument();

  const regionElement = screen.getByText("Europe");
  expect(regionElement).toBeInTheDocument();

  const currencyElement = screen.getByText("Euro (€)");
  expect(currencyElement).toBeInTheDocument();

  const bordersElement = screen.getByText("France, Poland, Austria");
  expect(bordersElement).toBeInTheDocument();

  const languageElement = screen.getByText("de (German)");
  expect(languageElement).toBeInTheDocument();

  const closeButton = screen.getByText("×");
  expect(closeButton).toBeInTheDocument();

  fireEvent.click(closeButton);
  expect(mockOnClose).toHaveBeenCalled();
});
