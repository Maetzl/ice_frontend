import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./pages/Store";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import PublishYourGames from "./pages/PublishYourGames";
import Contact from "./pages/Contact";
import Placeholder from "./pages/Placeholder";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <div className="bg-black md:bg-white">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/store" element={<Store />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/publish" element={<PublishYourGames />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/placeholder" element={<Placeholder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
