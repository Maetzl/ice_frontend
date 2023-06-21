import React, { useEffect, useState } from "react";
import "../App.css";
import { getAllGames } from "../services/game_service";
import { Link } from "react-router-dom";

interface Game {
  description: string;
  developerID: string;
  developerName: string;
  gameID: string;
  images: string[];
  name: string;
  price: string;
  releaseDate: string;
  tags: string[];
  _id: string;
}

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await getAllGames();
      if (data) {
        setGames(data);
      }
      if (error) {
        console.log("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {
    const isMatchedName = game.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isMatchedPrice =
      maxPrice === null || parseFloat(game.price) <= maxPrice;
    return isMatchedName && isMatchedPrice;
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(parseFloat(event.target.value));
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

          <div className="w-2/3 mb-8 md:w-1/2">
            <div className="flex items-center">
              <input
                className="w-1/2 mr-2"
                type="range"
                min="1"
                max="100"
                step="0.1"
                value={maxPrice || ""}
                onChange={handleMaxPriceChange}
              />
              <span className="text-white">{`${maxPrice || 50}€`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <div className="flex flex-col items-center game" key={game._id}>
                  <Link to={`/gamepage?id=${game.gameID}`}>
                    <img
                      className="object-cover w-full h-auto"
                      src={`https://icegaming.s3.eu-central-1.amazonaws.com/${game.images[0]}`}
                      alt={game.name}
                    />
                  </Link>
                  <p className="mt-2 text-white">{game.name}</p>
                  <p className="mt-1 text-white">
                    Price: ${game.price} | Developer: {game.developerName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white">No games found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
