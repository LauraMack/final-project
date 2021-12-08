import React from "react";
import { useHistory } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  let history = useHistory();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={"http://localhost:3000/"}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;