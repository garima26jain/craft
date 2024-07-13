import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryCard from './CountryCard';

const mockDetails = {
  flag: "🇨🇦",
  name: {
    common: "Canada",
  },
  population: 37742154,
  region: "Americas",
  capital: ["Ottawa"],
};

describe("CountryCard Component", () => {
  test("renders CountryCard with all details", () => {
    render(<CountryCard details={mockDetails} onViewMore={jest.fn()} />);

    expect(screen.getByText("🇨🇦")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("Capital: Ottawa")).toBeInTheDocument();
    expect(screen.getByText("Population: 37742154")).toBeInTheDocument();
    expect(screen.getByText("Region: Americas")).toBeInTheDocument();
  });

  test("renders CountryCard without capital", () => {
    const detailsWithoutCapital = { ...mockDetails, capital: undefined };
    render(
      <CountryCard details={detailsWithoutCapital} onViewMore={jest.fn()} />
    );

    expect(screen.getByText("🇨🇦")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.queryByText("Capital:")).not.toBeInTheDocument();
    expect(screen.getByText("Population: 37742154")).toBeInTheDocument();
    expect(screen.getByText("Region: Americas")).toBeInTheDocument();
  });

  test("calls onViewMore when button is clicked", () => {
    const onViewMoreMock = jest.fn();
    render(<CountryCard details={mockDetails} onViewMore={onViewMoreMock} />);

    const button = screen.getByText("View More");
    fireEvent.click(button);

    expect(onViewMoreMock).toHaveBeenCalled();
  });
});
