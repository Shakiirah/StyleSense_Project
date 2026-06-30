import { Check, ExternalLink, ShoppingCart, Sparkles, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";
import { api, getLocalRecommendations, getToken, savePendingRecommendation } from "../services/api";
import { fallbackImage, getProductImage } from "../utils/styleImages";
import { getRecommendationItems, withVisualFallbackItems } from "../utils/recommendationHelpers";
import { useShop } from "../components/context/ShopContext";

function getRecommendationDate(recommendation = {}) {
  return recommendation.savedAt || recommendation.createdAt || recommendation.generatedAt || recommendation.updatedAt || "";
}

function formatRecommendationDate(recommendation = {}) {
  const rawDate = getRecommendationDate(recommendation);
  if (!rawDate) return "Saved recently";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "Saved recently";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function recommendationSignature(recommendation = {}) {
  const visualRecommendation = withVisualFallbackItems(recommendation, recommendation.context || {});
  const items = getRecommendationItems(visualRecommendation)
    .map((item) => `${item.category || ""}:${item.name || item.id || ""}`)
    .sort()
    .join("|");

  return `${visualRecommendation.outfitName || ""}|${visualRecommendation.occasion || visualRecommendation.context?.occasion || ""}|${items}`;
}

function mergeRecommendations(...groups) {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .filter((recommendation) => {
      const signature = recommendationSignature(recommendation);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    })
    .sort((a, b) => new Date(getRecommendationDate(b)).getTime() - new Date(getRecommendationDate(a)).getTime());
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart, justAddedId } = useShop();

  const handleAddToCart = (item, recommendation) => {
    if (!getToken()) {
      savePendingRecommendation(recommendation, recommendation.context || {});
      navigate("/login", { state: { message: "Sign in to add this outfit item to your cart." } });
      return;
    }

    addToCart(item);
  };

  useEffect(() => {
    const syncLocalRecommendations = () => {
      setRecommendations(mergeRecommendations(getLocalRecommendations()));
    };

    syncLocalRecommendations();
    window.addEventListener("stylesense-recommendations-change", syncLocalRecommendations);

    if (!getToken()) {
      return () => {
        window.removeEventListener("stylesense-recommendations-change", syncLocalRecommendations);
      };
    }

    let ignore = false;
    setHistoryLoading(true);

    api.getRecommendationHistory()
      .then((data) => {
        if (!ignore) {
          setRecommendations(
            mergeRecommendations(
              getLocalRecommendations(),
              (data || []).map((item) => withVisualFallbackItems(item, item.context || {}))
            )
          );
        }
      })
      .catch(() => {
        if (!ignore) {
          setRecommendations(mergeRecommendations(getLocalRecommendations()));
        }
      })
      .finally(() => {
        if (!ignore) {
          setHistoryLoading(false);
        }
      });

    return () => {
      ignore = true;
      window.removeEventListener("stylesense-recommendations-change", syncLocalRecommendations);
    };
  }, []);

  return (
    <section className="recommendations-page">
      <div className="recommendations-hero">
        <span className="badge">
          <Sparkles size={16} />
          Personalized Outfit Picks
        </span>

        <h1>Your recommended looks</h1>

        <p>
          StyleSense saves outfit combinations from your style quiz so you can
          review each look, styling advice, and store links anytime.
        </p>
      </div>

      <div className="recommendation-grid">
        {historyLoading ? (
          <div className="recommendation-card recommendation-empty">
            <h2>Loading saved recommendations...</h2>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="recommendation-card recommendation-empty">
            <div className="recommendation-icon">
              <Store size={28} />
            </div>

            <h2>No saved recommendations yet</h2>

            <p>
              Complete the Style Quiz first. The recommended outfit will display
              on the quiz page and also save here.
            </p>
          </div>
        ) : (
          recommendations.map((recommendation, index) => {
            const visualRecommendation = withVisualFallbackItems(
              recommendation,
              recommendation.context || {}
            );

            const items = getRecommendationItems(visualRecommendation);

            return (
              <article
                className="recommendation-card"
                key={
                  visualRecommendation.localId ||
                  visualRecommendation.outfitId ||
                  `${visualRecommendation.outfitName}-${index}`
                }
              >
                <div className="recommendation-icon">
                  <Store size={28} />
                </div>

                <p className="recommendation-date">
                  {formatRecommendationDate(visualRecommendation)}
                </p>

                <p className="recommendation-kicker">
                  {visualRecommendation.occasion ||
                    visualRecommendation.context?.occasion ||
                    "StyleSense look"}
                </p>

                <h2>{visualRecommendation.outfitName || "Recommended Outfit"}</h2>

                <p>
                  {visualRecommendation.stylingExplanation ||
                    "A personalized outfit recommendation generated from your preferences."}
                </p>

                <div className="recommendation-items">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        className="recommendation-item"
                        key={`${visualRecommendation.localId || visualRecommendation.outfitId}-${item.category}-${item.id}`}
                      >
                        <button
                          type="button"
                          className="recommendation-image-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(item);
                          }}
                        >
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            onError={(event) => {
                              event.currentTarget.src = fallbackImage;
                            }}
                          />

                          <span>View Image</span>
                        </button>

                        <strong>{item.category}</strong>

                        <button
                          type="button"
                          className="recommendation-item-name"
                          onClick={() => setSelectedImage(item)}
                        >
                          {item.name}
                        </button>

                        {item.price && <em>${item.price}</em>}

                        <button
                          type="button"
                          className="recommendation-addcart"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item, visualRecommendation);
                          }}
                        >
                          {String(justAddedId) === String(item.id) ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="recommendation-item">
                      <strong>Saved look</strong>
                      <span>
                        Restart the backend with the latest update to show
                        individual outfit items.
                      </span>
                    </div>
                  )}
                </div>

                <div className="recommendation-stores">
                  <button
                    type="button"
                    onClick={() => navigate("/shop")}
                  >
                    Browse Similar Products
                    <ExternalLink size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open("https://www.amazon.ca", "_blank")}
                  >
                    Partner Websites
                    <ExternalLink size={13} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {selectedImage && (
        <div className="recommendation-image-modal">
          <button
            type="button"
            className="recommendation-image-modal-backdrop"
            onClick={() => setSelectedImage(null)}
          />

          <div className="recommendation-image-modal-panel">
            <button
              type="button"
              className="recommendation-image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>

            <img
              src={getProductImage(selectedImage)}
              alt={selectedImage.name}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />

            <div className="recommendation-image-modal-caption">
              <p>{selectedImage.category}</p>

              <h3>{selectedImage.name}</h3>

              {selectedImage.price && <span>${selectedImage.price}</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}