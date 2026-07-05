import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StyleQuiz.css";
import { Check, ShoppingCart } from "lucide-react";
import { getToken, saveLocalRecommendation, savePendingRecommendation } from "../services/api";
import { fallbackImage, getProductImage } from "../utils/styleImages";
import { getRecommendationItems, withVisualFallbackItems } from "../utils/recommendationHelpers";
import { useShop } from "../components/context/ShopContext";

function StyleQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationContext, setRecommendationContext] = useState(null);
  const resultRef = useRef(null);
  const { addToCart, justAddedId } = useShop();

  useEffect(() => {
    if (recommendation && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recommendation]);

  const goToNextStep = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    }
  };

  const chooseAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));

    setTimeout(() => {
      if (step === 6) {
        completeQuiz({ ...answers, [key]: value });
      } else {
        goToNextStep();
      }
    }, 250);
  };

  const skipStep = () => {
    if (step === 6) {
      completeQuiz(answers);
    } else {
      goToNextStep();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const completeQuiz = async (finalAnswers = answers) => {
    setLoading(true);
    setStatus("");
    setRecommendation(null);
    setRecommendationContext(null);

    const context = {
      source: "Style Quiz",
      occasion: finalAnswers.occasion || "Everyday",
      weather: finalAnswers.weather || "Mild",
      budgetRange: finalAnswers.budget || "$50 - $100",
      gender: finalAnswers.gender || "Other",
      style: finalAnswers.style || "Classic",
      bodyType: finalAnswers.bodyType || "Not specified",
    };

    const visualResult = withVisualFallbackItems({}, context);
    setRecommendation(visualResult);
    setRecommendationContext(context);
    savePendingRecommendation(visualResult, context);

    if (getToken()) {
      saveLocalRecommendation(visualResult, context);
    }

    setStatus("Your outfit recommendation is ready.");
    setLoading(false);
  };

  const saveOutfit = () => {
    if (!recommendation) return;

    if (!getToken()) {
      savePendingRecommendation(recommendation, recommendationContext || {});
      navigate("/login", {
        state: { message: "Sign in to save this outfit to your recommendations." },
      });
      return;
    }

    saveLocalRecommendation(recommendation, recommendationContext || {});
    setStatus("Outfit saved to your recommendations.");
  };

  const addRecommendedItemToCart = (item) => {
    if (!getToken()) {
      savePendingRecommendation(recommendation, recommendationContext || {});
      navigate("/login", {
        state: { message: "Sign in to add this outfit item to your cart." },
      });
      return;
    }

    addToCart(item);
  };

  const bodyTypes = [
    {
      label: "Rectangle",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <path d="M20 10 L40 10 L40 90 L20 90 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      label: "Triangle",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <path d="M25 10 L35 10 L42 90 L18 90 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      label: "Inverted Triangle",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <path d="M18 10 L42 10 L35 90 L25 90 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      label: "Hourglass",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <path d="M18 10 L42 10 L30 50 L42 90 L18 90 L30 50 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      label: "Round",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <ellipse cx="30" cy="50" rx="22" ry="40" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      label: "Athletic",
      icon: (
        <svg viewBox="0 0 60 100" width="50" height="80">
          <path d="M20 10 L40 10 L38 40 L42 90 L30 90 L18 90 L22 40 Z" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
  ];

  const recommendedItems = recommendation ? getRecommendationItems(recommendation) : [];

  return (
    <div className="quiz-container">
      <div className="progress-section">
        <div className="progress-header">
          <span>Step {step} of 6</span>
          <span>{Math.round((step / 6) * 100)}% Complete</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>
      </div>

      <div className="quiz-card">
        {step === 1 && (
          <>
            <h1>What's your gender?</h1>
            <p>This helps us show you the most relevant styles</p>

            <div className="options">
              {["Male", "Female", "Other"].map((option) => (
                <button
                  key={option}
                  className={answers.gender === option ? "selected" : ""}
                  onClick={() => chooseAnswer("gender", option)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1>What's your body type?</h1>
            <p>We'll recommend styles that flatter your shape</p>

            <div className="body-options visual-options">
              {bodyTypes.map((type) => (
                <button
                  key={type.label}
                  className={`visual-option ${answers.bodyType === type.label ? "selected" : ""}`}
                  onClick={() => chooseAnswer("bodyType", type.label)}
                  disabled={loading}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1>What's your style preference?</h1>
            <p>Choose the style that resonates with you most</p>

            <div className="body-options">
              {["Casual", "Formal", "Sporty", "Bohemian", "Minimalist", "Vintage"].map((option) => (
                <button
                  key={option}
                  className={answers.style === option ? "selected" : ""}
                  onClick={() => chooseAnswer("style", option)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1>What's the occasion?</h1>
            <p>We'll match outfits to your event</p>

            <div className="body-options">
              {["Everyday", "Work/Office", "Date Night", "Party", "Vacation", "Gym/Sports"].map((option) => (
                <button
                  key={option}
                  className={answers.occasion === option ? "selected" : ""}
                  onClick={() => chooseAnswer("occasion", option)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1>What's your budget range?</h1>
            <p>We'll show you options within your price range</p>

            <div className="body-options">
              {["Under $50", "$50 - $100", "$100 - $200", "$200 - $500", "Over $500"].map((option) => (
                <button
                  key={option}
                  className={answers.budget === option ? "selected" : ""}
                  onClick={() => chooseAnswer("budget", option)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h1>Current weather conditions?</h1>
            <p>We'll suggest weather-appropriate clothing</p>

            <div className="body-options">
              {["Hot & Sunny", "Warm", "Mild", "Cold", "Rainy"].map((option) => (
                <button
                  key={option}
                  className={answers.weather === option ? "selected" : ""}
                  onClick={() => chooseAnswer("weather", option)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="divider"></div>

        {status && <p className="quiz-message success">{status}</p>}

        <div className="quiz-buttons">
          <button className="prev-btn" onClick={prevStep} disabled={step === 1 || loading}>
            Previous
          </button>

          <button className="skip-btn" onClick={skipStep} disabled={loading}>
            {loading ? "Generating..." : step === 6 ? "Skip & Get Recommendations" : "Skip"}
          </button>
        </div>

        {recommendation && (
          <div className="quiz-result" ref={resultRef}>
            <p className="result-kicker">AI outfit recommendation</p>
            <h2>{recommendation.outfitName || "Your StyleSense Look"}</h2>
            <p className="result-meta">
              Occasion: {recommendation.occasion || answers.occasion || "Everyday"} · Weather:{" "}
              {answers.weather || "Mild"} · Budget: {answers.budget || "$50 - $100"}
            </p>

            {recommendation.stylingExplanation && (
              <div className="result-explanation">
                <strong>Styling advice</strong>
                <p>{recommendation.stylingExplanation}</p>
              </div>
            )}

            <div className="result-actions">
              <button type="button" className="result-save" onClick={saveOutfit}>
                Save outfit
              </button>
              {!getToken() && <span>Sign in only when you want to save or buy this look.</span>}
            </div>

            <div className="result-grid">
              {recommendedItems.length > 0 ? (
                recommendedItems.map((item) => (
                  <article className="result-item" key={`${item.category}-${item.id}`}>
                    <div className="result-image">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>

                    <p className="result-item-category">{item.category}</p>
                    <h3>{item.name}</h3>

                    <div className="result-tags">
                      {item.color && <span>{item.color}</span>}
                      {item.style && <span>{item.style}</span>}
                    </div>

                    {item.price && <p className="result-price">${item.price}</p>}
                    <p className="result-store">Where to buy: StyleSense Store</p>

                    <button
                      type="button"
                      className="result-addcart"
                      onClick={() => addRecommendedItemToCart(item)}
                    >
                      {String(justAddedId) === String(item.id) ? (
                        <>
                          <Check size={15} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} /> Add to Cart
                        </>
                      )}
                    </button>
                  </article>
                ))
              ) : (
                <p className="result-empty">
                  The AI saved a recommendation, but no product items were returned. Try a different occasion.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StyleQuiz;