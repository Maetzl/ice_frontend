import React, { useState } from "react";
import AWS from "aws-sdk";
import { useAuth0 } from "@auth0/auth0-react";
import { getProfile, updateProfile } from "../services/profile_service";
import { useLocation } from "react-router-dom";

export default function EditData() {
  let data = useLocation();
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [favoriteGame, setFavoriteGame] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const userID = user?.toString().split("|")[1] || "";
  // AWS Stuff
  const bucketName = "icegaming";
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const region = process.env.REACT_APP_AWS_REGION;
  const s3 = new AWS.S3();

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });
  const handleImageChange = (e: { target: { files: FileList | null } }) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      console.log(user?.sub);

      // Hochladen des ausgewählten Bildes
      if (user?.sub != null) {
        uploadImageToS3Profilepictures(file);
      }
    }
  };

  // Funktion zum Hochladen eines Bildes
  const uploadImageToS3Profilepictures = async (file: File) => {
    console.log(userID);
    const params = {
      Bucket: bucketName,
      Key: `profilepictures/PB${userID}`,
      ContentType: file.type,
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
      // Füge hier den Code hinzu, den du nach dem Hochladen des Bildes ausführen möchtest
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes:", error);
      // Füge hier den Code hinzu, um mit dem Fehler umzugehen
    }
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    var form = new FormData();
    form.append("Name", name);
    form.append("Description", description);
    form.append("Country", country);
    form.append("UserID", userID);
    const accessToken = await getAccessTokenSilently();

    console.log(userID);
    const { data, error } = await updateProfile(accessToken, form);

    if (data) {
    }

    if (error) {
    }
    // Hier kannst du die Daten speichern oder an den Server senden
    // ...

    // Optional: Zurück zur Profilseite nach dem Speichern
    // history.push("/profil");
  };

  const handleCountryChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCountry(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="py-4 bg-gray-800">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold text-white">Daten bearbeiten</h1>
        </div>
      </header>
      <main className="container px-4 py-8 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              placeholder={data.state.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block mb-2 text-white">
              Country
            </label>
            <select
              id="country"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              value={data.state.country}
              onChange={handleCountryChange}
            >
              <option value="">Ice Land</option>
              <option value="Germany">Germany</option>
              <option value="USA">USA</option>
              <option value="France">France</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Brazil">Brazil</option>
              <option value="China">China</option>
              <option value="India">India</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Mexico">Mexico</option>
              <option value="Netherlands">Netherlands</option>
              <option value="South Korea">South Korea</option>
              {/* Weitere Länderoptionen */}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-white">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              placeholder={data.state.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="favoriteGame" className="block mb-2 text-white">
              Lieblingsspiel
            </label>
            <input
              type="text"
              id="favoriteGame"
              className="w-full px-3 py-2 text-white bg-gray-700 border rounded-lg"
              placeholder="Dein Lieblingsspiel"
              value={favoriteGame}
              onChange={(e) => setFavoriteGame(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-white">
              Bild hochladen
            </label>
            <input
              type="file"
              id="image"
              className="text-white"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gray-800 rounded-lg"
          >
            Speichern
          </button>
        </form>
      </main>
    </div>
  );
}
