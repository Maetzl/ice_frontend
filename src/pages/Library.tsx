import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getLibrary } from "../services/library_service";

export default function Library() {

  const { user, getAccessTokenSilently } = useAuth0();
  const [library, setLibrary] = useState([{name: String, description: String, price: Number}]);

  useEffect(() => {
    const initState = async () => {
        const accessToken = await getAccessTokenSilently();
        const { data, error } = await getLibrary(accessToken);
        console.log("data", data);
        setLibrary(data)
    };
    initState();
}, [getAccessTokenSilently]);


  return <div>
    <div className="w-96">
  <button
    aria-current="true"
    type="button"
    className="block w-full cursor-pointer rounded-lg bg-primary-100 p-4 text-left text-primary-600">
    The current button
  </button>
  <button
    type="button"
    className="block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200">
    A second button item
  </button>
  <button
    type="button"
    className="block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200">
    A third button item
  </button>
  <button
    type="button"
    className="block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200">
    A fourth button item
  </button>
  </div>
</div>;
}
