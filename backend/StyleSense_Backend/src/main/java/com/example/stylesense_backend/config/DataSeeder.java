package com.example.stylesense_backend.config;

import com.example.stylesense_backend.model.Product;
import com.example.stylesense_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final ProductRepository productRepository;

    @Bean
    CommandLineRunner seedProducts() {
        return args -> {
            productRepository.deleteAll();

            productRepository.saveAll(List.of(

                    // FEMALE DRESSES
                    product("Black Wrap Maxi Dress", "Elegant casual maxi dress for everyday and date night styling.", "Dresses", "female", "Black", "solid", "Elegant", "hourglass,rectangle,triangle", "casual,everyday,date night", "All season", "79.00", 25),
                    product("Green Tiered Midi Dress", "Soft feminine midi dress suitable for brunch, vacation, and casual events.", "Dresses", "female", "Green", "solid", "Romantic", "hourglass,rectangle", "casual,vacation,party", "Spring", "84.00", 20),
                    product("Emerald Sequin Mini Dress", "Statement dress for parties and evening events.", "Dresses", "female", "Emerald", "sequin", "Glam", "hourglass,rectangle", "party,date night,formal", "All season", "98.00", 18),
                    product("Mauve Satin Party Dress", "Satin dress for date night, parties, and formal occasions.", "Dresses", "female", "Mauve", "solid", "Elegant", "hourglass,triangle", "party,date night,formal", "All season", "112.00", 15),
                    product("Olive Pleated Formal Dress", "Pleated formal dress for office events and ceremonies.", "Dresses", "female", "Olive", "pleated", "Formal", "rectangle,hourglass", "work,formal", "All season", "118.00", 14),

                    // FEMALE TOPS
                    product("Silk Wrap Blouse", "Elegant blouse for polished work and date night outfits.", "Tops", "female", "Ivory", "solid", "Elegant", "hourglass,triangle", "work,date night,party", "Summer", "72.00", 22),
                    product("Blue Ruffle Shirt Top", "Soft ruffle blouse for office and formal styling.", "Tops", "female", "Blue", "solid", "Elegant", "rectangle,hourglass", "work,formal", "All season", "62.00", 20),
                    product("Floral Off-Shoulder Crop Top", "Romantic floral crop top for casual and vacation outfits.", "Tops", "female", "White", "floral", "Romantic", "hourglass,rectangle", "casual,vacation,party", "Summer", "38.00", 30),
                    product("Cream One-Shoulder Top", "Minimal cream top for casual and date night looks.", "Tops", "female", "Cream", "solid", "Minimalist", "hourglass,rectangle", "casual,date night", "Summer", "42.00", 25),
                    product("White Long-Sleeve Crop Top", "Sporty long-sleeve crop top for active outfits.", "Tops", "female", "White", "solid", "Sporty", "athletic,rectangle", "gym,sport,casual", "All season", "34.00", 28),

                    // FEMALE BOTTOMS
                    product("Rust Wide-Leg Trousers", "Wide-leg trousers for classic casual styling.", "Bottoms", "female", "Rust", "solid", "Classic", "hourglass,triangle,rectangle", "casual,everyday,work", "All season", "74.00", 20),
                    product("Blue Wide-Leg Jeans", "Relaxed jeans for everyday and casual outfits.", "Bottoms", "female", "Blue", "denim", "Casual", "hourglass,triangle,rectangle", "casual,everyday", "All season", "86.00", 24),
                    product("Black Pleated Mini Skirt", "Preppy mini skirt for casual and party outfits.", "Bottoms", "female", "Black", "pleated", "Preppy", "rectangle,hourglass", "casual,party,date night", "Spring", "49.00", 30),
                    product("Emerald Pencil Skirt", "Formal pencil skirt for office-ready outfits.", "Bottoms", "female", "Emerald", "solid", "Formal", "hourglass,rectangle", "work,formal", "All season", "69.00", 18),
                    product("Black Pleated Tennis Skirt", "Sporty pleated skirt for gym-inspired casual outfits.", "Bottoms", "female", "Black", "pleated", "Sporty", "athletic,rectangle", "gym,sport,casual", "Summer", "44.00", 25),

                    // FEMALE OUTERWEAR / SWEATERS
                    product("Cable Knit Sweater", "Warm knit sweater for cold weather casual outfits.", "Tops", "female", "Beige", "knit", "Cozy", "all", "casual,everyday,work", "Winter", "76.00", 20),
                    product("Gray Knit Sweater", "Soft gray sweater for cozy everyday styling.", "Tops", "female", "Gray", "knit", "Cozy", "all", "casual,everyday", "Winter", "68.00", 22),
                    product("White Puffer Jacket", "Warm puffer jacket for winter outfit layering.", "Outerwear", "female", "White", "solid", "Cozy", "all", "casual,everyday", "Winter", "118.00", 12),
                    product("Cropped Denim Jacket", "Trendy denim jacket for casual outfits.", "Outerwear", "female", "Blue", "denim", "Casual", "rectangle,hourglass", "casual,everyday,vacation", "Spring", "82.00", 16),

                    // FEMALE SHOES
                    product("Women's Black Knee-High Boots", "Dressy black boots for formal and party outfits.", "Shoes", "female", "Black", "solid", "Elegant", "all", "party,date night,formal,work", "Fall", "128.00", 18),
                    product("Burgundy Heeled Sandals", "Heeled sandals for parties and evening looks.", "Shoes", "female", "Burgundy", "solid", "Glam", "all", "party,date night,formal", "Summer", "68.00", 20),
                    product("Embellished Flat Sandals", "Comfortable sandals for casual and vacation outfits.", "Shoes", "female", "Gold", "embellished", "Bohemian", "all", "casual,vacation,everyday", "Summer", "42.00", 25),
                    product("Women's White Running Sneakers", "Sporty sneakers for gym and casual outfits.", "Shoes", "female", "White", "solid", "Sporty", "all", "gym,sport,casual", "All season", "72.00", 20),
                    product("Women's Winter Slip-On Boots", "Warm boots for cold and rainy weather outfits.", "Shoes", "female", "Black", "solid", "Cozy", "all", "casual,everyday", "Winter", "72.00", 18),

                    // FEMALE ACCESSORIES
                    product("Gold Knot Necklace Set", "Classic gold necklace set for casual and dressy outfits.", "Accessories", "female", "Gold", "metallic", "Classic", "all", "casual,party,date night,formal", "All season", "38.00", 40),
                    product("Pearl Pendant Necklace Set", "Elegant pearl necklace for formal styling.", "Accessories", "female", "Pearl", "metallic", "Elegant", "all", "work,formal,date night", "All season", "44.00", 35),
                    product("Ruby Necklace and Earring Set", "Glam jewelry set for party and evening outfits.", "Accessories", "female", "Ruby", "metallic", "Glam", "all", "party,date night,formal", "All season", "48.00", 35),

                    // MALE TOPS
                    product("Men's Lightweight Short Sleeve Shirt", "Lightweight shirt for warm casual outfits.", "Tops", "male", "White", "solid", "Casual", "all", "casual,everyday,vacation", "Summer", "34.00", 25),
                    product("Men's Casual Tee", "Basic tee for everyday styling.", "Tops", "male", "Black", "solid", "Casual", "all", "casual,everyday", "All season", "28.00", 35),
                    product("Men's Wool Sweater", "Warm wool sweater for cold weather styling.", "Tops", "male", "Charcoal", "knit", "Classic", "all", "casual,everyday,work", "Winter", "82.00", 18),
                    product("Men's Quarter-Zip Sweater", "Smart sweater for date night and casual styling.", "Tops", "male", "Black", "knit", "Classic", "all", "casual,date night,work", "Winter", "74.00", 18),
                    product("Men's Yellow Sport Hoodie", "Sporty hoodie for athletic and casual looks.", "Tops", "male", "Yellow", "solid", "Sporty", "athletic,rectangle", "gym,sport,casual", "All season", "62.00", 20),

                    // MALE BOTTOMS
                    product("Men's Classic Trousers", "Classic trousers for work and date night outfits.", "Bottoms", "male", "Black", "solid", "Classic", "all", "work,formal,date night", "All season", "76.00", 20),
                    product("Men's Drawstring Trousers", "Relaxed trousers for casual and warm-weather outfits.", "Bottoms", "male", "Taupe", "solid", "Casual", "all", "casual,everyday,vacation", "Summer", "45.00", 25),
                    product("Men's Lightweight Chinos", "Smart chinos for work and casual outfits.", "Bottoms", "male", "Khaki", "solid", "Classic", "all", "work,casual,everyday", "All season", "58.00", 25),

                    // MALE OUTERWEAR
                    product("Men's Hooded Utility Jacket", "Utility jacket for cold casual outfits.", "Outerwear", "male", "Cream", "solid", "Casual", "all", "casual,everyday", "Fall", "108.00", 14),
                    product("Men's Varsity Jacket", "Streetwear jacket for casual styling.", "Outerwear", "male", "Black", "solid", "Streetwear", "all", "casual,everyday", "Fall", "96.00", 16),

                    // MALE SHOES
                    product("Men's Black Canvas Sneakers", "Casual sneakers for everyday outfits.", "Shoes", "male", "Black", "solid", "Casual", "all", "casual,everyday", "All season", "45.00", 30),
                    product("Men's Brown Oxford Dress Shoes", "Formal shoes for work, date night, and events.", "Shoes", "male", "Brown", "solid", "Formal", "all", "work,formal,date night", "All season", "118.00", 16),
                    product("Men's Blue Perforated Sneakers", "Sporty sneakers for gym and casual outfits.", "Shoes", "male", "Blue", "solid", "Sporty", "all", "gym,sport,casual", "All season", "72.00", 20),
                    product("Men's Knit Walking Sneakers", "Comfortable sneakers for everyday styling.", "Shoes", "male", "Brown", "solid", "Casual", "all", "casual,everyday", "All season", "69.00", 20)
            ));
        };
    }

    private Product product(
            String name,
            String description,
            String category,
            String gender,
            String color,
            String pattern,
            String style,
            String bodyTypeSuitable,
            String occasions,
            String season,
            String price,
            int stockQuantity
    ) {
        return Product.builder()
                .name(name)
                .description(description)
                .category(category)
                .gender(gender)
                .color(color)
                .pattern(pattern)
                .style(style)
                .bodyTypeSuitable(bodyTypeSuitable)
                .occasions(occasions)
                .season(season)
                .price(new BigDecimal(price))
                .stockQuantity(stockQuantity)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
    }
}