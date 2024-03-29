import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import { AuthenticationGuard } from "./components/Authentication_Guard";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Basket from "./pages/Basket";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Gamepage from "./pages/Gamepage";
import Library from "./pages/Library";
import PublishYourGames from "./pages/PublishYourGames";
import Contact from "./pages/Contact";
import EditData from "./pages/EditData";
import EditGame from "./pages/EditGame";

function App() {
  return (
    <div className="bg-black md:bg-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/store" element={<Store />} />
        <Route path="/gamepage" element={<Gamepage />} />
        <Route
          path="/library"
          element={<AuthenticationGuard component={Library} />}
        />
        <Route
          path="/profile"
          element={<AuthenticationGuard component={Profile} />}
        />
        <Route
          path="/publish"
          element={<AuthenticationGuard component={PublishYourGames} />}
        />
        <Route
          path="/basket"
          element={<AuthenticationGuard component={Basket} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/basket" element={<Basket />} />
        <Route
          path="/editData"
          element={<AuthenticationGuard component={EditData} />}
        />
        <Route
          path="/editGame"
          element={<AuthenticationGuard component={EditGame} />}
        />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

console.log(process.env.REACT_APP_AUTH0_DOMAIN);

export default App;
