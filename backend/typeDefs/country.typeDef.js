import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    countries: [Country]
    countryByName(name: String!): Country
  }

  type Country {
    name: Name
    flag: String
    population: Int
    region: String
    capital: [String]
    currencies: [Currency]
    borders: [String]
    flags: Flag
    languages: [Language]
  }

  type Name {
    common: String
    official: String
    nativeName: [NativeName]
  }

  type NativeName {
    language: String
    official: String
    common: String
  }

  type NativeNameValue {
    official: String
    common: String
  }

  type Currency {
    code: String
    name: String
    symbol: String
  }

  type Flag {
    png: String
    svg: String
    alt: String
  }

  type Language {
    key: String
    value: String
  }
`;

export default typeDefs;
