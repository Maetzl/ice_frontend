import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

const getLibrary = async (accessToken: string) => {
  const config = {
    url: `${apiServerUrl}/api/library/`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  }
};
export  { getLibrary }