import { Link } from "react-router-dom";
import "./ShopShowcase.css";

const collections = [
  {
    title: "Tops",
    image: "/images/stylesense_pictures/top.avif",
    link: "/shop?category=tops",
  },
  {
    title: "Denim",
    image: "/images/stylesense_pictures/denim.jpg",
    link: "/shop?category=clothing&type=jeans",
  },
  {
    title: "Sets",
    image: "/images/stylesense_pictures/sets.png",
    link: "/shop?category=clothing&type=matching%20sets",
  },
  {
    title: "Dresses",
    image: "/images/stylesense_pictures/dresses.jpg",
    link: "/shop?category=dresses",
  },
  {
    title: "Skirts",
    image: "/images/stylesense_pictures/skirts.jpg",
    link: "/shop?category=clothing&type=skirts",
  },
  {
    title: "Sweaters",
    image: "/images/stylesense_pictures/sweaters.jpg",
    link: "/shop?category=tops&type=sweaters",
  },
];

function ShopShowcase() {
  return (
    <section className="shop-showcase" aria-labelledby="shop-showcase-title">
      <div className="showcase-heading">
        <span>Curated for your next outfit</span>
        <h2 id="shop-showcase-title">Shop The StyleSense Edit</h2>
        <p>
          Browse popular categories, discover outfit pieces, and find where to
          buy the looks recommended by your AI stylist.
        </p>
      </div>

      <div className="showcase-window">
        <div className="showcase-track">
          {[...collections, ...collections].map((item, index) => (
            <article className="showcase-card" key={`${item.title}-${index}`}>
              <Link to={item.link} className="showcase-image-link">
                <img src={item.image} alt={`${item.title} fashion category`} />
                <span>{item.title}</span>
              </Link>

              <Link to={item.link} className="shop-now-link">
                Shop Now
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopShowcase;
