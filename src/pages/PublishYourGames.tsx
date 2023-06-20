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
  const [selectedImages, setSelectedImage] = useState<File[] | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [imgLinks, setImgLinks] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tempTag, setTempTag] = useState("");
  const [tagError, setTagError] = useState<string>("");
  const bucketName = "icegaming";
  const currentDate = new Date();
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
        !isNaN(price) &&
        price >= 0 &&
        selectedImages != null &&
        selectedImages.length > 0 &&
        selectedImages.length <= 7
    );
  }, [gameName, gameDescription, price, selectedImages]);

  const publishGame = async (e: { preventDefault: () => void }) => {
    if (!user || !selectedImages || !isFormValid) {
      console.error(
        "Error: Please ensure all fields are filled in correctly and try again."
      );
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const userID = user.sub?.split("|")[1] || "";
      const gameID = generateUniqueGameID();
      await uploadImageToS3games(gameID, selectedImages);
      const date = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;

      var form = new FormData();
      form.append("GameID", gameID);
      form.append("Name", gameName);
      form.append("Description", gameDescription);
      form.append("Price", price.toString());
      form.append("DeveloperID", userID);
      form.append("Images", imgLinks.toString());
      form.append("Tags", tags.toString());
      form.append("ReleaseDate", date);

      console.log(imgLinks);

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

  const handleImagesChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 7) {
        setErrorMessage("Es können maximal 7 Bilder hochgeladen werden.");
        return;
      }
      setErrorMessage("");

      let fileNumber = 0;
      const files =
        e.target.files instanceof FileList
          ? Array.from(e.target.files).map((file) => {
              const newName = `${fileNumber++}`;
              return new File([file], newName, { type: file.type });
            })
          : e.target.files;

      setSelectedImage(files);
    } else {
      setSelectedImage(null);
    }
  };

  const uploadImageToS3games = async (
    gameID: string,
    selectedFiles: File[] | null
  ) => {
    const updatedImgLink = [];

    if (!selectedFiles) return;

    if (selectedFiles.length > 7) {
      console.error("Es können maximal 7 Bilder hochgeladen werden.");
      return;
    }

    for (const file of selectedFiles) {
      const params = {
        Bucket: bucketName,
        Key: `games/${gameID}/${file.name}`,
        ContentType: file?.type,
        Expires: 120,
      };

      try {
        const uploadURL = await s3.getSignedUrlPromise("putObject", params);

        console.log("Bild erfolgreich hochgeladen:", uploadURL);

        // Hochladen des Bildes mithilfe der generierten Upload-URL
        await fetch(uploadURL, {
          method: "PUT",
          body: file,
        });

        console.log("Bild erfolgreich hochgeladen.");
        updatedImgLink.push(uploadURL);
        // Füge hier den Code hinzu, den du nach dem Hochladen des Bildes ausführen möchtest
      } catch (error) {
        console.error("Fehler beim Hochladen des Bildes:", error);
        // Füge hier den Code hinzu, um mit dem Fehler umzugehen
      }
    }
    console.log("updated Links", updatedImgLink);
    setImgLinks(updatedImgLink);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPrice = parseFloat(e.target.value);
    if (isNaN(inputPrice)) {
      setPriceError("Please enter a valid number for the price.");
      setPrice(0);
    } else if (inputPrice < 0) {
      setPriceError("Price can't be lower than 0");
      setPrice(inputPrice);
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
              className="text-white pl-1 bg-gray-700 border rounded-lg"
            />
            {priceError && <p className="text-red-500">{priceError}</p>}
          </div>
          <div className="mb-4 space-y-1">
            <label htmlFor="service" className="block mb-2 text-white">
              Tags
            </label>
            <div className="space-x-1">
              <input
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
          <div className="mb-4">
            <label htmlFor="gameImage" className="block mb-2 text-white">
              Game Image
            </label>
            <input
              type="file"
              id="gameImage"
              className="text-white"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
            disabled={!isFormValid}
          >
            Publish Game
          </button>
        </form>
      </main>
    </div>
  );
}
