import { getLibrary } from "../services/library_service";
import * as externalApiService from "../services/external_api_service";

jest.mock("../services/external_api_service");

describe("getLibrary", () => {
  test("fetches library data successfully", async () => {
    const accessToken = "testAccessToken";
    const userData = new FormData();
    const responseData = { games: [{ name: "Game 1" }, { name: "Game 2" }] };

    (externalApiService.callExternalApi as jest.Mock).mockResolvedValueOnce({
      data: responseData,
      error: null,
    });

    const result = await getLibrary(accessToken, userData);

    expect(externalApiService.callExternalApi).toHaveBeenCalledTimes(1);
    expect(externalApiService.callExternalApi).toHaveBeenCalledWith({
      config: {
        url: expect.stringContaining("/api/library/"),
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: userData,
      },
    });

    expect(result).toEqual({ data: responseData, error: null });
  });

  test("handles error when fetching library data", async () => {
    const accessToken = "testAccessToken";
    const userData = new FormData();
    const error = "Failed to fetch library data";

    (externalApiService.callExternalApi as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: error },
    });

    const result = await getLibrary(accessToken, userData);

    expect(externalApiService.callExternalApi).toHaveBeenCalledTimes(1);
    expect(externalApiService.callExternalApi).toHaveBeenCalledWith({
      config: {
        url: expect.stringContaining("/api/library/"),
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: userData,
      },
    });

    expect(result).toEqual({ data: null, error: { message: error } });
  });
});
