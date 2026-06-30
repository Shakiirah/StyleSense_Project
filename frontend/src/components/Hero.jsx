import { useNavigate } from "react-router-dom";

const motionImages = [
  { src: "/images/hero_motion/motion-2-piece.avif", alt: "Two piece outfit" },
  { src: "/images/hero_motion/motion-casual-dress.avif", alt: "Casual dress outfit" },
  { src: "/images/hero_motion/motion-sweater.avif", alt: "Sweater outfit" },
  { src: "/images/hero_motion/motion-jean-pant.avif", alt: "Jean pant outfit" },
  { src: "/images/hero_motion/motion-skirt.webp", alt: "Statement skirt outfit" },
  { src: "/images/hero_motion/motion-formal.jpg", alt: "Formal outfit" },
  { src: "/images/hero_motion/motion-2-piece-2.webp", alt: "Coordinated two piece outfit" },
  { src: "/images/hero_motion/motion-denim.jpg", alt: "Denim street style outfit" },
  { src: "/images/hero_motion/motion-top-pink.webp", alt: "Pink top outfit" },
  { src: "/images/hero_motion/motion-top-red.jpg", alt: "Red top outfit" },
  { src: "/images/hero_motion/motion-crop-top.jpg", alt: "Crop top outfit" },
];

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-motion-bg" aria-hidden="true">
        <div className="hero-motion-track">
          {[...motionImages, ...motionImages].map((img, index) => (
            <img key={`${img.src}-${index}`} src={img.src} alt={img.alt} />
          ))}
        </div>
      </div>

      <div className="hero-left">
        <span className="badge">AI-Powered Fashion Assistant</span>

        <h1>
          Your Personal <span>AI Stylist</span>
        </h1>

        <p>
          Build confident outfits with recommendations tailored to your body
          type, occasion, budget, weather, and style preferences.
        </p>

        <div className="buttons">
          <button className="primary-btn" onClick={() => navigate("/quiz")}>
            Start Styling Quiz
          </button>

          <button className="secondary-btn" onClick={() => navigate("/matcher")}>
            Upload & Match
          </button>
        </div>

        <div className="hero-stats" aria-label="StyleSense highlights">
          <span><strong>6-step</strong> style quiz</span>
          <span><strong>AI</strong> outfit matching</span>
          <span><strong>Store</strong> suggestions</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
