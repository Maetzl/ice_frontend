import React, { useEffect, useState } from "react";
import { getProfile } from "../services/profile_service";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Zustand für die Ladeanzeige
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;
    const getMessage = async () => {
      const accessToken = await getAccessTokenSilently();
      var userID = "";
      var tempName = "";
      if (user?.sub) {
        userID = user?.sub.split("|")[1];
      }
      if (user?.nickname) {
        tempName = user?.nickname;
      }
      var form = new FormData();
      form.append("UserID", userID);
      form.append("TempName", tempName);
      const { data, error } = await getProfile(accessToken, form);
      if (!isMounted) {
        return;
      }
      if (data) {
        setUserData(JSON.stringify(data, null, 2));
      }
      if (error) {
        setUserData(JSON.stringify(error, null, 2));
      }
      setIsLoading(false);
    };
    getMessage();
    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-testid="loading-spinner"
      >
        <div className="w-64 h-64 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></div>
      </div>
    );
  }
  if (userData) {
    const userDataObject = JSON.parse(userData);
    // Weitere Verarbeitung des userId oder anderer Daten

    const userID = user?.sub?.toString().split("|")[1];
    const imageSrc = `https://icegaming.s3.eu-central-1.amazonaws.com/profilepictures/PB${userID}`;
    console.log(userDataObject._id);
    console.log(imageSrc);
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="py-4 bg-gray-800">
          <div className="container px-4 mx-auto">
            <h1 className="text-2xl font-bold text-white">Profilseite</h1>
          </div>
        </header>
        <main className="container px-4 py-8 mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="flex items-center mb-8">
                  <div className="w-24 h-24 mr-4 bg-gray-700 rounded-full">
                    <img
                      src={imageSrc}
                      alt="Profilbild"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user?.nickname}
                    </h2>
                    <Link to={`/EditData`} state={userData}>
                      <button className="text-sm text-gray-300 hover:text-white">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="mb-4 text-base font-bold text-white">
                      Benutzer Information
                    </h3>
                    <div className="p-1 bg-gray-700 shadow-md">
                      <p className="text-white">UserID: {userDataObject._id}</p>
                      <p className="text-white">Name: {userDataObject.name}</p>
                      <p className="text-white">
                        description: {userDataObject.description}
                      </p>
                      <p className="text-white">
                        Country: {userDataObject.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    console.log("userData ist leer oder undefiniert");
    return (
      <div>
        Es ist ein Fehler aufgetreten. bitte Lade die Seite neu oder nehme
        Kontakt mit den Entwicklern auf.
      </div>
    ); // Zeige Fehler, wenn userData leer ist
  }
}
