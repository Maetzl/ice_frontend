
import React, { useEffect, useState } from "react";
import "../App.css";
import { getAllGames } from "../services/game_service";
import { useAuth0 } from "@auth0/auth0-react";
import { getBasket } from "../services/profile_service";

const Basket: React.FC = () => {
    const [myGames, setmyGames] = useState([{name: "Game 1", description: "Game 1des", price: 11}]);
    const { user, getAccessTokenSilently } = useAuth0();
    //Use Effect benutzen für backend
    useEffect(() => {
        let isMounted = true;
        const getMessage = async () => {
            const accessToken = await getAccessTokenSilently();
            const { data, error } = await getBasket(accessToken);
            console.log("data", data);
            setmyGames(data)            /*
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
    }, [getBasket, getAccessTokenSilently]);

    return (
        <div className="flex justify-center items-start bg-[#070231] min-h-screen">
            <div className="bg-[#050125] min-h-screen w-2/3">
                <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-center">
                <h1 className="mt-20 text-4xl">Basket</h1>

                </div>
                <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-start">

                        <table className="table-auto border-spacing-5 w-3/4">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myGames.map((game) => (
                                    <tr>
                                        <td>{game.name}</td>
                                        <td>{game.description}</td>
                                        <td>{game.price}</td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
};

export default Basket;
