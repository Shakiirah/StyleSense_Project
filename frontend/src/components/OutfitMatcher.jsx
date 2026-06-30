import { useRef, useState } from "react";
import { Camera, Sparkles, Store, Upload } from "lucide-react";
import "./OutfitMatcher.css";
import { api, getToken } from "../services/api";

function OutfitMatcher() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (!getToken()) {
      setError("Please sign in first so StyleSense can save your upload recommendation.");
      return;
    }
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.uploadOutfit(selectedFile);
      setResult(data);
    } catch (err) {
      setError(
        err.message?.includes("Failed to fetch")
          ? "Backend is not running. Start Spring Boot on localhost:8080."
          : "Unable to analyze this image right now."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="outfit-matcher">
      <div className="matcher-copy">
        <span className="badge">
          <Camera size={16} />
          AI-Powered Image Analysis
        </span>

        <h1>Smart Outfit Matcher</h1>

        <p>
          Upload a clothing item from your wardrobe. StyleSense will suggest
          matching pieces, explain why they work, and recommend stores or
          websites where similar items can be purchased.
        </p>

        <div className="matcher-benefits">
          <span><Sparkles size={16} /> Color and style matching</span>
          <span><Store size={16} /> Store and website suggestions</span>
        </div>
      </div>

      <div
        className={`upload-box ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <Upload size={34} />
        </div>

        <h2>Upload Your Clothing Item</h2>

        <p className="upload-subtext">
          {selectedFile
            ? `Selected: ${selectedFile.name}`
            : "Drag and drop an image here, or click to browse"}
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button className="choose-file-btn" onClick={handleChooseFile}>
          Choose File
        </button>

        <button
          className="analyze-file-btn"
          onClick={handleAnalyze}
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Analyzing..." : "Analyze With Backend"}
        </button>

        {error && <p className="matcher-message error">{error}</p>}
        {result && (
          <div className="matcher-result">
            <h3>{result.outfitName || "Matched Outfit"}</h3>
            <p>{result.stylingExplanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default OutfitMatcher;
