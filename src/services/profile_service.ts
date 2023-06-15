import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getProfile = async (accessToken: string, userName: any) => {

    console.log(userName)
    const config = {
      url: `${apiServerUrl}/api/profile/`,
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        UserName: `Name ${userName}`,
      },
    };
  
    const { data, error } = await callExternalApi({ config });
  
    return {
      data: data || null,
      error,
    };
  };