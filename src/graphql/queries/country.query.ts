import { gql } from '@apollo/client';

export const FETCH_COUNTRIES_QUERY = gql`
  query GetCountries {
    countries {
      name {
        common
      }
      flag
      population
      region
      capital
    }
  }
`;

export const FETCH_COUNTRY_BY_NAME_QUERY = gql`
  query GetCountryByName($name: String!) {
    countryByName(name: $name) {
      name {
        common
        official
        nativeName {
          language
          official
          common
        }
      }
      flag
      population
      region
      capital
      currencies {
        code
        name
        symbol
      }
      borders
      flags {
        png
        svg
        alt
      }
      languages {
        key
        value
      }
    }
  }
`;
