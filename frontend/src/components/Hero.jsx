import { useState } from "react";
import { CloudSun, Eye, Sparkles, Tag, Upload, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const outfitInspirations = [
  {
    title: "Casual Day Out",
    image: "/images/complete_casual_outfit_female3.webp",
  },
  {
    title: "Vacation Vibes",
    image: "/images/complete_outfit_vacation_female.webp",
  },
  {
    title: "Office Ready",
    image: "/images/Complete_office_outfit_female.webp",
  },
  {
    title: "Party Glam",
    image: "/images/complete_oufit_party_female4.webp",
  },
];

function Hero() {
  const navigate = useNavigate();
  const [selectedLook, setSelectedLook] = useState(null);

  const openLook = (look) => {
    setSelectedLook(look);
  };

  return (
    <section className="hero ai-hero">
      <div className="hero-left">
        <span className="badge">
          <Sparkles size={14} />
          AI-Powered Style Recommendations
        </span>

        <h1>
          Your AI Stylist,
          <span>Personalized for You</span>
        </h1>

        <p>
          Upload a fashion item, answer a few style questions, and let our AI create
          complete outfit recommendations based on your body type, occasion, weather,
          budget, cultural inspiration, and style preferences.
        </p>

        <div className="buttons">
          <button className="primary-btn" type="button" onClick={() => navigate("/matcher")}>
            <Upload size={20} />
            Start AI Styling
          </button>

          <button className="secondary-btn" type="button" onClick={() => navigate("/quiz")}>
            <Sparkles size={20} />
            Take Style Quiz
          </button>
        </div>

        <p className="privacy-note">Your data is private and secure</p>

        <div className="hero-feature-row" aria-label="Recommendation features">
          <div>
            <UserRound size={27} />
            <strong>Personalized</strong>
            <span>for you</span>
          </div>

          <div>
            <Sparkles size={27} />
            <strong>Smart Outfit</strong>
            <span>Pairing</span>
          </div>

          <div>
            <CloudSun size={27} />
            <strong>Weather</strong>
            <span>Aware</span>
          </div>

          <div>
            <Tag size={27} />
            <strong>Budget</strong>
            <span>Friendly</span>
          </div>
        </div>
      </div>

      <div className="hero-right" aria-label="AI outfit inspiration preview">
        <div className="recommendation-preview-card">
          <div className="preview-heading">
            <div>
              <span>
                <Sparkles size={18} />
                AI Outfit Inspirations
              </span>
              <p>Complete outfits curated by StyleSense AI just for you.</p>
            </div>
          </div>

          <div className="look-cards">
            {outfitInspirations.map((look) => (
              <article className="look-card" key={look.title}>
                <div
                  className="look-image-wrap"
                  onClick={() => openLook(look)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      openLook(look);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${look.title}`}
                >
                  <img src={look.image} alt={look.title} />

                  <div className="view-image-overlay">
                    <Eye size={16} />
                    View Image
                  </div>
                </div>

                <h3 className="look-title">{look.title}</h3>
              </article>
            ))}
          </div>

          <button className="more-recommendations" type="button" onClick={() => navigate("/quiz")}>
            Personalize These Looks →
          </button>
        </div>
      </div>

      {selectedLook && (
        <div className="image-modal" onClick={() => setSelectedLook(null)}>
          <button className="modal-close" type="button" onClick={() => setSelectedLook(null)} aria-label="Close image preview">
            <X size={28} />
          </button>

          <div className="image-only-modal" onClick={(event) => event.stopPropagation()}>
            <img src={selectedLook.image} alt={selectedLook.title} />
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
