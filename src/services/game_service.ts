import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

const getGame = async (accessToken: string, gameID: any) => {
  var form = new FormData();
  form.append("GameID", gameID);
  const config = {
    url: `${apiServerUrl}/api/games/game`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: form,
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const getAllGames = async () => {
  const config = {
    url: `${apiServerUrl}/api/games`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const createGame = async (accessToken: string, gameData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/publish`,
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

const getDevelopedGames = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/devGames/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData,
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

const removeGame = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/removeGame/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData,
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

const editGame = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/edit/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData,
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

const addBasket = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/addbasket`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData,
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const addComment = async ( accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/addcomment`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const replaceComment = async ( accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/replacecomment`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const removeComment = async ( accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/games/removecomment`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
export { getGame, createGame, getAllGames, addBasket, addComment, removeComment, replaceComment, editGame,removeGame, getDevelopedGames };