import React, { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { getGame, addBasket, addComment, removeComment, replaceComment } from "../services/game_service";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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
        images: [""],
        comments: [{ text: "", authorName: "", authorID: "" }]
    });
    var activeUserID: string;
    var inBasket: boolean = false;
    useEffect(() => {
        initState();
    }, [location, getAccessTokenSilently, inBasket, comment]);
const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
    const initState = async () => {
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        activeUserID = userID;
        var form = new FormData();
        form.append("UserID", userID);
        const { data, error } = await getGame(accessToken, new URLSearchParams(location).get('id'));
        console.log(data[0].comments);
        if (data[0].comments) {
            setGame(data[0])
        }
        else {
            let datatemp = data[0];
            datatemp.comments = [{ text: "s", authorName: "", authorID: "" }];
            setGame(datatemp);
        }
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
        var existingComment: boolean = false;
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        if (user?.nickname) {
            userName = user?.nickname;
        }
        for (let i = 0; i < game.comments.length; i++) {
            if (game.comments[i].authorID == userID) {
                existingComment = true;
                break;
            }
        }
        var form = new FormData();
        form.append("UserID", userID);
        form.append("GameID", game.gameID);
        form.append("UserName", userName);
        form.append("comment", comment);
        if (existingComment) {
            replaceComment(accessToken, form);
        } else {
            addComment(accessToken, form);
        }
        setComment("");
    }
    async function handleDeleteComment(event: FormEvent<HTMLFormElement>): Promise<any> {
        const accessToken = await getAccessTokenSilently();
        var userID = "";
        if (user?.sub) {
            userID = user?.sub.split("|")[1];
        }
        const tempgame = game.comments.filter(obj => obj.authorID !== userID);
        var form = new FormData();
        form.append("UserID", userID)
        form.append("GameID", game.gameID);
        form.append("comments", tempgame.toString())

        removeComment(accessToken, form);
    }
    if (game) {

        return (<div>
            <div className="flex justify-center items-start bg-[#070231] min-h-screen">
                <div className="bg-[#050125] min-h-screen w-2/3">
                    <h1 className="pt-20 text-4xl text-center text-white bg-[#283046]">{game.name}</h1>
                                <div className="container bg-[#283046] text-white p-10 box-border mx-auto flex flex-col items-start">
              <section className="w-full py-16 bg-transparent">
                <div className="container w-full text-center">
                  <Carousel
                    className="mb-10"
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    responsive={responsive}
                    ssr={false} // means to render carousel on server-side.
                    infinite={true}
                    autoPlay={false}
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                  >
                    {game.images.map((image, index) => (
                      <div className="flex justify-center px-2">
                        <img
                          key={index}
                          className="object-contain h-52"
                          src={image}
                          alt="bild"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </section>
              <div className="flex flex-row items-center justify-center w-full p-4 mt-1 ">
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
                        <div className=" w-full mt-1 p-4 flex flex-col items-center justify-start">
                            <b>Comments:</b>
                            {game.comments.map((comment, index) => (
                                <div className="w-full">
                                    <div className="w-full flex flex-row justify-between">
                                        <div className=" text-left border-b-2 border-gray-800 left-0">
                                            {comment.authorName}:
                                        </div>
                                    </div>
                                    <div className="text-left pl-3 border-b-2 ">
                                        {comment.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <form id="addCommentForm" className="w-full" >
                                <textarea onChange={(e: any) => setComment(e.target.value)}
                                    value={comment}
                                    className="peer block min-h-[auto]  rounded border-0 bg-slate-300 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark: text-neutral-700 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="commentarea"
                                    rows={4}
                                    placeholder="Your message">
                                </textarea>
                                <button
                                    onClick={(e: any) => handleAddComment(e)}
                                    type="button"
                                    className="px-2 py-2 m-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                                >add/replace comment
                                </button>
                                <button className=" px-2 py-2 m-2 text-gray-200 bg-red-900 rounded-lg disabled:bg-gray-800 disabled:text-gray-100" type="button"
                                    onClick={(e: any) => handleDeleteComment(e)}>
                                    delete comment
                                </button>
                            </form>
                        </div>
                    </div>
