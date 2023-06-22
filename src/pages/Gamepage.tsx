import React, { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import fileDownload from "js-file-download";
import {
  getGame,
  addBasket,
  addComment,
  removeComment,
  replaceComment,
} from "../services/game_service";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getProfile } from "../services/profile_service";

export default function Gamepage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [location, setLocation] = useState(useLocation().search);
  const [comment, setComment] = useState("");
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
    comments: [{ text: "", authorName: "", authorID: "" }],
  });
  var activeUserID: string;
  var inBasket: boolean = false;
  const [hasGame, setHasGame] = useState(false);
  //var hasGame: boolean = false;

  useEffect(() => {
    const initState = async () => {
      const accessToken = await getAccessTokenSilently();
      var userID = "";
      if (user?.sub) {
        userID = user?.sub.split("|")[1];
      }
      activeUserID = userID;
      var form = new FormData();
      form.append("UserID", userID);
      const { data, error } = await getGame(
        accessToken,
        new URLSearchParams(location).get("id")
      );

      console.log("51", userID, form);
      const userData = await getProfile(accessToken, form);

      if (data[0].comments) {
        setGame(data[0]);
      } else {
        let datatemp = data[0];
        datatemp.comments = [{ text: "___", authorName: "", authorID: "" }];
        setGame(datatemp);
      }

      if (userData.data.games) {
        for (let i = 0; i < userData.data.games.length; i++) {
          console.log("before if", userData.data.games[i], game.gameID);
          if (userData.data.games[i] == game.gameID) {
            console.log("true", userData.data.games[i], game.gameID);
            setHasGame(true);
            break;
          }
        }
      }
    };

    initState();
  }, [location, getAccessTokenSilently, inBasket, comment, setComment]);

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
  };
  async function handleAddComment(
    event: FormEvent<HTMLFormElement>
  ): Promise<any> {
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
  async function handleDeleteComment(
    event: FormEvent<HTMLFormElement>
  ): Promise<any> {
    const accessToken = await getAccessTokenSilently();
    var userID = "";
    if (user?.sub) {
      userID = user?.sub.split("|")[1];
    }
    const tempgame = game.comments.filter((obj) => obj.authorID !== userID);
    var form = new FormData();
    form.append("UserID", userID);
    form.append("GameID", game.gameID);
    form.append("comments", tempgame.toString());

    removeComment(accessToken, form);
    setComment("");
  }

  //`https://icegaming.s3.eu-central-1.amazonaws.com/games/${game.gameID}/${game.gameID}.exe`

  const downloadFile = async () => {
    const fileUrl = `https://icegaming.s3.eu-central-1.amazonaws.com/games/${game.gameID}/${game.gameID}.exe`; // Die URL der herunterzuladenden Datei
    console.log(fileUrl);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Game.exe"; // Der Name der heruntergeladenen Datei
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Fehler beim Herunterladen der Datei:", error);
    }
  };

  if (game) {
    return (
      <div className="flex justify-center items-start bg-gradient-to-b from-blue-600 to-[#283046] min-h-screen">
        <div className="bg-[#050125] min-h-screen w-2/3">
          <h1 className="pt-20 text-4xl text-center text-white bg-[#283046]">
            {game.name}
          </h1>
          <div className="container bg-[#283046] text-white p-10 box-border mx-auto flex flex-col items-start">
            <section className="w-full py-16 bg-transparent">
              <div className="container w-full text-center">
                <Carousel
                  className="mb-10"
                  swipeable={false}
                  draggable={false}
                  showDots={true}
                  responsive={responsive}
                  ssr={false}
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
                    <div className="flex justify-center px-2" key={index}>
                      <img
                        className="object-contain h-52"
                        src={image}
                        alt="bild"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </section>
            <div className="flex flex-col items-center justify-center w-full mt-1">
              <div className="flex flex-row items-center justify-center w-full mt-1">
                {game.tags.map((tag, index) => (
                  <span
                    className="inline-block whitespace-nowrap rounded-[0.27rem] m-1 bg-slate-400 px-[0.65em] pb-[0.25em] p-10 pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700"
                    key={index}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-4 mt-5">
                <b>Game description:</b>
                <br />
                {game.description}
              </div>
            </div>
            <div className="p-4 mt-5">
              <b>Price:</b> {game.price} €
            </div>
            <td>
              <tr>
                <th>
                  <button
                    type="submit"
                    onClick={handlePutInBasket}
                    disabled={inBasket}
                    className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                  >
                    Buy game
                  </button>
                </th>
                {hasGame ? (
                  <th>
                    <button
                      type="submit"
                      onClick={downloadFile}
                      className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                    >
                      Download Game
                    </button>
                  </th>
                ) : null}
              </tr>
            </td>
            <div className="p-4 mt-5">
              <b>Developer:</b> {game.developerName}
              <br />
              <b>Release date:</b> {game.releaseDate}
              <br />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full p-4 mt-1 bg-[#283046] text-white">
            <b>Comments:</b>
            {game.comments.map((comment, index) => (
              <div className="w-full" key={index}>
                <div className="flex flex-row justify-between w-full">
                  <div className="left-0 text-left border-b-2 border-gray-800">
                    {comment.authorName}:
                  </div>
                </div>
                <div className="pl-3 text-left border-b-2">{comment.text}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#283046]">
            <form id="addCommentForm" className="flex justify-center w-full">
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="peer block min-h-[auto] w-3/5 rounded border-0 bg-slate-300 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark: text-neutral-700 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="commentarea"
                rows={4}
                placeholder="Your message"
              ></textarea>
              <div>
                <button
                onClick={(e: any) => handleAddComment(e)}
                type="button"
                className="px-2 py-2 m-2 w-64 h-9 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
              >
                add/replace comment
              </button>
              <button
                className="px-2 py-2 m-2 w-48 h-9 text-gray-200 bg-red-900 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
                type="button"
                onClick={(e: any) => handleDeleteComment(e)}
              >
                delete comment
              </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>fehler!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>;
  }
}
