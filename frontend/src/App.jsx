import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StyleQuiz from "./pages/StyleQuiz";
import Navbar from "./components/Navbar";
import Login from "./pages/Login"
import Footer from "./components/footer";
import OutfitMatcher from "./components/OutfitMatcher";
import Shop from "./components/shop";
import Checkout from "./components/Checkout"; 
import Recommendations from "./pages/Recommendations";
import { ShopProvider } from "./components/context/ShopContext";

function App() {
  return (
    <ShopProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<StyleQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/matcher" element={<OutfitMatcher />} />
        <Route path="/ai-stylist" element={<OutfitMatcher />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>

      <Footer/>
    </ShopProvider>
  );
}

export default App;
