import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

const getLibrary = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/library/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data : userData
  };
  const { data, error } = await callExternalApi({ config });
  console.log("Library data:", data)
  return {
    data: data || null,
    error,
  }
};
export  { getLibrary }