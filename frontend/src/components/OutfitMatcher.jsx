import { useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Check,
  ChevronRight,
  CloudSun,
  ExternalLink,
  Globe2,
  ImageUp,
  Lock,
  Palette,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./OutfitMatcher.css";
import { getToken, saveLocalRecommendation, savePendingRecommendation } from "../services/api";

const itemTypes = [
  { key: "Top", icon: Shirt },
  { key: "Bottom", icon: Briefcase },
  { key: "Dress", icon: Sparkles },
  { key: "Shoes", icon: ShoppingBag },
  { key: "Jacket", icon: Shirt },
  { key: "Bag", icon: ShoppingBag },
  { key: "Accessory", icon: Palette },
];

const preferenceOptions = {
  gender: ["Female", "Male", "Other"],
  bodyType: ["Hourglass", "Rectangle", "Triangle", "Inverted Triangle", "Round", "Athletic"],
  style: ["Casual Chic", "Minimalist", "Formal", "Sporty", "Bohemian", "Vintage"],
  occasion: ["Day Out / Casual", "Work / Office", "Date Night", "Party", "Vacation", "Gym / Sports"],
  weather: ["Warm", "Hot & Sunny", "Mild", "Cold", "Rainy"],
  budget: ["Under $50", "$50 - $100", "$100 - $150", "$150 - $250", "Over $250"],
  color: ["No Preference", "Neutral / Earth Tones", "Bright Colors", "Pastels", "Black & White"],
  culture: ["No Preference", "African", "South Asian", "East Asian", "Middle Eastern", "Western", "Traditional Event"],
};

const uploadedSample = {
  name: "White Crop Top",
  status: "Your uploaded item",
  price: "Uploaded",
  image: "/images/hero_motion/motion-crop-top.jpg",
  available: "uploaded",
};

const shopRecommendations = [
  {
    name: "High Waist Straight Jeans",
    status: "Available in StyleSense Shop",
    price: "$39.99",
    image: "/images/complete_casual_outfit_female3.webp",
    available: "shop",
  },
  {
    name: "White Sneakers",
    status: "Available in StyleSense Shop",
    price: "$49.99",
    image: "/images/hero_motion/motion-denim.avif",
    available: "shop",
  },
];

const partnerRecommendations = [
  {
    name: "Brown Tote Bag",
    store: "Zara",
    price: "$39.90",
    image: "/images/hero_motion/motion-top-red.jpg",
    available: "partner",
  },
  {
    name: "Gold Pendant Necklace",
    store: "Amazon",
    price: "$14.99",
    image: "/images/hero_motion/motion-top-pink.webp",
    available: "partner",
  },
  {
    name: "Beige Oversized Shirt",
    store: "H&M",
    price: "$29.99",
    image: "/images/Complete_office_outfit_female.webp",
    available: "partner",
  },
];

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <label className="match-field">
      <span>{Icon && <Icon size={15} />} {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function OutfitMatcher() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState("Top");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(uploadedSample.image);
  const [generated, setGenerated] = useState(false);
  const [status, setStatus] = useState("");
  const [preferences, setPreferences] = useState({
    gender: "Female",
    bodyType: "Hourglass",
    style: "Casual Chic",
    occasion: "Day Out / Casual",
    weather: "Warm",
    budget: "$100 - $150",
    color: "Neutral / Earth Tones",
    culture: "No Preference",
  });

  const uploadedItem = useMemo(() => ({
    ...uploadedSample,
    name: selectedType === "Top" ? "White Crop Top" : `Uploaded ${selectedType}`,
    image: previewUrl,
  }), [previewUrl, selectedType]);

  const completeOutfit = [uploadedItem, ...shopRecommendations, ...partnerRecommendations.slice(0, 2)];

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGenerated(false);
    setStatus("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const buildRecommendationPayload = () => ({
    outfitName: `${preferences.style} ${preferences.occasion.split("/")[0].trim()} Look`,
    occasion: preferences.occasion,
    stylingExplanation: `This outfit uses your uploaded ${selectedType.toLowerCase()} as the starting piece, then adds items that match your ${preferences.style.toLowerCase()} style, ${preferences.weather.toLowerCase()} weather, ${preferences.budget} budget, and ${preferences.culture === "No Preference" ? "general style preference" : `${preferences.culture} cultural inspiration`}. StyleSense checks the shop first and suggests trusted websites only when an item is not available.`,
    items: completeOutfit.map((item, index) => ({
      id: `ai-match-${index}`,
      name: item.name,
      category: index === 0 ? selectedType : index === 1 ? "Bottom" : index === 2 ? "Shoes" : "Accessory",
      price: item.price?.replace("$", "") || "",
      imageUrl: item.image,
      style: preferences.style,
      color: preferences.color,
    })),
  });

  const handleGenerate = () => {
    setGenerated(true);
    setStatus("AI recommendation generated with shop availability and partner-store suggestions.");
  };

  const handleSaveRecommendation = () => {
    const recommendation = buildRecommendationPayload();
    const context = { ...preferences, itemType: selectedType, source: "Upload & Match" };

    if (!getToken()) {
      savePendingRecommendation(recommendation, context);
      navigate("/login", { state: { message: "Sign in to save this AI outfit recommendation." } });
      return;
    }

    saveLocalRecommendation(recommendation, context);
    setStatus("Saved to My Recommendations.");
  };

  return (
    <section className="ai-stylist-page">
      <div className="stylist-hero">
        <div>
          <button className="back-home" type="button" onClick={() => navigate("/")}>← Back to Home</button>
          <h1>AI Stylist</h1>
          <p>Upload any fashion item you own and let StyleSense build a complete outfit around it.</p>
        </div>

        <div className="stylist-steps" aria-label="AI styling steps">
          <span className="active">1 Upload Item</span>
          <ChevronRight size={16} />
          <span>2 Preferences</span>
          <ChevronRight size={16} />
          <span>3 AI Match</span>
          <ChevronRight size={16} />
          <span>4 Recommendations</span>
        </div>
      </div>

      <div className="stylist-layout">
        <div className="stylist-panel upload-panel">
          <h2>1. What would you like to style?</h2>
          <div className="item-type-grid">
            {itemTypes.map(({ key, icon: Icon }) => (
              <button
                type="button"
                key={key}
                className={selectedType === key ? "selected" : ""}
                onClick={() => setSelectedType(key)}
              >
                <Icon size={22} />
                {key}
              </button>
            ))}
          </div>

          <h2>2. Upload your item</h2>
          <div
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="uploaded-preview">
                <img src={previewUrl} alt="Uploaded fashion item preview" />
                <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(uploadedSample.image); }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={42} />
                <strong>Drag & drop your image here</strong>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(event) => handleFile(event.target.files?.[0])}
              hidden
            />

            <button className="choose-file-btn" type="button" onClick={() => fileInputRef.current?.click()}>
              {selectedFile ? "Replace Image" : "Choose File"}
            </button>
            <small>JPG, PNG, WEBP. You can upload a top, jean, dress, shoe, bag, or accessory.</small>
          </div>

          <div className="privacy-box">
            <Lock size={17} />
            <span>Your data is private and secure. We never share your photos.</span>
          </div>
        </div>

        <div className="stylist-panel preference-panel">
          <h2>3. Tell us about your style</h2>
          <p>The more details you provide, the better your outfit recommendation.</p>

          <div className="field-grid">
            <SelectField label="Gender" icon={Tag} value={preferences.gender} options={preferenceOptions.gender} onChange={(value) => handlePreferenceChange("gender", value)} />
            <SelectField label="Body Type" icon={BadgeCheck} value={preferences.bodyType} options={preferenceOptions.bodyType} onChange={(value) => handlePreferenceChange("bodyType", value)} />
            <SelectField label="Preferred Style" icon={Sparkles} value={preferences.style} options={preferenceOptions.style} onChange={(value) => handlePreferenceChange("style", value)} />
            <SelectField label="Occasion" icon={Briefcase} value={preferences.occasion} options={preferenceOptions.occasion} onChange={(value) => handlePreferenceChange("occasion", value)} />
            <SelectField label="Weather" icon={CloudSun} value={preferences.weather} options={preferenceOptions.weather} onChange={(value) => handlePreferenceChange("weather", value)} />
            <SelectField label="Budget Range" icon={Tag} value={preferences.budget} options={preferenceOptions.budget} onChange={(value) => handlePreferenceChange("budget", value)} />
            <SelectField label="Color Preference (Optional)" icon={Palette} value={preferences.color} options={preferenceOptions.color} onChange={(value) => handlePreferenceChange("color", value)} />
            <SelectField label="Cultural Inspiration (Optional)" icon={Globe2} value={preferences.culture} options={preferenceOptions.culture} onChange={(value) => handlePreferenceChange("culture", value)} />
          </div>

          <button className="generate-btn" type="button" onClick={handleGenerate}>
            Find My Perfect Outfit <Sparkles size={17} />
          </button>
          <small className="ai-note">StyleSense will check your uploaded item, shop inventory, partner stores, and explain why the outfit works.</small>
        </div>

        <div className="stylist-panel result-panel">
          <h2>4. AI Recommendation & Explanation</h2>
          {!generated ? (
            <div className="empty-result">
              <Sparkles size={34} />
              <p>Complete the upload and preferences, then generate your AI match.</p>
            </div>
          ) : (
            <>
              <div className="result-summary-pill">
                Style: {preferences.style} • Occasion: {preferences.occasion} • Weather: {preferences.weather} • Budget: {preferences.budget}
                {preferences.culture !== "No Preference" && <> • Culture: {preferences.culture}</>}
              </div>

              <div className="matched-items">
                {completeOutfit.map((item) => (
                  <article className="matched-item" key={item.name}>
                    <img src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                    <span className={`item-status ${item.available}`}>
                      {item.available === "uploaded" && <Check size={13} />}
                      {item.available === "shop" && <Check size={13} />}
                      {item.available === "partner" && <X size={13} />}
                      {item.available === "uploaded" ? "Uploaded" : item.available === "shop" ? "In Shop" : "Not in Shop"}
                    </span>
                  </article>
                ))}
              </div>

              <div className="ai-explanation">
                <h3>Why this works for you</h3>
                <ul>
                  <li>Your uploaded {selectedType.toLowerCase()} is used as the anchor item.</li>
                  <li>The colors and pieces match your {preferences.style.toLowerCase()} style preference.</li>
                  <li>The outfit fits your {preferences.weather.toLowerCase()} weather and {preferences.budget} budget.</li>
                  <li>{preferences.culture === "No Preference" ? "No cultural inspiration was selected, so the outfit stays general and modern." : `The look includes ${preferences.culture} cultural inspiration in a respectful, optional way.`}</li>
                </ul>
              </div>

              <div className="partner-section">
                <h3>Complete Your Look</h3>
                <p>Items not available in StyleSense Shop can be bought from trusted partner websites.</p>
                {partnerRecommendations.map((item) => (
                  <div className="partner-row" key={item.name}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.store}</span>
                    </div>
                    <b>{item.price}</b>
                    <button type="button">View Product <ExternalLink size={14} /></button>
                  </div>
                ))}
              </div>

              <div className="result-actions">
                <button type="button" className="save-match-btn" onClick={handleSaveRecommendation}>Save to My Recommendations</button>
                <button type="button" className="shop-now-btn" onClick={() => navigate("/shop")}>View Available Shop Items</button>
              </div>
              {status && <p className="match-status">{status}</p>}
            </>
          )}
        </div>
      </div>

      <div className="stylist-benefits">
        <div><Sparkles size={24} /><strong>AI-Powered Matching</strong><span>Builds outfits around your item</span></div>
        <div><Store size={24} /><strong>Shop Integrated</strong><span>Checks StyleSense inventory first</span></div>
        <div><Tag size={24} /><strong>Budget Friendly</strong><span>Uses your selected price range</span></div>
        <div><Globe2 size={24} /><strong>Cultural Inspiration</strong><span>Optional styling context</span></div>
      </div>
    </section>
  );
}

export default OutfitMatcher;
