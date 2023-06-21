import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame } from "../services/game_service";

export default function Gamepage() {

    const { user, getAccessTokenSilently } = useAuth0();
    const [location, setLocation] = useState(useLocation().search)
    const [game, setGame] = useState({
        name: "",
        description: "",
        price: "",
        developerName: "",
        developerID: "",
        releaseDate: "",
        tags: [""],
        gameID: "",
        images: [""]
    });

    useEffect(() => {
        initState();
    }, [location, getAccessTokenSilently]);

    const initState = async () => {
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        var form = new FormData();
        form.append("UserID", userID);
        const { data, error } = await getGame(accessToken, new URLSearchParams(location).get('id'));
        console.log("data", data);
        setGame(data[0])
        console.log("game", game);
    };

    if (game) {
        console.log("Gamename", game.name)
        return (<div>
            <div className="flex justify-center items-start bg-[#070231] min-h-screen">
                <div className="bg-[#050125] min-h-screen w-2/3">
                    <h1 className="pt-20 text-4xl text-center text-white bg-[#283046]">{game.name}</h1>
                    <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-start">
                        <div className=" w-full content-evenly">
                            <img
                                src={game.images[0]}
                                alt="Profilbild"
                            />
                            <img
                                src={game.images[1]}
                                alt="Profilbild"
                            />
                        </div>
                        <div className="mt-16">
                            {game.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    } else
        return (
            <div>
                Es ist ein Fehler aufgetreten. bitte Lade die Seite neu oder nehme
                Kontakt mit den Entwicklern auf.
            </div>
        );
}
