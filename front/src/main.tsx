import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./api/apolloClient.ts";
import { BrowserRouter } from "react-router-dom";
import { CustomAlert } from "./components/UI/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <CustomAlert />
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
