export function getRecommendationItems(recommendation = {}) {
  return [
    ...(recommendation.dresses || []),
    ...(recommendation.sweaters || []),
    ...(recommendation.sets || []),
    ...(recommendation.outerwear || []),
    ...(recommendation.top || []),
    ...(recommendation.bottom || []),
    ...(recommendation.shoes || []),
    ...(recommendation.accessories || []),
  ];
}

function buildVisualFallbackItems(recommendation = {}, context = {}) {
  const occasion = String(context.occasion || recommendation.occasion || "").toLowerCase();
  const weather = String(context.weather || recommendation.weather || "").toLowerCase();
  const gender = String(context.gender || recommendation.gender || "").toLowerCase();
  const style = String(context.style || "Classic");
  const currentItems = getRecommendationItems(recommendation);
  const budgetLimit = getBudgetLimit(context);
  const isMale = gender.includes("male");
  const isColdWeather = weather.includes("cold") || weather.includes("rainy");
  const hasSweater = currentItems.some((item) => {
    const text = `${item.name || ""} ${item.category || ""}`.toLowerCase();
    return text.includes("sweater") || text.includes("cardigan") || text.includes("sweatshirt") || text.includes("hoodie") || text.includes("jacket") || text.includes("coat") || text.includes("puffer") || text.includes("outerwear");
  });

  if (isColdWeather) {
    if (isMale) {
      if (currentItems.length > 0 && hasSweater) {
        return recommendation;
      }

      return {
        ...recommendation,
        top: [
          product("fallback-mens-wool-sweater", "Men's Wool Sweater", "Mens", "Charcoal", "Classic", 82),
          product("fallback-mens-quarter-zip-sweater", "Men's Quarter-Zip Sweater", "Mens", "Black", "Casual", 74),
        ],
        outerwear: [
          product("fallback-mens-hooded-utility-jacket", "Men's Hooded Utility Jacket", "Mens", "Cream", "Casual", 108),
        ],
        bottom: [
          product("fallback-mens-classic-trousers-cold", "Men's Classic Trousers", "Mens", "Black", "Classic", 76),
        ],
        shoes: [
          product("fallback-mens-brown-oxford-dress-shoes-cold", "Men's Brown Oxford Dress Shoes", "Shoes", "Brown", "Formal", 118),
          product("fallback-mens-knit-walking-sneakers-cold", "Men's Knit Walking Sneakers", "Shoes", "Brown", "Casual", 69),
        ],
      };
    }

    if (currentItems.length > 0 && hasSweater) {
      return recommendation;
    }

    if (currentItems.length > 0) {
      return {
        ...recommendation,
        sweaters: [
          ...(recommendation.sweaters || []),
          product("fallback-cable-knit-sweater", "Cable Knit Sweater", "Sweaters", "Beige", "Cozy", 76),
        ],
        outerwear: [
          ...(recommendation.outerwear || []),
          product("fallback-white-puffer-jacket", "White Puffer Jacket", "Outerwear", "White", "Cozy", 118),
        ],
      };
    }

    return {
      ...recommendation,
      sweaters: [
        product("fallback-cable-knit-sweater", "Cable Knit Sweater", "Sweaters", "Beige", "Cozy", 76),
        product("fallback-gray-knit-sweater", "Gray Knit Sweater", "Sweaters", "Gray", "Casual", 68),
      ],
      outerwear: [
        product("fallback-white-puffer-jacket", "White Puffer Jacket", "Outerwear", "White", "Cozy", 118),
      ],
      bottom: [
        product("fallback-blue-wide-leg-jeans-cold", "Blue Wide-Leg Jeans", "Bottoms", "Blue", "Classic", 86),
      ],
      shoes: [
        product("fallback-womens-fur-lined-winter-boots-cold", "Women's Fur-Lined Winter Boots", "Shoes", "Black", "Cozy", 84),
        product("fallback-womens-winter-slip-on-boots-cold", "Women's Winter Slip-On Boots", "Shoes", "Black", "Cozy", 72),
      ],
      accessories: [
        product("fallback-gold-chain-necklace-cold", "Gold Chain Necklace", "Accessories", "Gold", "Minimal", 32),
      ],
    };
  }

  if (isMale && currentItems.some((item) => conflictsWithMaleWarmQuiz(item, budgetLimit))) {
    return buildMaleWarmFallback(recommendation, style);
  }

  if (currentItems.length > 0) {
    return recommendation;
  }

  if (occasion.includes("date") || occasion.includes("party") || occasion.includes("evening")) {
    if (isMale) {
      return {
        ...recommendation,
        top: [
          product("fallback-mens-quarter-zip-sweater-evening", "Men's Quarter-Zip Sweater", "Mens", "Black", "Casual", 74),
        ],
        bottom: [
          product("fallback-mens-classic-trousers-evening", "Men's Classic Trousers", "Mens", "Black", "Classic", 76),
        ],
        shoes: [
          product("fallback-mens-leopard-slip-on-sneakers-evening", "Men's Leopard Slip-On Sneakers", "Shoes", "Leopard", "Edgy", 64),
          product("fallback-mens-brown-oxford-dress-shoes-evening", "Men's Brown Oxford Dress Shoes", "Shoes", "Brown", "Formal", 118),
        ],
      };
    }

    return {
      ...recommendation,
      dresses: [
        product("fallback-emerald-sequin-mini-dress", "Emerald Sequin Mini Dress", "Dresses", "Emerald", "Party", 98),
        product("fallback-mauve-satin-party-dress", "Mauve Satin Party Dress", "Dresses", "Mauve", "Party", 112),
      ],
      sets: [
        product("fallback-white-embellished-two-piece-set", "White Embellished Two-Piece Set", "Matching Sets", "White", "Party", 126),
        product("fallback-burgundy-mini-two-piece-set", "Burgundy Mini Two-Piece Set", "Matching Sets", "Burgundy", "Party", 78),
      ],
      bottom: [
        product("fallback-green-slit-maxi-skirt-party", "Green Slit Maxi Skirt", "Bottoms", "Green", "Elegant", 68),
        product("fallback-ivory-bow-satin-skirt-party", "Ivory Bow Satin Skirt", "Bottoms", "Ivory", "Elegant", 78),
      ],
      top: [
        product("fallback-satin-dressy-top-party", "Satin Dressy Top", "Tops", "Ivory", "Elegant", 54),
      ],
      shoes: [
        product("fallback-womens-black-knee-high-boots-party", "Women's Black Knee-High Boots", "Shoes", "Black", "Edgy", 128),
        product("fallback-burgundy-heeled-sandals-party", "Burgundy Heeled Sandals", "Shoes", "Burgundy", "Glam", 68),
      ],
      accessories: [
        product("fallback-ruby-necklace-and-earring-set", "Ruby Necklace and Earring Set", "Accessories", "Ruby", "Glam", 48),
        product("fallback-statement-silver-chain-necklace", "Statement Silver Chain Necklace", "Accessories", "Silver", "Statement", 46),
      ],
    };
  }

  if (isMale && (occasion.includes("casual") || occasion.includes("everyday") || occasion.includes("vacation") || occasion.includes("brunch"))) {
    return buildMaleWarmFallback(recommendation, style);
  }

  if (!gender.includes("male") && (occasion.includes("casual") || occasion.includes("everyday") || occasion.includes("vacation") || occasion.includes("brunch"))) {
    return {
      ...recommendation,
      dresses: [
        product("fallback-black-wrap-maxi-dress", "Black Wrap Maxi Dress", "Dresses", "Black", "Casual", 79),
        product("fallback-green-tiered-midi-dress", "Green Tiered Midi Dress", "Dresses", "Green", "Casual", 84),
      ],
      sets: [
        product("fallback-casual-cream-two-piece-set", "Casual Cream Two-Piece Set", "Matching Sets", "Cream", "Casual", 84),
        product("fallback-blue-lace-short-set", "Blue Lace Short Set", "Matching Sets", "Blue", "Romantic", 76),
      ],
      bottom: [
        product("fallback-rust-wide-leg-trousers-casual", "Rust Wide-Leg Trousers", "Bottoms", "Rust", "Classic", 74),
        product("fallback-neutral-maxi-skirt-casual", "Neutral Maxi Skirt", "Bottoms", "Neutral", "Boho", 58),
        product("fallback-pink-ribbed-midi-skirt-casual", "Pink Ribbed Midi Skirt", "Bottoms", "Pink", "Casual", 55),
      ],
      top: [
        product("fallback-floral-off-shoulder-crop-top", "Floral Off-Shoulder Crop Top", "Tops", "White", "Romantic", 38),
        product("fallback-cream-one-shoulder-top", "Cream One-Shoulder Top", "Tops", "Cream", "Minimal", 42),
      ],
      shoes: [
        product("fallback-embellished-flat-sandals-casual", "Embellished Flat Sandals", "Shoes", "Multi", "Boho", 42),
        product("fallback-metallic-wedge-sandals-casual", "Metallic Wedge Sandals", "Shoes", "Metallic", "Casual", 48),
      ],
      accessories: [
        product("fallback-emerald-drop-earrings", "Emerald Drop Earrings", "Accessories", "Green", "Romantic", 26),
        product("fallback-gold-knot-necklace-set", "Gold Knot Necklace Set", "Accessories", "Gold", "Classic", 38),
      ],
    };
  }

  if (!gender.includes("male") && (occasion.includes("work") || occasion.includes("office") || occasion.includes("formal") || style.toLowerCase().includes("formal"))) {
    return {
      ...recommendation,
      dresses: [
        product("fallback-gray-formal-skirt-suit", "Gray Formal Skirt Suit", "Dresses", "Gray", "Formal", 142),
        product("fallback-olive-pleated-formal-dress", "Olive Pleated Formal Dress", "Dresses", "Olive", "Formal", 118),
      ],
      sets: [
        product("fallback-pink-blazer-skirt-set", "Pink Blazer Skirt Set", "Matching Sets", "Pink", "Formal", 118),
      ],
      bottom: [
        product("fallback-emerald-pencil-skirt-formal", "Emerald Pencil Skirt", "Bottoms", "Emerald", "Formal", 69),
        product("fallback-cream-pleated-wrap-skirt-formal", "Cream Pleated Wrap Skirt", "Bottoms", "Cream", "Elegant", 72),
      ],
      shoes: [
        product("fallback-womens-black-knee-high-boots-formal", "Women's Black Knee-High Boots", "Shoes", "Black", "Classic", 128),
        product("fallback-burgundy-heeled-sandals-formal", "Burgundy Heeled Sandals", "Shoes", "Burgundy", "Glam", 68),
      ],
      accessories: [
        product("fallback-pearl-pendant-necklace-set", "Pearl Pendant Necklace Set", "Accessories", "Ivory", "Elegant", 44),
        product("fallback-ruby-necklace-and-earring-set-formal", "Ruby Necklace and Earring Set", "Accessories", "Ruby", "Glam", 48),
      ],
    };
  }

  if (occasion.includes("work") || occasion.includes("office")) {
    return {
      ...recommendation,
      top: [
        product("fallback-blue-ruffle-shirt-top", "Blue Ruffle Shirt Top", "Tops", "Blue", "Elegant", 62),
        product("fallback-satin-dressy-top", "Satin Dressy Top", "Tops", "Ivory", "Elegant", 54),
      ],
      bottom: [
        product(gender.includes("male") ? "fallback-mens-classic-trousers-work" : "fallback-wide-leg-denim-trousers-work", gender.includes("male") ? "Men's Classic Trousers" : "Wide-Leg Denim Trousers", gender.includes("male") ? "Mens" : "Bottoms", gender.includes("male") ? "Black" : "Blue", "Classic", gender.includes("male") ? 76 : 82),
      ],
      shoes: [
        product(gender.includes("male") ? "fallback-mens-brown-oxford-dress-shoes-work" : "fallback-womens-black-knee-high-boots-work", gender.includes("male") ? "Men's Brown Oxford Dress Shoes" : "Women's Black Knee-High Boots", "Shoes", gender.includes("male") ? "Brown" : "Black", gender.includes("male") ? "Formal" : "Classic", gender.includes("male") ? 118 : 128),
      ],
      accessories: [
        product("fallback-gold-knot-necklace-set-work", "Gold Knot Necklace Set", "Accessories", "Gold", "Classic", 38),
        product("fallback-pearl-pendant-necklace-set-work", "Pearl Pendant Necklace Set", "Accessories", "Ivory", "Elegant", 44),
      ],
    };
  }

  if (occasion.includes("gym") || occasion.includes("sport")) {
    if (gender.includes("male")) {
      return {
        ...recommendation,
        top: [
          product("fallback-mens-yellow-sport-hoodie", "Men's Yellow Sport Hoodie", "Mens", "Yellow", "Sporty", 62),
        ],
        bottom: [
          product("fallback-mens-drawstring-trousers-sport", "Men's Drawstring Trousers", "Mens", "Taupe", "Casual", 68),
        ],
        shoes: [
          product("fallback-mens-blue-perforated-sneakers-sport", "Men's Blue Perforated Sneakers", "Shoes", "Blue", "Sporty", 72),
          product("fallback-mens-retro-trainer-sneakers-sport", "Men's Retro Trainer Sneakers", "Shoes", "White", "Streetwear", 76),
        ],
      };
    }

    return {
      ...recommendation,
    top: [
      product("fallback-white-long-sleeve-crop-top-sport", "White Long-Sleeve Crop Top", "Tops", "White", "Sporty", 34),
      product("fallback-olive-athletic-crop-top-sport", "Olive Athletic Crop Top", "Tops", "Olive", "Sporty", 39),
    ],
      bottom: [
        product("fallback-light-cargo-jeans-sport", "Light Cargo Jeans", "Bottoms", "Light blue", "Streetwear", 79),
        product("fallback-black-pleated-tennis-skirt-sport", "Black Pleated Tennis Skirt", "Bottoms", "Black", "Sporty", 44),
      ],
      shoes: [
        product("fallback-womens-winter-slip-on-boots-sport", "Women's Winter Slip-On Boots", "Shoes", "Black", "Cozy", 72),
      ],
    };
  }

  return {
    ...recommendation,
    top: [
      product(gender.includes("male") ? "fallback-mens-wool-sweater-default" : "fallback-cashmere-sweater", gender.includes("male") ? "Men's Wool Sweater" : "Cashmere Sweater", gender.includes("male") ? "Mens" : "Sweaters", gender.includes("male") ? "Charcoal" : "Oat", style, gender.includes("male") ? 82 : 95),
    ],
    bottom: [
      product(gender.includes("male") ? "fallback-mens-classic-trousers-default" : "fallback-denim-statement-jeans", gender.includes("male") ? "Men's Classic Trousers" : "Denim Statement Jeans", gender.includes("male") ? "Mens" : "Bottoms", gender.includes("male") ? "Black" : "Blue", gender.includes("male") ? "Classic" : "Edgy", gender.includes("male") ? 76 : 88),
      ...(!gender.includes("male") ? [product("fallback-black-pleated-mini-skirt", "Black Pleated Mini Skirt", "Bottoms", "Black", "Preppy", 49)] : []),
    ],
    shoes: [
      product(gender.includes("male") ? "fallback-mens-black-canvas-sneakers" : "fallback-womens-black-knee-high-boots", gender.includes("male") ? "Men's Black Canvas Sneakers" : "Women's Black Knee-High Boots", "Shoes", gender.includes("male") ? "Black" : "Black", gender.includes("male") ? "Casual" : "Edgy", gender.includes("male") ? 58 : 128),
      ...(gender.includes("male") ? [product("fallback-mens-knit-walking-sneakers", "Men's Knit Walking Sneakers", "Shoes", "Brown", "Casual", 69)] : []),
    ],
    accessories: [
      product("fallback-silver-hoop-earrings", "Silver Hoop Earrings", "Accessories", "Silver", "Edgy", 24),
      product("fallback-layered-silver-necklace", "Layered Silver Necklace", "Accessories", "Silver", "Edgy", 42),
    ],
  };
}

