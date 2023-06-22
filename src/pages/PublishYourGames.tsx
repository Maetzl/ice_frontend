import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getGame, createGame } from "../services/game_service";
import AWS from "aws-sdk";

export default function PublishYourGames() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [game, setGame] = useState({ name: "", description: "", price: 0 });

  const [priceError, setPriceError] = useState<string>("");
  const [selectedImages, setSelectedImage] = useState<File[] | null>(null);
  const [selectedExe, setSelectedExe] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessageImg, setErrorMessageImg] = useState("");
  const [errorMessageExe, setErrorMessageExe] = useState("");
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
      game.name.trim().length > 0 &&
        game.description.trim().length > 0 &&
        !isNaN(game.price) &&
        game.price >= 0 &&
        selectedImages != null &&
        selectedImages.length > 0 &&
        selectedImages.length <= 7 &&
        selectedExe != null
    );
  }, [game, selectedImages, selectedExe]);

  const publishGame = async (e: { preventDefault: () => void }) => {
    if (!user || !selectedImages || !isFormValid || !selectedExe) {
      console.log(user, selectedImages, !selectedExe, isFormValid);
      console.error(
        "Error: Please ensure all fields are filled in correctly and try again."
      );
      return;
    }

    console.log(user, user.sub, selectedImages, isFormValid);
    try {
      const accessToken = await getAccessTokenSilently();
      const userID = user.sub?.split("|")[1] || "";
      const gameID = generateUniqueGameID();
      const links =
        (await uploadToS3games(gameID, selectedImages, selectedExe)) || "";
      const date = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;

      var form = new FormData();
      form.append("GameID", gameID);
      form.append("Name", game.name);
      form.append("Description", game.description);
      form.append("Price", game.price.toString());
      form.append("DeveloperID", userID);
      form.append("Images", links.toString());
      form.append("Tags", tags.toString());
      form.append("ReleaseDate", date);

      console.log("Image Links: ", links);

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
    const uniqueID = `${game.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${timestamp}`;
    return uniqueID;
  }

  const handleImagesChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 7) {
        setErrorMessageImg("Maximum picture count is 7");
        setSelectedImage(null);
        return;
      }
      setErrorMessageImg("");

      for (let i = 0; i < e.target.files.length; i++) {
        if (!e.target.files[i].type.includes("image")) {
          setErrorMessageImg("You can upload only image files");
          setSelectedImage(null);
          return;
        }
      }

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

  const handleExeChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length != 1) {
        setErrorMessageExe("You can only upload one .exe");
        setSelectedExe(null);
        return;
      }
      if (
        e.target.files[0].name.split(".")[
          e.target.files[0].name.split(".").length - 1
        ] != "exe"
      ) {
        setErrorMessageExe("You can only upload .exe");
        setSelectedExe(null);
        return;
      }

      setErrorMessageExe("");

      let fileNumber = 0;
      const files = e.target.files[0];

      setSelectedExe(files);
    } else {
      setSelectedExe(null);
    }
  };

  const uploadToS3games = async (
    gameID: string,
    selectedFiles: File[],
    executable: File
  ): Promise<string[] | undefined> => {
    const updatedImgLink = [];

    // Unnötige Ifs da davor schon gehandled
    // if (!selectedFiles) return;

    //if (selectedFiles.length > 7) {
    //  console.error("Maximum picture count is 7");
    //  return;
    //}
    const params = {
      Bucket: bucketName,
      Key: `games/${gameID}/${gameID}.exe`,
      ContentType: executable?.type,
      Expires: 120,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    await fetch(uploadURL, {
      method: "PUT",
      body: executable,
    });
    console.log("Exe erfolgreich hochgeladen:", uploadURL);

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
        updatedImgLink.push(
          `https://icegaming.s3.eu-central-1.amazonaws.com/games/${gameID}/${file.name}`
        );
        // Füge hier den Code hinzu, den du nach dem Hochladen des Bildes ausführen möchtest
      } catch (error) {
        console.error("Fehler beim Hochladen des Bildes:", error);
        // Füge hier den Code hinzu, um mit dem Fehler umzugehen
      }
    }
    return updatedImgLink;
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

  const handleOnChange = (e: any) => {
    setGame((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-[#283046]">
      <header className="py-4 bg-gray-800">
        <div className="container flex justify-center px-4 mx-auto">
          <h1 className="text-2xl font-bold text-white">Publish Your Game</h1>
        </div>
      </header>
      <main className="flex justify-center px-4 py-8 mx-auto ">
        <form
          className="justify-center"
          id="publishGameForm"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 ">
            <label htmlFor="gameName" className="block mb-2 text-white">
              Game Name
            </label>
            <input
              type="text"
              id="gameName"
              name="name"
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96 focus:outline-none focus:ring focus:border-blue-300"
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
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96 focus:outline-none focus:ring focus:border-blue-300"
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
              className="pl-1 text-white bg-gray-700 border rounded-lg"
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
                className="pl-1 text-white bg-gray-700 border rounded-lg"
              ></input>
              <button
                id="addTag"
                type="button"
                className="px-2 text-white hover:bg-gray-600 bg-gray-700 border rounded-lg"
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
                  className="px-2 py-1 text-white bg-gray-700 border rounded-lg"
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
            {errorMessageImg && (
              <p className="text-red-500">{errorMessageImg}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="gameExe" className="block mb-2 text-white">
              Game Executable
            </label>
            <input
              type="file"
              id="gameExe"
              className="text-white"
              accept=".exe"
              onChange={handleExeChange}
            />
            {errorMessageExe && (
              <p className="text-red-500">{errorMessageExe}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-gray-800 hover:bg-gray-200 bg-gray-300 rounded-lg disabled:bg-gray-800 disabled:text-gray-100"
            disabled={!isFormValid}
          >
            Publish Game
          </button>
        </form>
      </main>
    </div>
  );
}
