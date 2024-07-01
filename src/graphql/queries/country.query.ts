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
