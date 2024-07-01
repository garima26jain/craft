import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";
import App from "./App";

const client = new ApolloClient({
  uri:"/graphql",
  cache: new InMemoryCache(),
});

interface ApolloProviderProps {
  children: React.ReactNode;
}

const ApolloProviderWrapper: React.FC<ApolloProviderProps> = ( ) => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;
