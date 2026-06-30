function CTA() {
  return (
    <section className="cta">

      <span className="section-kicker light">Ready when you are</span>
      <h2>Ready to Transform Your Style?</h2>

      <p>
        Join thousands of fashion-forward shoppers using AI
        to elevate their wardrobe.
      </p>

      <button onClick={() => (window.location.href = "/quiz")}>
        Get Started Now
      </button>

    </section>
  );
}

export default CTA;
