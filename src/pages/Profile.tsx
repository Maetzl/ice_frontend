import React, { useEffect, useState } from "react";
import { getProfile } from "../services/profile_service";
import { getDevelopedGames, removeGame } from "../services/game_service";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState("");
  const [devGames, setDevGames] = useState([
    {
      description: "",
      developerName: "",
      name: "",
      price: "",
      releaseDate: "",
      tags: [""],
      developerID: "filler",
      gameID: "",
      images: [""],
    },
  ]);
  const [favoriteGameTime, setFavoriteGameTime] = useState("0 Stunden");
  const [isLoading, setIsLoading] = useState(true); // Zustand für die Ladeanzeige
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

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
      console.log("38", userID);
      var form = new FormData();
      form.append("UserID", userID);
      form.append("TempName", tempName);
      let { data, error } = await getProfile(accessToken, form);

      var devForm = new FormData();

      devForm.append("UserID", userID);

      if (!isMounted) {
        return;
      }
      if (data) {
        setUserData(JSON.stringify(data, null, 2));
      }
      if (error) {
        setUserData(JSON.stringify(error, null, 2));
      }

      data = await getDevelopedGames(accessToken, devForm);

      if (data.data) {
        console.log("data 61", data);
        setDevGames(data.data);
      }
      console.log("devGames:", devGames, typeof devGames);

      setIsLoading(false);
    };
    getMessage();
    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);
  if (isLoading) {
    // Ladeanzeige anzeigen, solange isLoading true ist
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-64 h-64 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></div>
      </div>
    );
  }

  async function handleDeleteGame(gameID: string): Promise<any> {
    let data = devGames.filter((obj) => obj.gameID !== gameID);
    setDevGames(data);
    const accessToken = await getAccessTokenSilently();
    var userID = "";
    if (user?.sub) {
      userID = user?.sub.split("|")[1];
    }
    var form = new FormData();
    form.append("GameID", gameID);
    form.append("UserID", userID);
    removeGame(accessToken, form);
  }

  function handleEditGame(game: any): void {
    navigate("/EditGame", { state: { id: 1, game: game } });
  }

  if (userData) {
    const userDataObject = JSON.parse(userData);
    // Weitere Verarbeitung des userId oder anderer Daten

    const userID = user?.sub?.toString().split("|")[1];
    const imageSrc = `https://icegaming.s3.eu-central-1.amazonaws.com/profilepictures/PB${userID}`;
    console.log(userDataObject._id);
    console.log("imgURL:", imageSrc);

    return (
      <div className="min-h-screen bg-gray-900">
        <header className="py-4 bg-gray-800">
          <div className="container px-4 mx-auto">
            <h1 className="text-2xl font-bold text-center text-white">
              Profilseite
            </h1>
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
                      <p className="text-white">
                        UserID: {userDataObject.playerID}
                      </p>
                      <p className="text-white">Name: {userDataObject.name}</p>
                      <p className="text-white">
                        Description: {userDataObject.description}
                      </p>
                      <p className="text-white">
                        Country: {userDataObject.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Your Games
                  </h3>

                  <div className="flex flex-wrap mt-4">
                    {devGames.map((game, index) => (
                      <div key={index} className=" m-2 bg-gray-700 rounded-lg">
                        <div className="flex flex-col justify-between h-full p-2">
                          <div className="text-white">{game.name}</div>
                          <div className="text-xs text-gray-400">
                            {game.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Do you really want to delete this game?"
                              )
                            ) {
                              handleDeleteGame(game.gameID);
                            }
                          }}
                          className="px-4 py-2 text-gray-100 bg-red-900 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                        >
                          Delete Game
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditGame(game)}
                          className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                        >
                          Edit Game
                        </button>
                      </div>
                    ))}
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
