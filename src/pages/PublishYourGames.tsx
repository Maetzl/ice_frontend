import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame, createGame } from "../services/game_service";
import AWS from "aws-sdk";

export default function PublishYourGames() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [priceError, setPriceError] = useState<string>("");
  const [developerName, setDeveloperName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [imgLink, setImgLink] = useState("");
  const bucketName = "icegaming";
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const region = process.env.REACT_APP_AWS_REGION;
  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });
  const s3 = new AWS.S3();

  useEffect(() => {
    setIsFormValid(
      gameName.trim().length > 0 &&
        gameDescription.trim().length > 0 &&
        !isNaN(price)
    );
  }, [gameName, gameDescription, price]);

  const publishGame = async (e: { preventDefault: () => void }) => {
    if (!user || !selectedImage || !isFormValid) {
      console.error(
        "Error: Please ensure all fields are filled in correctly and try again."
      );
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const userID = user.sub?.split("|")[1] || "";
      const gameID = generateUniqueGameID();
      setImgLink(`games/${gameID}`);
      uploadImageToS3games(gameID, selectedImage);

      var form = new FormData();
      form.append("GameID", gameID);
      form.append("Name", gameName);
      form.append("Description", gameDescription);
      form.append("Price", price.toString());
      form.append("DeveloperID", userID);
      form.append("Images", [imgLink, "link2", "link3"].toString());
      form.append("Tags", ["Survival", "Multiplayer", "Action"].toString());
      form.append("ReleaseDate", "a date idk");

      const { data, error } = await createGame(accessToken, form);
      console.log("Game data successfully uploaded.");
      // redirect here TODO NAVIGATE
    } catch (error) {
      console.error("Error uploading game data or image:", error);
      // Handle the error
    }
  };

  function generateUniqueGameID() {
    const timestamp = new Date().getTime();
    const uniqueID = `${gameName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${timestamp}`;
    return uniqueID;
  }

  const handleImageChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
    }
  };

  const uploadImageToS3games = async (
    gameID: string,
    selectedFile: File | null
  ) => {
    setImgLink(`games/${gameID}`);
    const params = {
      Bucket: bucketName,
      Key: `games/${gameID}`,
      ContentType: selectedFile?.type,
      Expires: 120,
    };

    try {
      const uploadURL = await s3.getSignedUrlPromise("putObject", params);
      console.log("Bild erfolgreich hochgeladen:", uploadURL);

      // Hochladen des Bildes mithilfe der generierten Upload-URL
      await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
      });

      console.log("Bild erfolgreich hochgeladen.");
      // Füge hier den Code hinzu, den du nach dem Hochladen des Bildes ausführen möchtest
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes:", error);
      // Füge hier den Code hinzu, um mit dem Fehler umzugehen
    }
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPrice = parseFloat(e.target.value);
    console.log("Hieer", inputPrice);
    if (isNaN(inputPrice)) {
      setPriceError("Please enter a valid number for the price.");
      setPrice(0);
    } else {
      setPrice(inputPrice);
      setPriceError("");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handle Submit here");
    try {
      await publishGame(e);
      // Optionally, you can perform any additional actions after successful form submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error
    }
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
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gameDescription" className="block mb-2 text-white">
              Game Description
            </label>
            <textarea
              id="gameDescription"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block mb-2 text-white">
              Price in €
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={handlePriceChange}
              step="0.01"
              style={{ backgroundColor: "black", color: "white" }}
            />
            {priceError && <p>{priceError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="developerName" className="block mb-2 text-white">
              Developer Name
            </label>
            <input
              type="text"
              id="developerName"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gameImage" className="block mb-2 text-white">
              Game Image
            </label>
            <input
              type="file"
              id="gameImage"
              className="text-white"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!isFormValid}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gray-800 rounded-lg"
            disabled={!isFormValid}
          >
            Publish Game
          </button>
        </form>
      </main>
    </div>
  );
}
