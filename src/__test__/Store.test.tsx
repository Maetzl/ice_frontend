import React from "react";
import { render, screen, act } from "@testing-library/react";
import Store from "../pages/Store";
import { getAllGames } from "../services/game_service";

jest.mock("../services/game_service", () => ({
  getAllGames: jest.fn(),
}));

describe("Store Component", () => {
  test("renders search input", async () => {
    render(<Store />);
    const searchInput = screen.getAllByPlaceholderText(/Search/i);
    expect(searchInput.length).toBeGreaterThan(0);
    expect(getAllGames).toHaveBeenCalledTimes(1);
  });

  //test("renders search input 2", async () => {
  //  const mockedGames: any[] = [
  //    {
  //      _id: "1",
  //      gameID: "game1",
  //      name: "Game 1",
  //      developerName: "Developer 1",
  //      releaseDate: "2023-06-01",
  //      price: "19.99",
  //      description: "This is game 1",
  //      tags: ["action", "adventure"],
  //      images: ["image1.jpg", "image2.jpg"],
  //      developerID: "developer1",
  //    },
  //    {
  //      _id: "2",
  //      gameID: "game2",
  //      name: "Game 2",
  //      developerName: "Developer 2",
  //      releaseDate: "2023-06-02",
  //      price: "29.99",
  //      description: "This is game 2",
  //      tags: ["strategy", "simulation"],
  //      images: ["image3.jpg", "image4.jpg"],
  //      developerID: "developer2",
  //    },
  //    // Add more games as needed
  //  ];
  //
  //  const mockGetAllGames = jest
  //    .fn()
  //    .mockResolvedValue({ data: mockedGames, error: null });
  //  require("../services/game_service").getAllGames = mockGetAllGames;
  //
  //  await act(async () => {
  //    render(<Store />);
  //  });
  //
  //  const searchInput = screen.getAllByPlaceholderText(/Search/i);
  //  expect(searchInput).toBeInTheDocument();
  //  expect(mockGetAllGames).toHaveBeenCalledTimes(1);
  //});

  //test("renders game cards", async () => {
  //  const mockGames = [
  //    {
  //      description: "Game 1 description",
  //      developerID: "64936fe61578f6687e235d3e",
  //      developerName: "fromsoft",
  //      gameID: "eldenring-1687384200993",
  //      images: [
  //        "https://icegaming.s3.eu-central-1.amazonaws.com/games/d-1687301686038/0",
  //        "https://icegaming.s3.eu-central-1.amazonaws.com/games/d-1687301686038/1",
  //      ],
  //      name: "Eldenring",
  //      price: "10.00",
  //      releaseDate: "21/6/2023",
  //      tags: ["Action", "RPG"],
  //      _id: {
  //        $oid: "6493708b82301a5ee0425c15",
  //      },
  //    },
  //  ];
  //
  //  jest.mock("../services/game_service", () => ({
  //    getAllGames: jest
  //      .fn()
  //      .mockResolvedValue({ data: mockGames, error: null }),
  //  }));
  //
  //  render(<Store />);
  //  const gameCards = await screen.findAllByTestId("game-card");
  //  expect(gameCards.length).toBe(mockGames.length);
  //});
});

//test("renders game cards", async () => {
//  const mockGames = [
//    {
//      description: "Game 1 description",
//      developerID: "64936fe61578f6687e235d3e",
//      developerName: "fromsoft",
//      gameID: "eldenring-1687384200993",
//      images: [
//        "https://icegaming.s3.eu-central-1.amazonaws.com/games/d-1687301686038/0",
//        "https://icegaming.s3.eu-central-1.amazonaws.com/games/d-1687301686038/1",
//      ],
//      name: "Eldenring",
//      price: "10.00",
//      releaseDate: "21/6/2023",
//      tags: ["Action", "RPG"],
//      _id: {
//        $oid: "6493708b82301a5ee0425c15",
//      },
//    },
//  ];
//
//  jest.mock("../services/game_service", () => ({
//    getAllGames: jest.fn().mockResolvedValue({ data: mockGames, error: null }),
//  }));
//
//  render(<Store />);
//  const gameCards = await screen.findAllByTestId("game-card");
//  expect(gameCards.length).toBe(mockGames.length);
//});
