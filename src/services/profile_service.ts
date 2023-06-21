import { callExternalApi } from "./external_api_service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const getProfile = async (accessToken: string, userData: FormData) => {

  const config = {
    url: `${apiServerUrl}/api/profile/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data: userData
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
    data: userData
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
const getBasket = async (accessToken: string, userData : FormData) => {
  const config = {
    url: `${apiServerUrl}/api/profile/basket/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data: userData
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  }
}
const removeBasket = async (accessToken: string, userData : FormData) => {
  const config = {
    url: `${apiServerUrl}/api/profile/removebasket/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data: userData
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  }
}
const buyBasket = async (accessToken: string, userData : FormData) => {
  const config = {
    url: `${apiServerUrl}/api/profile/buybasket/`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    data: userData
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  }
}
export { getProfile, updateProfile, getBasket, removeBasket, buyBasket }