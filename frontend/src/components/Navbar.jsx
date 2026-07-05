import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { useShop } from "./context/ShopContext";
import { clearSession, getStoredUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const { wishlist, cartCount } = useShop();
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("stylesense-auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("stylesense-auth-change", syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const displayName = user?.firstName || user?.email?.split("@")[0];

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="logo" aria-label="StyleSense home">
          <span className="logo-mark">✦</span>
          <h2>StyleSense <strong>AI</strong></h2>
        </Link>

        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/matcher">AI Stylist</NavLink></li>
          <li><NavLink to="/recommendations">My Recommendations</NavLink></li>
        </ul>

        <div className="nav-actions">
          <button className="upload-match-btn" type="button" onClick={() => navigate("/matcher")}> 
            <Upload size={17} />
            Upload & Match
          </button>

          <button className="icon-wrapper" type="button" aria-label="Wishlist">
            <Heart size={19} />
            {wishlist.size > 0 && <span className="icon-badge">{wishlist.size}</span>}
          </button>

          <button className="icon-wrapper" type="button" onClick={() => navigate("/checkout")} aria-label="Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="account-menu">
              <button className="account-trigger" type="button" aria-label="Account menu">
                <span className="account-avatar">{displayName?.charAt(0)?.toUpperCase() || "U"}</span>
              </button>

              <div className="account-dropdown">
                <p className="account-label">Signed in as</p>
                <p className="account-email">{user.email}</p>
                <button type="button" onClick={() => navigate("/recommendations")}>My recommendations</button>
                <button type="button" onClick={() => navigate("/checkout")}>Cart and checkout</button>
                <button className="logout-btn" type="button" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          ) : (
            <button className="user-icon" type="button" onClick={() => navigate("/login")} aria-label="Sign in">
              <User size={19} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
