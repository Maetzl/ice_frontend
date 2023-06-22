import React from "react";
import { render, screen } from "@testing-library/react";
import Library from "../pages/Library";

jest.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }: any) => children,
  withAuthenticationRequired: (component: any, _: any) => component,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "auth0|TestID123" },
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    };
  },
}));

describe("Library", () => {
  test("renders empty library message", () => {
    // Mock an empty library response
    jest.mock("../services/library_service", () => ({
      getLibrary: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }));

    // Render the component
    render(<Library />);

    // Find the empty library message
    const emptyLibraryMessage = screen.getByText(
      /No games available in the library/i
    );

    // Assert that the empty library message is rendered
    expect(emptyLibraryMessage).toBeInTheDocument();
  });

  test("renders games in the library", async () => {
    // Render the component
    render(<Library />);

    // Wait for the library data to be fetched
    await screen.findByText(/Game 1/i);

    // Find the game elements
    const game1Element = screen.getByText(/Game 1/i);
    const game2Element = screen.getByText(/Game 2/i);

    // Assert that the game elements are rendered
    expect(game1Element).toBeInTheDocument();
    expect(game2Element).toBeInTheDocument();
  });

  test("displays selected game details", async () => {
    // Render the component
    render(<Library />);

    // Wait for the library data to be fetched
    await screen.findByText(/Game 1/i);

    // Find a game element and click on it
    const gameElement = screen.getByText(/Game 1/i);
    gameElement.click();

    // Find the selected game details
    const selectedGameName = screen.getByText(/Game 1/i);
    const selectedGameDescription = screen.getByText(/Description 1/i);
    const selectedGamePrice = screen.getByText(/Price: 9.99/i);

    // Assert that the selected game details are displayed
    expect(selectedGameName).toBeInTheDocument();
    expect(selectedGameDescription).toBeInTheDocument();
    expect(selectedGamePrice).toBeInTheDocument();
  });
});
