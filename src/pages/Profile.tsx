import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profile_service";

export default function Profile() {
  const [message, setMessage] = useState("");

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      const accessToken = await getAccessTokenSilently();
      const userName = user?.name;
      const { data, error } = await getProfile(accessToken, userName);

      if (!isMounted) {
        return;
      }

      if (data) {
        setMessage(JSON.stringify(data, null, 2));
      }

      if (error) {
        setMessage(JSON.stringify(error, null, 2));
      }
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  console.log(message);

  return (
    <div>
      {user?.sub}
      {message}
    </div>
  );
}