export function withVisualFallbackItems(recommendation = {}, context = {}) {
  return selectCompleteOutfit(buildVisualFallbackItems(recommendation, context), context);
}

function selectCompleteOutfit(recommendation = {}, context = {}) {
  const selected = { ...recommendation };
  const keys = ["dresses", "sweaters", "sets", "outerwear", "top", "bottom", "shoes", "accessories"];
  const gender = String(context.gender || recommendation.gender || "").toLowerCase();
  const weather = String(context.weather || recommendation.weather || "").toLowerCase();
  const budgetLimit = getBudgetLimit(context);
  const isColdWeather = weather.includes("cold") || weather.includes("rainy");

  keys.forEach((key) => {
    if (!Array.isArray(selected[key])) return;
    const affordable = selected[key].filter((item) => isWithinBudget(item, budgetLimit));
    if (affordable.length) {
      selected[key] = affordable;
    }
  });

  keys.forEach((key) => {
    if (Array.isArray(selected[key]) && selected[key].length > 1) {
      selected[key] = [chooseOne(selected[key])];
    }
  });

  if (!isColdWeather && !gender.includes("male")) {
    const outfitTypes = [];
    if (selected.dresses?.length) outfitTypes.push("dress");
    if (selected.sets?.length) outfitTypes.push("set");
    if (selected.top?.length && selected.bottom?.length) outfitTypes.push("separates");

    const outfitType = chooseOne(outfitTypes);
    if (outfitType === "dress") {
      delete selected.sets;
      delete selected.top;
      delete selected.bottom;
    } else if (outfitType === "set") {
      delete selected.dresses;
      delete selected.top;
      delete selected.bottom;
    } else if (outfitType === "separates") {
      delete selected.dresses;
      delete selected.sets;
    }
  }

  if (gender.includes("male")) {
    delete selected.dresses;
    delete selected.sets;
    delete selected.sweaters;
    delete selected.accessories;

    if (!isColdWeather) {
      delete selected.outerwear;
    }
  }

  const generatedAt = new Date().toISOString();
  return {
    ...selected,
    outfitId: selected.outfitId || `visual-${generatedAt}-${Math.random().toString(36).slice(2, 7)}`,
    generatedAt: selected.generatedAt || generatedAt,
  };
}

