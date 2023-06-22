import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function Index() {
  const { error } = useAuth0();

  return (
    <div>
      <section className="py-16 bg-gradient-to-b from-[#283046] to-blue-600">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Welcome to the Gaming Marketplace
          </h1>
          <p className="mb-8 text-lg text-gray-100">
            Discover, play, and publish games.
          </p>
          <a
            href="/store"
            className="px-6 py-3 text-lg font-bold text-white transition-colors duration-300 ease-in-out bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
          >
            Explore the Store
          </a>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-blue-600 to-[#283046]">
        <div className="container flex justify-center mx-auto mb-8">
          <div className="w-1/3 mx-auto">
            {" "}
            {/* Added mx-auto class */}
            <img
              src="https://icegaming.s3.eu-central-1.amazonaws.com/LandingPage/GodOfWarRagnaroek_Aufmacher-11c9da9ce44e5ef0.png"
              alt="Game 1"
              className="object-cover h-64 mb-4 rounded-lg"
            />
            <h2 className="mb-4 text-2xl font-bold">
              Find Your Favorite Games
            </h2>
            <p className="text-lg text-white">
              Explore a vast collection of games in our store and add them to
              your library.
            </p>
          </div>
          <div className="w-1/3 mx-auto">
            {" "}
            {/* Added mx-auto class */}
            <img
              src="https://icegaming.s3.eu-central-1.amazonaws.com/LandingPage/eldenring.jpg"
              alt="Game 2"
              className="object-cover h-64 mb-4 rounded-lg"
            />
            <h2 className="mb-4 text-2xl font-bold">Publish Your Games</h2>
            <p className="text-lg text-white">
              Share your own games with the gaming community and reach a wide
              audience.
            </p>
          </div>
          <div className="w-1/3 mx-auto">
            {" "}
            {/* Added mx-auto class */}
            <img
              src="https://icegaming.s3.eu-central-1.amazonaws.com/LandingPage/armored-core-6-ankuendigung_6209199-840x480.jpg"
              alt="Game 3"
              className="object-cover h-64 mb-4 rounded-lg"
            />
            <h2 className="mb-4 text-2xl font-bold">Connect with Gamers</h2>
            <p className="text-lg text-white">
              Interact with other gamers, join communities, and discover new
              gaming experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
