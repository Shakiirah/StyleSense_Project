
import "./footer.css";
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>StyleSense</h3>
          <p>Your AI-powered personal stylist - outfit recommendations tailored to you.</p>
        </div>

        <div className="footer-links-group">
          <h4>Explore</h4>
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/matcher">Outfit Matcher</a>
          <a href="/quiz">Style Quiz</a>
          <a href="/recommendations">Recommendations</a>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/careers">Careers</a>
          <a href="/contact">Contact</a>
          <a href="/blog">Blog</a>
        </div>

        <div className="footer-links-group">
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>

        <div className="footer-newsletter">
          <h4>Stay in Style</h4>
          <p>Subscribe for styling tips and updates.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StyleSense. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Twitter">Twitter</a>
          <a href="#" aria-label="Pinterest">Pinterest</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
