import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
} else {
  console.error("Root container not found");
}
