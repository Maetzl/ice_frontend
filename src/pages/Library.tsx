import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getLibrary } from "../services/library_service";

interface Game {
  images: string[];
  name: string;
  description: string;
  price: number;
}

export default function Library() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [library, setLibrary] = useState<Game[]>([]); // Explicit type definition
  const [selectedGame, setGame] = useState<Game | null>(null); // Explicit type definition

  useEffect(() => {
    const initState = async () => {
      const accessToken = await getAccessTokenSilently();
      var userID = "";
      if (user?.sub) {
        userID = user?.sub.split("|")[1];
      }
      var form = new FormData();
      form.append("UserID", userID);
      const { data, error } = await getLibrary(accessToken, form);
      if (data) {
        setLibrary(data);
      }
      console.log("data", data);
    };
    initState();
  }, [getAccessTokenSilently]);

  function handleSetGame(game: Game) {
    setGame(game);
  }

  return (
    <div>
      <div className="flex justify-center items-start bg-gradient-to-b from-blue-600 to-[#283046] min-h-screen">
        <div className="w-2/3 min-h-screen bg-transparent">
          <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-start">
            <div className="flex ">
              {library.length > 0 ? (
                library.map((game, index) => (
                  <div className="relative">
                    <img
                      src={game.images[0]}
                      onClick={() => handleSetGame(game)}
                      className="p-2 w-96"
                    ></img>
                    <div className="text-center">{game.name}</div>
                  </div>
                ))
              ) : (
                <p>No games available in the library.</p>
              )}
            </div>
            {selectedGame && (
              <div>
                <h1 className="p-4 text-lg font-semibold text-center">
                  {selectedGame.name}
                </h1>
                <p>{selectedGame.description}</p>
                <p>Price: {selectedGame.price}</p>
                {/* Render additional game details */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
