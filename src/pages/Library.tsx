import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getLibrary } from "../services/library_service";

export default function Library() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [library, setLibrary] = useState([
    { name: "", description: "", price: 0 },
  ]);
  const [selectedGame, setGame] = useState({
    name: "",
    description: "",
    price: 0,
  });

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

  function handleSetGame(game: {
    name: string;
    description: string;
    price: number;
  }): void {
    setGame(game);
  }

  return (
    <div>
      <div className="flex justify-center items-start bg-[#070231] min-h-screen">
        <div className="bg-[#050125] min-h-screen w-2/3">
          <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-start">
            <div className=" w-60 ">
              {library.map((game, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSetGame(game)}
                  className="block w-full cursor-pointer rounded-lg px-4 py-1 mt-1 text-left transition duration-500 bg-slate-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200"
                >
                  {game.name}
                </button>
              ))}
            </div>
            <div>{selectedGame.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
