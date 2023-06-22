import React, { useEffect, useState } from "react";
import "../App.css";
import { getAllGames } from "../services/game_service";
import { useAuth0 } from "@auth0/auth0-react";
import {
  buyBasket,
  getBasket,
  removeBasket,
} from "../services/profile_service";
import { useNavigate } from "react-router-dom";

const Basket: React.FC = () => {
  const [myGames, setmyGames] = useState([
    { name: "", description: "", price: 0, gameID: "", images: [] },
  ]);
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    initState();
  }, [getBasket, getAccessTokenSilently]);

  const initState = async () => {
    const accessToken = await getAccessTokenSilently();
    var userID = "";
    if (user?.sub) {
      userID = user?.sub.split("|")[1];
    }
    var form = new FormData();
    form.append("UserID", userID);
    const { data, error } = await getBasket(accessToken, form);
    if (data) {
      setmyGames(data);
    }
  };

  async function handleRemoveGame(gameID: string): Promise<any> {
    let data = myGames.filter((obj) => obj.gameID !== gameID);
    setmyGames(data);
    const accessToken = await getAccessTokenSilently();
    var userID = "";
    if (user?.sub) {
      userID = user?.sub.split("|")[1];
    }
    var form = new FormData();
    form.append("GameID", gameID);
    form.append("UserID", userID);
    removeBasket(accessToken, form);
  }

  const handleBuyGames = async () => {
    const accessToken = await getAccessTokenSilently();
    var userID = "";
    if (user?.sub) {
      userID = user?.sub.split("|")[1];
    }
    var form = new FormData();
    form.append("UserID", userID);
    await buyBasket(accessToken, form);
    navigate("/");
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gradient-to-b from-blue-600 to-[#283046]">
      <div className="bg-gradient-to-b from-blue-600 to-[#283046]  min-h-screen w-2/3">
        <div className="container bg-[#283046] text-white p-10 box-border mx-auto flex flex-col items-center">
          <h1 className="mt-0 text-4xl">Basket</h1>
        </div>
        <div className="container bg-[#283046] text-white px-20 py-10 box-border mx-auto flex flex-col items-start">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {myGames.map((game, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 overflow-hidden">
                      <img
                        src={game.images[0]}
                        alt={game.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">{game.name}</td>
                  <td className="px-6 py-4">{game.description}</td>
                  <td className="px-6 py-4">{`${game.price}€`}</td>
                  <td className="px-6 py-4">
                    <button
                      id="addTag"
                      type="button"
                      className="px-4 py-2 text-white transition duration-300 bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600"
                      onClick={() => handleRemoveGame(game.gameID)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            id="buy"
            type="button"
            className="px-4 py-2 mt-4 text-white transition duration-300 bg-gray-700 border border-gray-700 rounded-lg hover:bg-gray-600"
            onClick={handleBuyGames}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Basket;
