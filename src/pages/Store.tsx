import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { getAllGames } from "../services/game_service";

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const games = [
    { id: 1, name: "Game 1", image: null },
    { id: 2, name: "Game 2", image: null },
    { id: 3, name: "Game 3", image: null },
    { id: 4, name: "Game 4", image: null },
    { id: 5, name: "Game 1", image: null },
    { id: 6, name: "Game 2", image: null },
    { id: 7, name: "Game 3", image: null },
    { id: 8, name: "Game 4", image: null },
    { id: 9, name: "Game 1", image: null },
    { id: 10, name: "Game 2", image: null },
    { id: 11, name: "Game 3", image: null },
    { id: 12, name: "Game 4", image: null },
    { id: 13, name: "Game 1", image: null },
    { id: 14, name: "Game 2", image: null },
    { id: 15, name: "Game 3", image: null },
    { id: 16, name: "Game 4", image: null },
    { id: 17, name: "Game 1", image: null },
    { id: 18, name: "Game 2", image: null },
    { id: 19, name: "Game 3", image: null },
    { id: 20, name: "Game 4", image: null },
    { id: 21, name: "Game 1", image: null },
    { id: 22, name: "Game 2", image: null },
    { id: 23, name: "Game 3", image: null },
    { id: 24, name: "Game 4", image: null },
    { id: 25, name: "Game 1", image: null },
    { id: 26, name: "Game 2", image: null },
    { id: 27, name: "Game 3", image: null },
    { id: 28, name: "Game 4", image: null },
    { id: 29, name: "Game 1", image: null },
    { id: 30, name: "Game 2", image: null },
    { id: 31, name: "Game 3", image: null },
    { id: 32, name: "Game 4", image: null },
  ];
  //USe Effect benutzen für backend
  useEffect(() => {
    let isMounted = true;
    const getMessage = async () => {
      const { data, error } = await getAllGames();
      console.log("Games HEre", data);
      /*
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
      */
    };
    getMessage();
    return () => {
      isMounted = false;
    };
  }, [getAllGames]);
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="flex justify-center items-start bg-[#070231] min-h-screen">
      <div className="bg-[#050125] min-h-screen">
        <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-center">
          <h1 className="mt-20 text-4xl">Store</h1>

          <div className="w-2/3 mb-8 md:w-1/2">
            <input
              className="w-full p-4 border-none bg-white text-[#283046] rounded-5"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGames.map((game) => (
              <div className="flex flex-col items-center game" key={game.id}>
                <img
                  className="object-cover w-full h-auto"
                  src="https://icegaming.s3.eu-central-1.amazonaws.com/logo/iceLogo.png"
                  alt={game.name}
                />
                <p className="mt-2 text-white">{game.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
