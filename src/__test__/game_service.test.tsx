import { callExternalApi } from "../services/external_api_service";
import {
  getGame,
  createGame,
  getAllGames,
  addBasket,
  getDevelopedGames,
  removeGame,
  editGame,
} from "../services/game_service";

// Mock the callExternalApi function
jest.mock("../services/external_api_service", () => ({
  callExternalApi: jest.fn(),
}));

describe("Your Service", () => {
  const accessToken = "your-access-token";
  const gameID = "your-game-id";
  const gameData = new FormData();
  // Add necessary data to gameData

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getGame", () => {
    it("should retrieve the game", async () => {
      const expectedData = { gameData: "your-game-data" };
      const expectedError = null;

      // Mock the response of callExternalApi
      (callExternalApi as jest.Mock).mockResolvedValueOnce({
        data: expectedData,
        error: expectedError,
      });

      const result = await getGame(accessToken, gameID);

      expect(callExternalApi).toHaveBeenCalledWith({
        config: expect.objectContaining({
          url: expect.stringContaining("/api/games/game"),
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.stringContaining(accessToken),
          }),
          data: expect.any(FormData),
        }),
      });
      expect(result).toEqual({
        data: expectedData,
        error: expectedError,
      });
    });
  });

  // Write similar tests for other functions...
});
describe("Game Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const accessToken = "your-access-token";
  const gameID = "your-game-id";
  const gameData = new FormData();
  const userData = new FormData();

  test("getGame calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/game`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await getGame(accessToken, gameID);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("createGame calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/publish`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await createGame(accessToken, gameData);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("getAllGames calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await getAllGames();

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("getDevelopedGames calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/devGames/`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await getDevelopedGames(accessToken, userData);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("removeGame calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/removeGame/`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await removeGame(accessToken, userData);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("editGame calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/edit/`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await editGame(accessToken, userData);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });

  test("addBasket calls callExternalApi with the correct configuration", async () => {
    const expectedConfig = {
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/games/addbasket`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: expect.any(FormData),
    };

    await addBasket(accessToken, userData);

    expect(callExternalApi).toHaveBeenCalledWith({ config: expectedConfig });
  });
});
