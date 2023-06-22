import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame, addBasket } from "../services/game_service";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
export default function Gamepage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [location, setLocation] = useState(useLocation().search);
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
  });
  var inBasket: boolean = false;
  useEffect(() => {
    initState();
  }, [location, getAccessTokenSilently, inBasket]);
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
    var form = new FormData();
    form.append("UserID", userID);
    const { data, error } = await getGame(
      accessToken,
      new URLSearchParams(location).get("id")
    );
    setGame(data[0]);
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

  if (game) {
    return (
      <div>
        <div className="flex justify-center items-start bg-gradient-to-b from-blue-600 to-[#283046] min-h-screen">
          <div className="bg-[#050125] min-h-screen w-2/3">
            <h1 className="pt-20 text-4xl text-center text-white bg-[#283046]">
              {game.name}
            </h1>
            <div className="container bg-[#283046] text-white p-10 box-border mx-auto flex flex-col items-start">
              <section className="w-full py-16 bg-transparent">
                <div className="container w-full text-center">
                  <h1 className="mb-4 text-2xl font-bold">
                    ANGESAGT UND EMPFOHLEN
                  </h1>

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
                {game.tags.map((tag) => (
                  <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-slate-400 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-4 mt-5 ">
                <b>Game description:</b>
                <br />
                {game.description}
              </div>
              <div className="p-4 mt-5">
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
              <div className="p-4 mt-5">
                <b>Developer:</b> {game.developerName}
                <br />
                <b>Release date:</b> {game.releaseDate}
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div>
        Es ist ein Fehler aufgetreten. bitte Lade die Seite neu oder nehme
        Kontakt mit den Entwicklern auf.
      </div>
    );
}
