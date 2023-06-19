import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

const getGame = async (accessToken: string, gameID: any) => {
    var form = new FormData();
    form.append("GameID", gameID);
  const config = {
    url: `${apiServerUrl}/api/game`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data : form
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

const createGame = async (
  accessToken: string,
  gameData: FormData
) => {
  const config = {
    url: `${apiServerUrl}/api/game/update`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: gameData,
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

export { getGame, createGame };
