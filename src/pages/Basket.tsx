
import React, { useEffect, useState } from "react";
import "../App.css";
import { getAllGames } from "../services/game_service";
import { useAuth0 } from "@auth0/auth0-react";
import { buyBasket, getBasket, removeBasket } from "../services/profile_service";
import { useNavigate } from "react-router-dom";

const Basket: React.FC = () => {
    const [myGames, setmyGames] = useState([{ name: "", description: "", price: 0, gameID:"" }]);
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
        let data = myGames.filter(obj => obj.gameID !== gameID);
        setmyGames(data);
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        var form = new FormData();
        form.append("GameID", gameID);
        form.append("UserID", userID);
        removeBasket(accessToken, form)
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
    }

    return (
        <div className="flex justify-center items-start bg-[#070231] min-h-screen">
            <div className="bg-[#050125] min-h-screen w-2/3">
                <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-center">
                    <h1 className="mt-20 text-4xl">Basket</h1>
                </div>
                <div className="container bg-[#283046] text-white px-20 box-border mx-auto flex flex-col items-start">

                    <table className="table-auto border-spacing-5 w-3/4">
                        <thead>
                            <tr>
                                <th className="text-left">Name</th>
                                <th className="text-left">Description</th>
                                <th className="text-left">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myGames.map((game, index) => (
                                <tr key={index}>
                                    <td>{game.name}</td>
                                    <td>{game.description}</td>
                                    <td>{game.price}</td>
                                    <td><button id="addTag"
                                        type="button"
                                        className="px-2 text-white  bg-gray-700 border rounded-lg"
                                        onClick={() => handleRemoveGame(game.gameID)}
                                    >remove</button>
                                        </td>
                                </tr>))}
                        </tbody>
                    </table>
                    <button id="buy"
                                        type="button"
                                        className="px-2 text-white  bg-gray-700 border rounded-lg"
                                        onClick={handleBuyGames}
                                    >Buy</button>
                </div>
            </div>
        </div>
    );
};

export default Basket;
