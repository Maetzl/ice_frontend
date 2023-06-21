import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button
      className="block py-2 pl-3 pr-3 text-gray-100 transition-all bg-blue-500 rounded-md md:p-0 md:px-3 md:py-2 hover:scale-110"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
