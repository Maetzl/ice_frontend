import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getProfile = async (accessToken: string, userName: any) => {

    console.log(userName)

    var form = new FormData();

    form.append("Name", userName);
    form.append("Test2", "Test2");
    form.append("Test3", "Test3");

    const config = {
      url: `${apiServerUrl}/api/profile/`,
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      data : form
    };
  
    const { data, error } = await callExternalApi({ config });
  
    console.log(data)

    return {
      data: data || null,
      error,
    };
  };