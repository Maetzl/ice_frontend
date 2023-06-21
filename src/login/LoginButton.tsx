import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <button
      className="block py-2 pl-3 pr-3 text-gray-100 transition-all bg-blue-500 rounded-md md:p-0 md:px-3 md:py-2 hover:scale-110"
      onClick={handleLogin}
    >
      Log In
    </button>
  );
};

export default LoginButton;