function buildMaleWarmFallback(recommendation, style) {
  return {
    ...recommendation,
    top: [
      product("fallback-mens-lightweight-shirt-warm", "Men's Lightweight Short Sleeve Shirt", "Mens", "White", style, 34),
      product("fallback-mens-casual-tee-warm", "Men's Casual Tee", "Mens", "Black", "Casual", 28),
    ],
    bottom: [
      product("fallback-mens-drawstring-trousers-warm", "Men's Drawstring Trousers", "Mens", "Taupe", "Casual", 45),
      product("fallback-mens-lightweight-chinos-warm", "Men's Lightweight Chinos", "Mens", "Khaki", "Classic", 42),
    ],
    shoes: [
      product("fallback-mens-black-canvas-sneakers-warm", "Men's Black Canvas Sneakers", "Shoes", "Black", "Casual", 45),
    ],
    accessories: [],
  };
}

function conflictsWithMaleWarmQuiz(item, budgetLimit) {
  const text = `${item.name || ""} ${item.category || ""}`.toLowerCase();
  const isColdItem = ["sweater", "cardigan", "hoodie", "jacket", "coat", "puffer", "outerwear", "winter"].some((word) => text.includes(word));
  const isWomenAccessory = ["earring", "necklace", "jewelry", "jewellery"].some((word) => text.includes(word));
  return !isWithinBudget(item, budgetLimit) || isColdItem || isWomenAccessory;
}

function getBudgetLimit(context = {}) {
  const text = String(context.budget || context.budgetRange || "").toLowerCase();
  if (!text) return Infinity;
  if (text.includes("under")) {
    const underAmount = text.match(/\$?\s*(\d+)/);
    return underAmount ? Number(underAmount[1]) : 50;
  }

  const amounts = [...text.matchAll(/\$?\s*(\d+)/g)].map((match) => Number(match[1]));
  return amounts.length ? Math.max(...amounts) : Infinity;
}

function isWithinBudget(item, budgetLimit) {
  if (!Number.isFinite(budgetLimit)) return true;
  const price = Number(item?.price);
  return Number.isFinite(price) && price <= budgetLimit;
}

function chooseOne(items = []) {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

function product(id, name, category, color, style, price) {
  return {
    id,
    name,
    category,
    color,
    style,
    price,
  };
}
