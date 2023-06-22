import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Basket from "../pages/Basket";
import {
  getBasket,
  removeBasket,
  buyBasket,
} from "../services/profile_service";
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
jest.mock("react-router-dom");
jest.mock("../services/profile_service");

describe("Basket", () => {
  const user = {
    sub: "auth0|user123",
  };
  const getAccessTokenSilently = jest.fn(() => "testAccessToken");

  test("renders the basket component", async () => {
    const games = [
      {
        name: "Game 1",
        description: "Description 1",
        price: 10,
        gameID: "game1",
        images: ["image1.jpg"],
      },
      {
        name: "Game 2",
        description: "Description 2",
        price: 15,
        gameID: "game2",
        images: ["image2.jpg"],
      },
    ];

    // Mock the useNavigate function
    const navigate = jest.fn();
    const useNavigateMock = useNavigate as jest.MockedFunction<
      typeof useNavigate
    >;
    useNavigateMock.mockReturnValue(navigate);

    // Mock the getBasket function
    const getBasketMock = getBasket as jest.MockedFunction<typeof getBasket>;
    getBasketMock.mockResolvedValue({ data: games, error: null });

    render(<Basket />);

    // Assert that the basket component is rendered
    expect(screen.getByText("Basket")).toBeInTheDocument();

    // Assert that the game items are rendered
    expect(screen.getByText("Game 1")).toBeInTheDocument();
    expect(screen.getByText("Game 2")).toBeInTheDocument();

    // Assert that the remove button works
    fireEvent.click(screen.getByText("Remove"));
    expect(removeBasket).toHaveBeenCalledWith(
      "testAccessToken",
      expect.any(FormData)
    );

    // Assert that the buy button works
    fireEvent.click(screen.getByText("Buy"));
    expect(buyBasket).toHaveBeenCalledWith(
      "testAccessToken",
      expect.any(FormData)
    );
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
