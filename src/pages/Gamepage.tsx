import React, { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame, addBasket, addComment } from "../services/game_service";
import { promises } from "dns";

export default function Gamepage() {

    const { user, getAccessTokenSilently } = useAuth0();
    const [location, setLocation] = useState(useLocation().search)
    const [comment, setComment] = useState("")
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
    var inBasket: boolean = false;
    useEffect(() => {
        initState();
    }, [location, getAccessTokenSilently, inBasket]);

    const initState = async () => {
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        var form = new FormData();
        form.append("UserID", userID);
        const { data, error } = await getGame(accessToken, new URLSearchParams(location).get('id'));
        setGame(data[0])
    };
    const handlePutInBasket = async () => {
        if (!inBasket) {
            const accessToken = await getAccessTokenSilently();
            var userID = "";
            if (user?.sub) {
                userID = user?.sub.split("|")[1];
            }
            var form = new FormData();
            form.append("UserID", userID);
            form.append("GameID", game.gameID);
            await addBasket(accessToken, form);
            inBasket = true;
        }
    }
    async function handleAddComment(event: FormEvent<HTMLFormElement>): Promise<any> {
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        var userName = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        if (user?.nickname) {
             userName = user?.nickname;
        }
        var form = new FormData();
        form.append("UserID", userID);
        form.append("GameID", game.gameID);
        form.append("UserName", userName);
        form.append("comment",comment);
        addComment(accessToken, form);
    }
    if (game) {

        return (<div>
            <div className="flex justify-center items-start bg-[#070231] min-h-screen">
                <div className="bg-[#050125] min-h-screen w-2/3">
                    <h1 className="pt-20 text-4xl text-center text-white bg-[#283046]">{game.name}</h1>
                    <div className="container bg-[#283046] text-white p-20 box-border mx-auto flex flex-col items-start">
                        <div className=" w-full content-evenly flex flex-row items-start border-2 p-4">
                            {game.images.map((image) => (
                                <img className="h-52 mr-2"
                                    src={image}
                                    alt="bild"
                                />
                            ))}
                        </div>
                        <div className=" w-full mt-1 p-4 flex flex-row items-center justify-center">
                            {game.tags.map((tag) => (
                                <span
                                    className="inline-block whitespace-nowrap rounded-[0.27rem] bg-slate-400 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700"
                                >{tag}</span>
                            ))}
                        </div>
                        <div className=" mt-5 p-4">
                            <b>Game description:</b><br />{game.description}
                        </div>
                        <div className="mt-5 p-4">
                            <b>Price:</b> {game.price} €
                        </div>
                        <button
                            type="submit"
                            onClick={handlePutInBasket}
                            disabled={inBasket}
                            className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                        >
                            Buy game
                        </button>
                        <div className="mt-5 p-4">
                            <b>Developer:</b> {game.developerName}<br />
                            <b>Release date:</b> {game.releaseDate}<br />
                        </div>
                        <div>
                            <form id="addCommentForm" >
                                <textarea onChange={(e:any)=>setComment(e.target.value)}
                                    value={comment}
                                    className="peer block min-h-[auto] w-full rounded border-0 bg-slate-300 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark: text-neutral-700 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="commentarea"
                                    rows={4}
                                    placeholder="Your message">
                                </textarea>
                                <button
                                    onClick={(e:any)=>handleAddComment(e)}
                                    type= "button"
                                    className="px-2 py-2 m-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                                >add comment
                                </button>
                            </form>
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
