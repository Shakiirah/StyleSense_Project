import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { useShop } from "./context/ShopContext";
import { clearSession, getStoredUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, cartCount } = useShop();
  const [user, setUser] = useState(() => getStoredUser());
  const [openCategory, setOpenCategory] = useState(null);

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
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const normalizeCategory = (label) => label.toLowerCase();
  const toggleCategory = (label) => {
    const categoryKey = normalizeCategory(label);
    setOpenCategory(current => current === categoryKey ? null : categoryKey);
  };

  const categories = [
    { label: "What's New", items: ["New arrivals", "Fresh picks", "This week"] },
    { label: "Trending", items: ["Streetwear", "Quiet luxury", "Campus looks"] },
    { label: "Clothing", items: ["Sweaters", "Jackets", "Jeans", "Skirts", "Matching sets"] },
    { label: "Dresses", items: ["Casual dresses", "Party dresses", "Formal outfits", "Event dresses", "Maxi dresses"] },
    { label: "Tops", items: ["Shirts", "Blouses", "Sweaters", "Hoodies", "Crop tops"] },
    { label: "Plus", items: ["Plus dresses", "Plus tops", "Plus jeans"] },
    { label: "Mens", items: ["Men's sweaters", "Shirts", "Hoodies", "Trousers", "Outerwear", "Men's shoes"] },
    { label: "Sale", items: ["Under $25", "Clearance", "Last chance"] },
  ];
  const activeCategoryKey = openCategory || selectedCategory;
  const activeCategory = categories.find(
    category => normalizeCategory(category.label) === activeCategoryKey
  );

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="logo">
          <h2>StyleSense</h2>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/matcher">Outfit Matcher</Link></li>
          <li><Link to="/quiz">Style Quiz</Link></li>
          <li><Link to="/recommendations">Recommendations</Link></li>
        </ul>

        <div className="icons">
          <span className="icon-wrapper">
            <Heart size={19} />
            {wishlist.size > 0 && (
              <span className="icon-badge badge-wishlist">{wishlist.size}</span>
            )}
          </span>

          <span
            className="icon-wrapper"
            onClick={() => navigate("/checkout")}
            style={{ cursor: "pointer" }}
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="icon-badge badge-cart">{cartCount}</span>
            )}
          </span>

          {user ? (
            <div className="account-menu">
              <button className="account-trigger" type="button">
                <span className="account-avatar">
                  {displayName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="account-name">Hi, {displayName}</span>
              </button>

              <div className="account-dropdown">
                <p className="account-label">Signed in as</p>
                <p className="account-email">{user.email}</p>
                <button type="button" onClick={() => navigate("/recommendations")}>
                  My recommendations
                </button>
                <button type="button" onClick={() => navigate("/checkout")}>
                  Cart and checkout
                </button>
                <button className="logout-btn" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <button className="user-icon" type="button" onClick={() => navigate("/login")} aria-label="Sign in">
              <User size={19} />
            </button>
          )}
        </div>
      </nav>

      <nav className="category-strip" aria-label="Shop categories">
        {categories.map((category) => (
          <div
            className={`category-item ${
              openCategory === normalizeCategory(category.label) ||
              selectedCategory === normalizeCategory(category.label)
                ? "is-open"
                : ""
            }`}
            key={category.label}
          >
            <button
              className={category.label === "Sale" ? "category-link sale-link" : "category-link"}
              type="button"
              onClick={() => toggleCategory(category.label)}
            >
              {category.label}
            </button>
          </div>
        ))}
      </nav>

      {activeCategory && (
        <nav className="subcategory-panel" aria-label={`${activeCategory.label} options`}>
          <Link
            className="subcategory-pill featured"
            to={`/shop?category=${encodeURIComponent(normalizeCategory(activeCategory.label))}`}
            onClick={() => setOpenCategory(normalizeCategory(activeCategory.label))}
          >
            View all {activeCategory.label}
          </Link>

          {activeCategory.items.map((item) => (
            <Link
              className="subcategory-pill"
              key={item}
              to={`/shop?category=${encodeURIComponent(normalizeCategory(activeCategory.label))}&type=${encodeURIComponent(item.toLowerCase())}`}
              onClick={() => setOpenCategory(normalizeCategory(activeCategory.label))}
            >
              {item}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
