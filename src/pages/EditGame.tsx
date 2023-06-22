import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame, createGame, editGame } from "../services/game_service";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditGame() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [game, setGame] = useState({
    name: "",
    description: "",
    price: 0,
    gameID: "",
  });

  const [priceError, setPriceError] = useState<string>("");
  //const [selectedImages, setSelectedImage] = useState<File[] | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tempTag, setTempTag] = useState("");
  const [tagError, setTagError] = useState<string>("");

  const currentDate = new Date();

  const location = useLocation();

  useEffect(() => {
    const getState = async () => {
      setGame(location.state.game);
      setTags(location.state.game.tags);
    };
    getState();
  }, [location]);

  useEffect(() => {
    setIsFormValid(
      game.name.trim().length > 0 &&
        game.description.trim().length > 0 &&
        !isNaN(game.price) &&
        game.price >= 0
    );
  }, [game]);

  const editGameHandle = async (e: { preventDefault: () => void }) => {
    if (!user || !isFormValid) {
      console.log(user, isFormValid);
      console.error(
        "Error: Please ensure all fields are filled in correctly and try again."
      );
      return;
    }

    console.log(user, user.sub, isFormValid);
    try {
      const accessToken = await getAccessTokenSilently();
      const userID = user.sub?.split("|")[1] || "";
      const gameID = game.gameID;
      //const links = (await uploadImageToS3games(gameID, selectedImages)) || "";
      const date = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;

      var form = new FormData();
      form.append("GameID", gameID);
      form.append("Name", game.name);
      form.append("Description", game.description);
      form.append("Price", game.price.toString());
      form.append("DeveloperID", userID);
      form.append("Tags", tags.toString());
      form.append("ReleaseDate", date);

      const { data, error } = await editGame(accessToken, form);

      console.log("Game data successfully uploaded.");
      navigate(`/gamepage?id=${gameID}`);
      // redirect here TODO NAVIGATE
    } catch (error) {
      console.error("Error uploading game data or image:", error);
      // Handle the error
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPrice = parseFloat(e.target.value);
    if (isNaN(inputPrice)) {
      setPriceError("Please enter a valid number for the price.");
      setGame((prev) => ({ ...prev, price: 0 }));
    } else if (inputPrice < 0) {
      setPriceError("Price can't be lower than 0");
      setGame((prev) => ({ ...prev, price: inputPrice }));
    } else {
      setPriceError("");
      setGame((prev) => ({ ...prev, price: inputPrice }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handle Submit here");
    try {
      await editGameHandle(e);
      // Optionally, you can perform any additional actions after successful form submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    setTempTag(tag);
  };

  function handleDeleteTag(index: number): void {
    const updatedTags = [...tags];
    // Entferne das Tag mit dem angegebenen Index
    updatedTags.splice(index, 1);
    // Aktualisiere den State mit dem aktualisierten Tags-Array
    setTags(updatedTags);
  }

  function handleAddTag(): void {
    if (tags.length > 9) {
      setTagError("Too many tags. Maximum tag count is 10.");
      setTempTag("");
      return;
    }

    if (tempTag.trim() != "") {
      const tagExists = tags.find(
        (tag) => tag.toLowerCase() === tempTag.toLowerCase()
      );

      if (tagExists) {
        // Wenn das Tag bereits vorhanden ist, füge hier die entsprechende Logik hinzu
        setTagError("Tag already exists");
        setTempTag("");
      } else {
        // Füge das Tag dem Array hinzu
        setTagError("");
        setTags([...tags, tempTag]);
        setTempTag("");
      }
    }
  }

  const handleKeyDownTag = (e: { key: string }) => {
    if (e.key === "Enter") {
      // Methode ausführen, wenn Enter gedrückt wird
      handleAddTag();
    }
  };

  const handleOnChange = (e: any) => {
    setGame((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="py-4 bg-gray-800">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold text-white">Publish Your Game</h1>
        </div>
      </header>
      <main className="container px-4 py-8 mx-auto">
        <form id="publishGameForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gameName" className="block mb-2 text-white">
              Game Name
            </label>
            <input
              type="text"
              id="gameName"
              name="name"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={game.name}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gameDescription" className="block mb-2 text-white">
              Game Description
            </label>
            <textarea
              id="gameDescription"
              name="description"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={game.description}
              onChange={handleOnChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block mb-2 text-white">
              Price in €
            </label>
            <input
              type="number"
              id="price"
              value={game.price}
              onChange={handlePriceChange}
              step="0.01"
              className="text-white pl-1 bg-gray-700 border rounded-lg"
            />
            {priceError && <p className="text-red-500">{priceError}</p>}
          </div>
          <div className="mb-4 space-y-1">
            <label htmlFor="tagInput" className="block mb-2 text-white">
              Tags
            </label>
            <div className="space-x-1">
              <input
                id="tagInput"
                onChange={handleTagChange}
                onKeyDown={handleKeyDownTag}
                value={tempTag}
                className="text-white pl-1 bg-gray-700 border rounded-lg"
              ></input>
              <button
                id="addTag"
                type="button"
                className="px-2 text-white  bg-gray-700 border rounded-lg"
                onClick={() => handleAddTag()}
              >
                Add Tag
              </button>
            </div>
            <div className="space-x-1">
              {tags.map((singleTag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDeleteTag(index)}
                  className="px-2 py-1 text-white  bg-gray-700 border rounded-lg"
                >
                  <span>{singleTag}</span>
                </button>
              ))}
            </div>
            {tagError && <p className="text-red-500">{tagError}</p>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-gray-800 hover:bg-gray-200 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
            disabled={!isFormValid}
          >
            Edit Game
          </button>
        </form>
      </main>
    </div>
  );
}
