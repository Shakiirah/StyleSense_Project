import { createContext, useContext, useEffect, useState, useRef } from "react";

const ShopContext = createContext(null);
const CART_STORAGE_KEY = "stylesense_cart";
const CART_PRODUCTS_STORAGE_KEY = "stylesense_cart_products";

function readStoredObject(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}


export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(() => readStoredObject(CART_STORAGE_KEY, {}));
  const [cartProducts, setCartProducts] = useState(() => readStoredObject(CART_PRODUCTS_STORAGE_KEY, {}));
  const [justAddedId, setJustAddedId] = useState(null);
  const addTimeout = useRef(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(CART_PRODUCTS_STORAGE_KEY, JSON.stringify(cartProducts));
  }, [cartProducts]);

  function toggleWishlist(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addToCart(itemOrId) {
    const product = typeof itemOrId === "object" ? itemOrId : null;
    const id = product?.id ?? itemOrId;

    if (!id) return;

    const cartProduct = product || products.find((item) => String(item.id) === String(id));
    if (cartProduct) {
      setCartProducts((prev) => ({ ...prev, [id]: cartProduct }));
    }

    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setJustAddedId(id);
    clearTimeout(addTimeout.current);
    addTimeout.current = setTimeout(() => setJustAddedId(null), 1200);
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setCartProducts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateQuantity(id, qty) {
    if (qty < 1) return;
    setCart((prev) => ({ ...prev, [id]: qty }));
  }

  function clearCart() {
    setCart({});
    setCartProducts({});
  }

  
  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => String(p.id) === String(id)) || cartProducts[id];
      return product ? { ...product, id: product.id ?? id, qty } : null;
    })
    .filter(Boolean);

  const value = {
    products, setProducts,
    wishlist, toggleWishlist,
    cart, cartItems, cartCount,
    addToCart, removeFromCart, updateQuantity, clearCart,
    justAddedId,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside a <ShopProvider>");
  return ctx;
}
