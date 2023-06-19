import React, { useRef, useState } from "react";
import "../App.css";
import iceLogo from "../iceLogo.png";

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

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Game Store</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="grid">
          {filteredGames.map((game) => (
            <div key={game.id} className="game">
              <img
                src={
                  "https://icegaming.s3.eu-central-1.amazonaws.com/logo/iceLogo.png"
                }
                alt="Placeholder"
              />
              <h3>{game.name}</h3>
            </div>
          ))}
        </div>
        <footer className="footer">
          © 2023 Game Store. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Store;
