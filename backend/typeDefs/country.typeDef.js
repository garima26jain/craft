import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    countries: [Country]
  }

  type Country {
    name: Name
    flag: String
    population: Int
    region: String
    capital: [String]
  }

  type Name {
    common: String
  }
`;
export default typeDefs;
