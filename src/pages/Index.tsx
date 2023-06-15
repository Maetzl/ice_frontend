import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function Index() {
  const { error } = useAuth0();

  return (
    <div>
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Gaming Marketplace
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Discover, play, and publish games.
          </p>
          <a
            href="/store"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg"
          >
            Explore the Store
          </a>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="flex justify-center mb-8">
          <div className="w-1/3">
            <img
              src="/path/to/game1.jpg"
              alt="Game 1"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-4">
              Find Your Favorite Games
            </h2>
            <p className="text-lg text-gray-700">
              Explore a vast collection of games in our store and add them to
              your library.
            </p>
          </div>
          <div className="w-1/3">
            <img
              src="/path/to/game2.jpg"
              alt="Game 2"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-4">Publish Your Games</h2>
            <p className="text-lg text-gray-700">
              Share your own games with the gaming community and reach a wide
              audience.
            </p>
          </div>
          <div className="w-1/3">
            <img
              src="/path/to/game3.jpg"
              alt="Game 3"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-4">Connect with Gamers</h2>
            <p className="text-lg text-gray-700">
              Interact with other gamers, join communities, and discover new
              gaming experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
