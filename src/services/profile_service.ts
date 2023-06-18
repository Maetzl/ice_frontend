import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const getProfile = async (accessToken: string, userID: any) => {
  var form = new FormData();
  form.append("UserID", userID);
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
  return {
    data: data || null,
    error,
  };
};
const updateProfile = async (accessToken: string, userData: FormData) => {
  const config = {
    url: `${apiServerUrl}/api/profile/update/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data : userData
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
export {getProfile, updateProfile}