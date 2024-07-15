import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryListing from './CountryListing';
import axios from 'axios';
import { MockedProvider } from '@apollo/client/testing';
import { FETCH_COUNTRY_BY_NAME_QUERY } from '../../graphql/queries/country.query';

jest.mock('axios');

const mockCountries = [
  {
    name: { common: 'Country1' },
    capital: ['Capital1'],
    population: 1000000,
    region: 'Region1',
    flags: { png: 'flag1.png' },
  },
  {
    name: { common: 'Country2' },
    capital: ['Capital2'],
    population: 2000000,
    region: 'Region2',
    flags: { png: 'flag2.png' },
  },
];

const mocks = [
  {
    request: {
      query: FETCH_COUNTRY_BY_NAME_QUERY,
      variables: { name: 'Country1' },
    },
    result: {
      data: {
        countryByName: {
          name: { common: 'Country1' },
          capital: 'Capital1',
          population: 1000000,
          region: 'Region1',
          flags: { png: 'flag1.png' },
        },
      },
    },
  },
];

describe('CountryListing Component', () => {
  beforeEach(() => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockCountries });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CountryListing component and fetches countries', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CountryListing />
      </MockedProvider>
    );

    expect(screen.getByTestId('no-results')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('country-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('country-item-1')).toBeInTheDocument();
    });
  });

  test('searches for countries by name', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CountryListing />
      </MockedProvider>
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Country1' } });

    await waitFor(() => {
      expect(screen.getByTestId('country-item-0')).toBeInTheDocument();
      expect(screen.queryByTestId('country-item-1')).not.toBeInTheDocument();
    });
  });

  test('displays country details in a modal on view more click', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CountryListing />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('country-item-0')).toBeInTheDocument();
    });

    const viewMoreButton = screen.getAllByText(/View More/i)[0];
    fireEvent.click(viewMoreButton);

    await waitFor(() => {
      expect(screen.getByTestId('country-modal')).toBeInTheDocument();
      expect(screen.getByText(/Capital1/i)).toBeInTheDocument();
      expect(screen.getByText(/1000000/i)).toBeInTheDocument();
    });
  });

  test('loads more countries on scroll', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CountryListing />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('country-item-0')).toBeInTheDocument();
    });

    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(screen.getByTestId('country-item-1')).toBeInTheDocument();
    });
  });
});
