import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryCard, {CountryCardProps} from './CountryCard';
import React from 'react';

const mockOnViewMore = jest.fn();

const defaultProps: CountryCardProps = {
  details: {
    flag: '🇨🇦',
    name: { common: 'Canada' },
    population: 37742154,
    region: 'Americas',
    capital: ['Ottawa'],
  },
  onViewMore: mockOnViewMore,
};

describe('CountryCard Component', () => {
  beforeEach(() => {
    render(<CountryCard {...defaultProps} />);
  });

  it('should render the flag correctly', () => {
    expect(screen.getByText('🇨🇦')).toBeInTheDocument();
  });

  it('should render the name correctly', () => {
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('should render the population correctly', () => {
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('37742154')).toBeInTheDocument();
  });

  it('should render the region correctly', () => {
    expect(screen.getByText('Region')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
  });

  it('should render the capital correctly if provided', () => {
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Ottawa')).toBeInTheDocument();
  });

  it('should render the "View More" button', () => {
    expect(screen.getByText('View More')).toBeInTheDocument();
  });

  it('should call onViewMore when "View More" button is clicked', () => {
    fireEvent.click(screen.getByText('View More'));
    expect(mockOnViewMore).toHaveBeenCalledTimes(1);
  });
});
