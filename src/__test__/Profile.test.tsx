import React from "react";
import { render, waitFor } from "@testing-library/react";
import Profile from "../pages/Profile";
import axios from "axios";

jest.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
  withAuthenticationRequired: (component: React.ReactNode) => component,
  useAuth0: () => ({
    isLoading: false,
    user: { sub: "auth0|TestID123" },
    isAuthenticated: true,
    loginWithRedirect: jest.fn(),
    getAccessTokenSilently: jest.fn(),
  }),
}));

jest.mock("../services/profile_service", () => ({
  getProfile: jest.fn().mockResolvedValueOnce({
    name: "Gunter Jauch",
    description: "wer wird millionar",
    country: "USA",
  }),
}));

test("renders loading state correctly", () => {
  const { getByTestId } = render(<Profile />);

  // Assert that the loading spinner is displayed
  const loadingSpinner = getByTestId("loading-spinner");
  expect(loadingSpinner).toBeInTheDocument();
});
