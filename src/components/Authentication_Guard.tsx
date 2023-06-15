import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

export const AuthenticationGuard = ({ component }: any) => {
  const { user } = useAuth0();

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div className="page-layout">Loading...</div>,
  });

  return <Component />;
};
