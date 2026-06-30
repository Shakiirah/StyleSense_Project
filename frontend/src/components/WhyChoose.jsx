function WhyChoose() {
  const features = [
    ["AI-Powered Recommendations", "Smart outfit suggestions based on your preferences."],
    ["Personalized For You", "Body-type, occasion, season, and budget aware styling."],
    ["Event-Based Styling", "Looks for work, everyday wear, date night, travel, and more."],
    ["Where to Buy", "Recommended stores and websites for preferred outfits."],
  ];

  return (
    <section className="why-choose">
      <span className="section-kicker">Why it helps</span>
      <h2>Why Choose StyleSense?</h2>

      <p>
        Our AI-powered platform combines intelligent recommendation
        technology with expert fashion knowledge.
      </p>

      <div className="features">
        {features.map(([title, copy], index) => (
          <div className="feature-card" key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;
