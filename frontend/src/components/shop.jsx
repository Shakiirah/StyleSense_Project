import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  ChevronDown,
  X,
  Shirt,
  Footprints,
  Gem,
  Plus,
  Check,
} from "lucide-react";
import "./shop.css";
import { useShop } from "./context/ShopContext";
import { api, getToken } from "../services/api";
import { fallbackImage, getProductImage } from "../utils/styleImages";

const CATEGORIES = ["All", "Dresses", "Tops", "Sweaters", "Bottoms", "Outerwear", "Shoes", "Accessories"];

const WOMEN_SWEATER_PRODUCTS = [
  {
    id: 7101,
    name: "Cable Knit Sweater",
    description: "Warm oversized cable knit sweater for cold weather styling.",
    category: "Sweaters",
    gender: "female",
    color: "Beige",
    pattern: "knit",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "everyday,casual,work",
    season: "Winter",
    price: 76,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
  {
    id: 7102,
    name: "Gray Knit Sweater",
    description: "Soft gray knit sweater for layered cold and rainy outfits.",
    category: "Sweaters",
    gender: "female",
    color: "Gray",
    pattern: "knit",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "everyday,casual,campus",
    season: "Winter",
    price: 68,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 7103,
    name: "Strawberry Cardigan",
    description: "Playful warm cardigan for cute rainy-day layering.",
    category: "Sweaters",
    gender: "female",
    color: "Cream",
    pattern: "embroidered",
    style: "Cute",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday",
    season: "Winter",
    price: 64,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 7104,
    name: "Graphic Sweatshirt",
    description: "Casual black sweatshirt for cozy everyday looks.",
    category: "Sweaters",
    gender: "female",
    color: "Black",
    pattern: "graphic",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,campus,everyday",
    season: "Fall",
    price: 58,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
];

const MEN_SWEATER_PRODUCTS = [
  {
    id: 7201,
    name: "Men's Wool Sweater",
    description: "Warm men's sweater for cold-weather everyday styling.",
    category: "Mens",
    gender: "male",
    color: "Charcoal",
    pattern: "knit",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "everyday,casual,work",
    season: "Winter",
    price: 82,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 7202,
    name: "Men's Quarter-Zip Sweater",
    description: "Patterned quarter-zip sweater for men's cold or rainy outfits.",
    category: "Mens",
    gender: "male",
    color: "Black",
    pattern: "fair isle",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Winter",
    price: 74,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_CASUAL_DRESS_PRODUCTS = [
  {
    id: 7301,
    name: "Black Wrap Maxi Dress",
    description: "Easy black maxi dress for relaxed everyday styling.",
    category: "Dresses",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,vacation",
    season: "Summer",
    price: 79,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 7302,
    name: "Green Tiered Midi Dress",
    description: "Casual green tiered dress for polished daytime outfits.",
    category: "Dresses",
    gender: "female",
    color: "Green",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,brunch",
    season: "Spring",
    price: 84,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 7303,
    name: "Black Flutter Sleeve Dress",
    description: "Flowy casual dress for warm days and vacation styling.",
    category: "Dresses",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,vacation,everyday",
    season: "Summer",
    price: 69,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 7304,
    name: "Burgundy Handkerchief Dress",
    description: "Casual burgundy dress that can be styled for day or evening.",
    category: "Dresses",
    gender: "female",
    color: "Burgundy",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,date night,everyday",
    season: "Fall",
    price: 88,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 7305,
    name: "Floral Swing Mini Dress",
    description: "Light floral mini dress for casual spring and summer outfits.",
    category: "Dresses",
    gender: "female",
    color: "Cream",
    pattern: "floral",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,brunch",
    season: "Spring",
    price: 62,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_FORMAL_PRODUCTS = [
  {
    id: 7401,
    name: "Gray Formal Skirt Suit",
    description: "Polished women's formal skirt suit for work and professional events.",
    category: "Dresses",
    gender: "female",
    color: "Gray",
    pattern: "tweed",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "work,formal,business",
    season: "All season",
    price: 142,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 7402,
    name: "Olive Pleated Formal Dress",
    description: "Structured olive formal dress for office and professional occasions.",
    category: "Dresses",
    gender: "female",
    color: "Olive",
    pattern: "solid",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "work,formal,business",
    season: "All season",
    price: 118,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 7403,
    name: "Formal Sheath Dress",
    description: "Elegant formal dress for business meetings and polished events.",
    category: "Dresses",
    gender: "female",
    color: "Navy",
    pattern: "solid",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "work,formal,event",
    season: "All season",
    price: 126,
    stockQuantity: 10,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_MAXI_DRESS_PRODUCTS = [
  {
    id: 7501,
    name: "Ivory Beaded Maxi Dress",
    description: "Elegant ivory maxi dress for dressy events and summer occasions.",
    category: "Dresses",
    gender: "female",
    color: "Ivory",
    pattern: "beaded",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "party,formal,event,wedding",
    season: "Summer",
    price: 138,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 7502,
    name: "Yellow Floral Maxi Dress",
    description: "Bright floral maxi dress for vacations, brunch, and outdoor parties.",
    category: "Dresses",
    gender: "female",
    color: "Yellow",
    pattern: "floral",
    style: "Bohemian",
    bodyTypeSuitable: "all",
    occasions: "vacation,casual,party",
    season: "Summer",
    price: 96,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 7503,
    name: "Navy Evening Maxi Dress",
    description: "Polished navy maxi dress for evening and formal occasions.",
    category: "Dresses",
    gender: "female",
    color: "Navy",
    pattern: "solid",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "evening,formal,party",
    season: "All season",
    price: 124,
    stockQuantity: 10,
    stores: ["StyleSense Store"],
  },
  {
    id: 7504,
    name: "Rose Floral Maxi Dress",
    description: "Soft floral maxi dress for garden parties and daytime events.",
    category: "Dresses",
    gender: "female",
    color: "White",
    pattern: "floral",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "party,brunch,vacation",
    season: "Spring",
    price: 91,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 7505,
    name: "Pastel Bow Maxi Dress",
    description: "Statement pastel maxi dress with a bow detail for special events.",
    category: "Dresses",
    gender: "female",
    color: "Pastel",
    pattern: "floral",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "party,wedding,event",
    season: "Spring",
    price: 132,
    stockQuantity: 9,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_PARTY_DRESS_PRODUCTS = [
  {
    id: 7601,
    name: "Black Party Dress",
    description: "Classic black party dress for evening plans and celebrations.",
    category: "Dresses",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,date night,evening",
    season: "All season",
    price: 86,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 7602,
    name: "Emerald Sequin Mini Dress",
    description: "Sparkly green mini dress for parties and night-out outfits.",
    category: "Dresses",
    gender: "female",
    color: "Emerald",
    pattern: "sequin",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,date night,evening",
    season: "All season",
    price: 98,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
  {
    id: 7603,
    name: "Mauve Satin Party Dress",
    description: "Satin party dress for date night and elegant celebrations.",
    category: "Dresses",
    gender: "female",
    color: "Mauve",
    pattern: "solid",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,date night,evening",
    season: "All season",
    price: 112,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 7604,
    name: "Red Satin Party Dress",
    description: "Bold red satin dress for statement evening looks.",
    category: "Dresses",
    gender: "female",
    color: "Red",
    pattern: "solid",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,date night,evening",
    season: "All season",
    price: 118,
    stockQuantity: 10,
    stores: ["StyleSense Store"],
  },
  {
    id: 7605,
    name: "Champagne Sequin Party Dress",
    description: "Glam champagne sequin dress for celebrations and formal parties.",
    category: "Dresses",
    gender: "female",
    color: "Champagne",
    pattern: "sequin",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,evening,event",
    season: "All season",
    price: 128,
    stockQuantity: 11,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_HOODIE_PRODUCTS = [
  {
    id: 7701,
    name: "Gray Logo Hoodie",
    description: "Cozy gray women's hoodie for casual everyday outfits.",
    category: "Tops",
    gender: "female",
    color: "Gray",
    pattern: "graphic",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Fall",
    price: 58,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 7702,
    name: "Soft Casual Hoodie",
    description: "Relaxed women's hoodie for comfortable casual styling.",
    category: "Tops",
    gender: "female",
    color: "Neutral",
    pattern: "solid",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Fall",
    price: 54,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 7703,
    name: "Black Graphic Hoodie",
    description: "Oversized black graphic hoodie for edgy casual looks.",
    category: "Tops",
    gender: "female",
    color: "Black",
    pattern: "graphic",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,campus,everyday,gym",
    season: "Fall",
    price: 64,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
];

const MEN_HOODIE_PRODUCTS = [
  {
    id: 7801,
    name: "Men's Yellow Sport Hoodie",
    description: "Bright men's sport hoodie for casual and active outfits.",
    category: "Mens",
    gender: "male",
    color: "Yellow",
    pattern: "graphic",
    style: "Sporty",
    bodyTypeSuitable: "all",
    occasions: "casual,gym,sport,campus",
    season: "Fall",
    price: 62,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 7802,
    name: "Men's Gray Graphic Hoodie",
    description: "Relaxed gray graphic hoodie for everyday streetwear looks.",
    category: "Mens",
    gender: "male",
    color: "Gray",
    pattern: "graphic",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Fall",
    price: 59,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_JACKET_PRODUCTS = [
  {
    id: 7901,
    name: "White Puffer Jacket",
    description: "Warm white puffer jacket for cold-weather casual outfits.",
    category: "Outerwear",
    gender: "female",
    color: "White",
    pattern: "solid",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,winter",
    season: "Winter",
    price: 118,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 7902,
    name: "Black Contrast Coat",
    description: "Chic black coat with contrast lapel details for polished layering.",
    category: "Outerwear",
    gender: "female",
    color: "Black",
    pattern: "contrast",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "work,casual,evening",
    season: "Fall",
    price: 104,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 7903,
    name: "Cropped Denim Jacket",
    description: "Cropped denim jacket for relaxed layering over dresses and tops.",
    category: "Outerwear",
    gender: "female",
    color: "Denim",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Spring",
    price: 72,
    stockQuantity: 17,
    stores: ["StyleSense Store"],
  },
];

const MEN_JACKET_PRODUCTS = [
  {
    id: 8001,
    name: "Men's Hooded Utility Jacket",
    description: "Light hooded utility jacket for men's cold-weather layering.",
    category: "Mens",
    gender: "male",
    color: "Cream",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Winter",
    price: 108,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
  {
    id: 8002,
    name: "Men's Varsity Jacket",
    description: "Brown varsity jacket for relaxed men's streetwear outfits.",
    category: "Mens",
    gender: "male",
    color: "Brown",
    pattern: "contrast",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "Fall",
    price: 94,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
];

const MEN_TROUSER_PRODUCTS = [
  {
    id: 8101,
    name: "Men's Classic Trousers",
    description: "Classic men's trousers for clean everyday and smart-casual outfits.",
    category: "Mens",
    gender: "male",
    color: "Black",
    pattern: "solid",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "work,casual,everyday",
    season: "All season",
    price: 76,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8102,
    name: "Men's Drawstring Trousers",
    description: "Comfortable drawstring trousers for relaxed men's casual styling.",
    category: "Mens",
    gender: "male",
    color: "Taupe",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 68,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
];

const MEN_SHOE_PRODUCTS = [
  {
    id: 8601,
    name: "Men's Black Canvas Sneakers",
    description: "Classic black low-top sneakers for casual everyday outfits.",
    category: "Shoes",
    gender: "male",
    color: "Black",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 58,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
  {
    id: 8602,
    name: "Men's Blue Perforated Sneakers",
    description: "Blue lace-up sneakers with a clean sporty finish.",
    category: "Shoes",
    gender: "male",
    color: "Blue",
    pattern: "perforated",
    style: "Sporty",
    bodyTypeSuitable: "all",
    occasions: "casual,sport,everyday",
    season: "All season",
    price: 72,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8603,
    name: "Men's Retro Trainer Sneakers",
    description: "Retro trainer sneakers for active and streetwear looks.",
    category: "Shoes",
    gender: "male",
    color: "White",
    pattern: "colorblock",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,sport,streetwear",
    season: "All season",
    price: 76,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8604,
    name: "Men's Leopard Slip-On Sneakers",
    description: "Statement slip-on sneakers for bold casual styling.",
    category: "Shoes",
    gender: "male",
    color: "Leopard",
    pattern: "animal print",
    style: "Edgy",
    bodyTypeSuitable: "all",
    occasions: "casual,date night,streetwear",
    season: "All season",
    price: 64,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
  {
    id: 8605,
    name: "Men's Knit Walking Sneakers",
    description: "Lightweight knit sneakers for relaxed all-day comfort.",
    category: "Shoes",
    gender: "male",
    color: "Brown",
    pattern: "knit",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,travel",
    season: "All season",
    price: 69,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8606,
    name: "Men's Brown Oxford Dress Shoes",
    description: "Polished brown Oxford dress shoes for formal outfits.",
    category: "Shoes",
    gender: "male",
    color: "Brown",
    pattern: "solid",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "formal,work,event",
    season: "All season",
    price: 118,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_FOOTWEAR_PRODUCTS = [
  {
    id: 8801,
    name: "Women's Winter Slip-On Boots",
    description: "Warm black slip-on boots with soft trim for cold everyday outfits.",
    category: "Shoes",
    gender: "female",
    color: "Black",
    pattern: "quilted",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,travel",
    season: "Winter",
    price: 72,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8802,
    name: "Women's Fur-Lined Winter Boots",
    description: "Fur-lined winter boots for rainy and cold weather styling.",
    category: "Shoes",
    gender: "female",
    color: "Black",
    pattern: "quilted",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,winter,rainy,cold",
    season: "Winter",
    price: 84,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8803,
    name: "Women's Black Knee-High Boots",
    description: "Sleek black knee-high boots for dresses, skirts, and evening outfits.",
    category: "Shoes",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Edgy",
    bodyTypeSuitable: "all",
    occasions: "date night,party,formal,work",
    season: "Fall",
    price: 128,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 8804,
    name: "Burgundy Heeled Sandals",
    description: "Burgundy strappy heeled sandals for party and date-night looks.",
    category: "Shoes",
    gender: "female",
    color: "Burgundy",
    pattern: "solid",
    style: "Glam",
    bodyTypeSuitable: "all",
    occasions: "party,date night,formal",
    season: "Spring",
    price: 68,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8805,
    name: "Embellished Flat Sandals",
    description: "Decorative flat sandals for casual dresses, skirts, and vacation outfits.",
    category: "Shoes",
    gender: "female",
    color: "Multi",
    pattern: "embellished",
    style: "Boho",
    bodyTypeSuitable: "all",
    occasions: "casual,vacation,brunch,everyday",
    season: "Summer",
    price: 42,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8806,
    name: "Metallic Wedge Sandals",
    description: "Comfortable metallic wedge sandals for warm-weather outfits.",
    category: "Shoes",
    gender: "female",
    color: "Metallic",
    pattern: "embellished",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,vacation,brunch,everyday",
    season: "Summer",
    price: 48,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
];

const ACCESSORY_PRODUCTS = [
  {
    id: 8701,
    name: "Gold Knot Necklace Set",
    description: "Gold knot necklace with matching earrings for polished everyday styling.",
    category: "Accessories",
    gender: "unisex",
    color: "Gold",
    pattern: "metallic",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "work,formal,date night,party",
    season: "All season",
    price: 38,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8702,
    name: "Emerald Drop Earrings",
    description: "Long gold drop earrings with emerald bead details.",
    category: "Accessories",
    gender: "unisex",
    color: "Green",
    pattern: "beaded",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "casual,brunch,date night",
    season: "All season",
    price: 26,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8703,
    name: "Ruby Necklace and Earring Set",
    description: "Ruby pendant necklace with matching earrings for elegant events.",
    category: "Accessories",
    gender: "unisex",
    color: "Ruby",
    pattern: "gemstone",
    style: "Glam",
    bodyTypeSuitable: "all",
    occasions: "formal,party,event,date night",
    season: "All season",
    price: 48,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 8704,
    name: "Silver Hoop Earrings",
    description: "Chunky silver chain-link hoops for bold streetwear looks.",
    category: "Accessories",
    gender: "unisex",
    color: "Silver",
    pattern: "chain",
    style: "Edgy",
    bodyTypeSuitable: "all",
    occasions: "casual,streetwear,date night",
    season: "All season",
    price: 24,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
  {
    id: 8705,
    name: "Gold Chain Necklace",
    description: "Gold chain necklace for simple, warm-toned outfit finishing.",
    category: "Accessories",
    gender: "unisex",
    color: "Gold",
    pattern: "chain",
    style: "Minimal",
    bodyTypeSuitable: "all",
    occasions: "casual,work,everyday",
    season: "All season",
    price: 32,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8706,
    name: "Layered Silver Necklace",
    description: "Layered silver chains for modern edgy styling.",
    category: "Accessories",
    gender: "unisex",
    color: "Silver",
    pattern: "layered chain",
    style: "Edgy",
    bodyTypeSuitable: "all",
    occasions: "party,streetwear,date night",
    season: "All season",
    price: 42,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8707,
    name: "Pearl Pendant Necklace Set",
    description: "Delicate pendant necklace with matching earrings for refined outfits.",
    category: "Accessories",
    gender: "unisex",
    color: "Ivory",
    pattern: "pearl",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "formal,work,event",
    season: "All season",
    price: 44,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8708,
    name: "Statement Silver Chain Necklace",
    description: "Bold layered silver chain necklace for standout evening outfits.",
    category: "Accessories",
    gender: "unisex",
    color: "Silver",
    pattern: "chain",
    style: "Statement",
    bodyTypeSuitable: "all",
    occasions: "party,streetwear,evening,date night",
    season: "All season",
    price: 46,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_TROUSER_PRODUCTS = [
  {
    id: 8201,
    name: "Rust Wide-Leg Trousers",
    description: "Warm rust wide-leg trousers for polished casual outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Rust",
    pattern: "solid",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "casual,brunch,work",
    season: "Fall",
    price: 74,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8202,
    name: "Wide-Leg Denim Trousers",
    description: "Wide-leg denim trousers for relaxed everyday styling.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 82,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8203,
    name: "Teal Palazzo Trousers",
    description: "Flowy teal palazzo trousers for comfortable statement looks.",
    category: "Bottoms",
    gender: "female",
    color: "Teal",
    pattern: "floral",
    style: "Boho",
    bodyTypeSuitable: "all",
    occasions: "casual,vacation,brunch",
    season: "Summer",
    price: 64,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8204,
    name: "Cargo Denim Jeans",
    description: "Pocket-detail cargo denim jeans for casual streetwear outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 78,
    stockQuantity: 17,
    stores: ["StyleSense Store"],
  },
  {
    id: 8205,
    name: "Straight-Leg Jeans",
    description: "Simple straight-leg jeans for easy everyday styling.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday",
    season: "All season",
    price: 69,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
  {
    id: 8206,
    name: "Light Wash Jeans",
    description: "Light wash jeans for soft casual and weekend outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Light blue",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday",
    season: "Spring",
    price: 72,
    stockQuantity: 21,
    stores: ["StyleSense Store"],
  },
  {
    id: 8207,
    name: "Blue Wide-Leg Jeans",
    description: "Wide-leg blue jeans for a clean modern denim silhouette.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,work",
    season: "All season",
    price: 86,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8208,
    name: "Relaxed Denim Jeans",
    description: "Relaxed denim jeans for comfortable everyday styling.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 70,
    stockQuantity: 19,
    stores: ["StyleSense Store"],
  },
  {
    id: 8209,
    name: "Light Cargo Jeans",
    description: "Light cargo jeans with a relaxed fit for streetwear outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Light blue",
    pattern: "denim",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "casual,campus,everyday",
    season: "All season",
    price: 79,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8210,
    name: "Denim Statement Jeans",
    description: "Statement denim jeans with a structured fashion-forward look.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Edgy",
    bodyTypeSuitable: "all",
    occasions: "casual,streetwear,everyday",
    season: "All season",
    price: 88,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_MATCHING_SET_PRODUCTS = [
  {
    id: 8301,
    name: "White Embellished Two-Piece Set",
    description: "Elegant white two-piece set with floral embellishments for dressy occasions.",
    category: "Matching Sets",
    gender: "female",
    color: "White",
    pattern: "embellished",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,evening,event,date night",
    season: "All season",
    price: 126,
    stockQuantity: 10,
    stores: ["StyleSense Store"],
  },
  {
    id: 8302,
    name: "Pink Blazer Skirt Set",
    description: "Bold pink blazer and skirt set for confident formal or party styling.",
    category: "Matching Sets",
    gender: "female",
    color: "Pink",
    pattern: "solid",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "work,party,evening",
    season: "All season",
    price: 118,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 8303,
    name: "Floral Satin Coord Set",
    description: "Soft floral coordinated set with a polished vacation-ready feel.",
    category: "Matching Sets",
    gender: "female",
    color: "Floral",
    pattern: "floral",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "brunch,vacation,evening",
    season: "Spring",
    price: 96,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 8304,
    name: "Neutral Knit Matching Set",
    description: "Comfortable neutral matching set for cozy everyday styling.",
    category: "Matching Sets",
    gender: "female",
    color: "Neutral",
    pattern: "knit",
    style: "Cozy",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,travel",
    season: "Fall",
    price: 89,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8305,
    name: "Crochet Top Skirt Set",
    description: "Crochet top and flowy skirt set for breezy boho outfits.",
    category: "Matching Sets",
    gender: "female",
    color: "Burgundy",
    pattern: "crochet",
    style: "Boho",
    bodyTypeSuitable: "all",
    occasions: "vacation,brunch,casual",
    season: "Summer",
    price: 92,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
  {
    id: 8306,
    name: "Casual Cream Two-Piece Set",
    description: "Easy cream two-piece outfit for relaxed casual days.",
    category: "Matching Sets",
    gender: "female",
    color: "Cream",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,brunch",
    season: "All season",
    price: 84,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8307,
    name: "Burgundy Mini Two-Piece Set",
    description: "Burgundy mini two-piece look for party and date-night styling.",
    category: "Matching Sets",
    gender: "female",
    color: "Burgundy",
    pattern: "solid",
    style: "Party",
    bodyTypeSuitable: "all",
    occasions: "party,date night,evening",
    season: "All season",
    price: 78,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8308,
    name: "Blue Lace Short Set",
    description: "Blue lace short set with a feminine summer-ready finish.",
    category: "Matching Sets",
    gender: "female",
    color: "Blue",
    pattern: "lace",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "brunch,vacation,casual",
    season: "Summer",
    price: 76,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_TOP_PRODUCTS = [
  {
    id: 8401,
    name: "Blue Ruffle Shirt Top",
    description: "Structured blue shirt top with a ruffled hem for polished styling.",
    category: "Tops",
    gender: "female",
    color: "Blue",
    pattern: "solid",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "work,formal,brunch",
    season: "All season",
    price: 62,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8402,
    name: "Floral Off-Shoulder Crop Top",
    description: "White floral off-shoulder crop top for breezy casual outfits.",
    category: "Tops",
    gender: "female",
    color: "White",
    pattern: "floral",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "casual,brunch,vacation",
    season: "Summer",
    price: 38,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8403,
    name: "Pink Petal Sleeve Top",
    description: "Soft pink off-shoulder top with statement petal sleeves.",
    category: "Tops",
    gender: "female",
    color: "Pink",
    pattern: "solid",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "date night,brunch,party",
    season: "Spring",
    price: 44,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8404,
    name: "Cream One-Shoulder Top",
    description: "Minimal one-shoulder cream top for clean modern styling.",
    category: "Tops",
    gender: "female",
    color: "Cream",
    pattern: "solid",
    style: "Minimal",
    bodyTypeSuitable: "all",
    occasions: "casual,date night,brunch",
    season: "All season",
    price: 42,
    stockQuantity: 19,
    stores: ["StyleSense Store"],
  },
  {
    id: 8405,
    name: "Red Peplum Blouse",
    description: "Red peplum blouse for feminine casual and evening outfits.",
    category: "Tops",
    gender: "female",
    color: "Red",
    pattern: "solid",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "date night,party,brunch",
    season: "All season",
    price: 58,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 8406,
    name: "Black Fitted Crop Tee",
    description: "Simple black fitted crop tee for everyday styling.",
    category: "Tops",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 28,
    stockQuantity: 24,
    stores: ["StyleSense Store"],
  },
  {
    id: 8407,
    name: "White Long-Sleeve Crop Top",
    description: "White long-sleeve crop top for sporty casual looks.",
    category: "Tops",
    gender: "female",
    color: "White",
    pattern: "solid",
    style: "Sporty",
    bodyTypeSuitable: "all",
    occasions: "gym,sport,casual",
    season: "All season",
    price: 34,
    stockQuantity: 22,
    stores: ["StyleSense Store"],
  },
  {
    id: 8408,
    name: "Olive Athletic Crop Top",
    description: "Olive long-sleeve athletic crop top for active casual outfits.",
    category: "Tops",
    gender: "female",
    color: "Olive",
    pattern: "solid",
    style: "Sporty",
    bodyTypeSuitable: "all",
    occasions: "gym,sport,casual",
    season: "All season",
    price: 39,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8409,
    name: "Satin Dressy Top",
    description: "Dressy satin-inspired top for polished evening outfits.",
    category: "Tops",
    gender: "female",
    color: "Ivory",
    pattern: "solid",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "evening,date night,party",
    season: "All season",
    price: 54,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8410,
    name: "Soft Casual Top",
    description: "Soft everyday top for simple relaxed styling.",
    category: "Tops",
    gender: "female",
    color: "Neutral",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday",
    season: "All season",
    price: 36,
    stockQuantity: 21,
    stores: ["StyleSense Store"],
  },
  {
    id: 8411,
    name: "Neutral Crop Top",
    description: "Neutral cropped top for clean denim and skirt pairings.",
    category: "Tops",
    gender: "female",
    color: "Neutral",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,brunch",
    season: "All season",
    price: 32,
    stockQuantity: 20,
    stores: ["StyleSense Store"],
  },
  {
    id: 8412,
    name: "Statement Crop Top",
    description: "Statement crop top for going-out and casual streetwear outfits.",
    category: "Tops",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Streetwear",
    bodyTypeSuitable: "all",
    occasions: "party,casual,date night",
    season: "All season",
    price: 46,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
];

const WOMEN_SKIRT_PRODUCTS = [
  {
    id: 8501,
    name: "Denim Mini Skirt",
    description: "Easy denim mini skirt for casual everyday outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Blue",
    pattern: "denim",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday,campus",
    season: "All season",
    price: 46,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8502,
    name: "Ribbed Midi Skirt",
    description: "Soft ribbed midi skirt for clean casual styling.",
    category: "Bottoms",
    gender: "female",
    color: "Neutral",
    pattern: "ribbed",
    style: "Minimal",
    bodyTypeSuitable: "all",
    occasions: "casual,brunch,everyday",
    season: "All season",
    price: 52,
    stockQuantity: 17,
    stores: ["StyleSense Store"],
  },
  {
    id: 8503,
    name: "Tan Button Midi Skirt",
    description: "Tan button-detail midi skirt for polished daytime outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Tan",
    pattern: "solid",
    style: "Classic",
    bodyTypeSuitable: "all",
    occasions: "work,brunch,casual",
    season: "Fall",
    price: 64,
    stockQuantity: 15,
    stores: ["StyleSense Store"],
  },
  {
    id: 8504,
    name: "Neutral Maxi Skirt",
    description: "Flowy neutral maxi skirt for relaxed boho-inspired looks.",
    category: "Bottoms",
    gender: "female",
    color: "Neutral",
    pattern: "solid",
    style: "Boho",
    bodyTypeSuitable: "all",
    occasions: "casual,vacation,brunch",
    season: "Summer",
    price: 58,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8505,
    name: "Black Pleated Mini Skirt",
    description: "Black pleated mini skirt for preppy and streetwear outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Black",
    pattern: "pleated",
    style: "Preppy",
    bodyTypeSuitable: "all",
    occasions: "casual,campus,date night",
    season: "All season",
    price: 49,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8506,
    name: "Floral A-Line Skirt",
    description: "Floral A-line skirt for feminine brunch and work looks.",
    category: "Bottoms",
    gender: "female",
    color: "Navy",
    pattern: "floral",
    style: "Romantic",
    bodyTypeSuitable: "all",
    occasions: "brunch,work,casual",
    season: "Spring",
    price: 61,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 8507,
    name: "Black Casual Skirt",
    description: "Simple black casual skirt for easy everyday pairing.",
    category: "Bottoms",
    gender: "female",
    color: "Black",
    pattern: "solid",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,everyday",
    season: "All season",
    price: 42,
    stockQuantity: 19,
    stores: ["StyleSense Store"],
  },
  {
    id: 8508,
    name: "Cream Pleated Wrap Skirt",
    description: "Cream wrap skirt with pleated detail for polished outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Cream",
    pattern: "pleated",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "work,formal,brunch",
    season: "All season",
    price: 72,
    stockQuantity: 12,
    stores: ["StyleSense Store"],
  },
  {
    id: 8509,
    name: "Green Slit Maxi Skirt",
    description: "Green maxi skirt with a slit for elevated warm-weather looks.",
    category: "Bottoms",
    gender: "female",
    color: "Green",
    pattern: "solid",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "party,brunch,vacation",
    season: "Summer",
    price: 68,
    stockQuantity: 13,
    stores: ["StyleSense Store"],
  },
  {
    id: 8510,
    name: "Pink Ribbed Midi Skirt",
    description: "Pink ribbed midi skirt for bright casual styling.",
    category: "Bottoms",
    gender: "female",
    color: "Pink",
    pattern: "ribbed",
    style: "Casual",
    bodyTypeSuitable: "all",
    occasions: "casual,brunch,date night",
    season: "Spring",
    price: 55,
    stockQuantity: 16,
    stores: ["StyleSense Store"],
  },
  {
    id: 8511,
    name: "Black Pleated Tennis Skirt",
    description: "Black pleated tennis skirt for sporty preppy styling.",
    category: "Bottoms",
    gender: "female",
    color: "Black",
    pattern: "pleated",
    style: "Sporty",
    bodyTypeSuitable: "all",
    occasions: "casual,campus,sport",
    season: "All season",
    price: 44,
    stockQuantity: 18,
    stores: ["StyleSense Store"],
  },
  {
    id: 8512,
    name: "Emerald Pencil Skirt",
    description: "Emerald pencil skirt for work and refined formal outfits.",
    category: "Bottoms",
    gender: "female",
    color: "Emerald",
    pattern: "solid",
    style: "Formal",
    bodyTypeSuitable: "all",
    occasions: "work,formal,business",
    season: "All season",
    price: 69,
    stockQuantity: 14,
    stores: ["StyleSense Store"],
  },
  {
    id: 8513,
    name: "Ivory Bow Satin Skirt",
    description: "Ivory satin skirt with a bow waist for elegant event styling.",
    category: "Bottoms",
    gender: "female",
    color: "Ivory",
    pattern: "satin",
    style: "Elegant",
    bodyTypeSuitable: "all",
    occasions: "party,formal,date night",
    season: "All season",
    price: 78,
    stockQuantity: 11,
    stores: ["StyleSense Store"],
  },
];

const PRICE_RANGES = [
  { id: "all", label: "All", test: () => true },
  { id: "under50", label: "Under $50", test: (p) => p < 50 },
  { id: "50to100", label: "$50 - $100", test: (p) => p >= 50 && p <= 100 },
  { id: "100to200", label: "$100 - $200", test: (p) => p > 100 && p <= 200 },
  { id: "over200", label: "Over $200", test: (p) => p > 200 },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "reviews", label: "Most Reviewed" },
];

const CATEGORY_ICON = {
  Dresses: Shirt,
  Tops: Shirt,
  Sweaters: Shirt,
  "Matching Sets": Shirt,
  Bottoms: Shirt,
  Outerwear: Shirt,
  Shoes: Footprints,
  Accessories: Gem,
};

const SHOP_COLLECTIONS = {
  "what's new": {
    title: "What's New",
    description: "Fresh StyleSense picks for the latest outfit inspiration.",
    test: () => true,
  },
  "new arrivals": {
    title: "New Arrivals",
    description: "Recently added outfit ideas and wardrobe staples.",
    test: () => true,
    sort: (a, b) => b.id - a.id,
  },
  "fresh picks": {
    title: "Fresh Picks",
    description: "Polished pieces selected for standout everyday styling.",
    test: (p) => matchesAny(p.style, ["romantic", "elegant", "classic", "minimal"]) || matchesAny(p.season, ["spring", "summer"]),
  },
  "this week": {
    title: "This Week",
    description: "Current outfit ideas for work, casual plans, and weekend looks.",
    test: (p) => matchesAny(p.occasions, ["everyday", "casual", "work"]) || matchesAny(p.season, ["all season"]),
  },
  trending: {
    title: "Trending",
    description: "Popular looks inspired by current fashion trends.",
    test: (p) => matchesAny(p.style, ["casual", "edgy", "classic", "minimal"]),
  },
  streetwear: {
    title: "Streetwear",
    description: "Relaxed statement pieces for bold everyday outfits.",
    test: (p) => matchesAny(p.category, ["bottoms", "outerwear", "shoes"]) || matchesAny(p.style, ["casual", "edgy"]),
  },
  "quiet luxury": {
    title: "Quiet Luxury",
    description: "Minimal, classic, and elegant pieces with a refined feel.",
    test: (p) => matchesAny(p.style, ["classic", "minimal", "elegant"]) || matchesAny(p.color, ["camel", "cocoa", "ivory", "oat"]),
  },
  "campus looks": {
    title: "Campus Looks",
    description: "Comfortable outfits for class, errands, and casual days.",
    test: (p) => matchesAny(p.style, ["casual", "cozy", "preppy"]) || matchesAny(p.category, ["tops", "bottoms"]),
  },
  clothing: {
    title: "Clothing",
    description: "Browse apparel pieces for complete outfit building.",
    test: (p) => !matchesAny(p.category, ["shoes", "accessories"]),
  },
  sweaters: {
    title: "Sweaters",
    description: "Women's cozy sweaters and cardigans for cold or rainy weather.",
    test: (p) => matchesAny(p.category, ["sweaters"]) || p.name.toLowerCase().includes("sweater") || p.name.toLowerCase().includes("cardigan"),
  },
  jackets: {
    title: "Jackets",
    description: "Outerwear pieces for layering and seasonal styling.",
    test: (p) => matchesAny(p.category, ["outerwear"]) || p.name.toLowerCase().includes("jacket"),
  },
  jeans: {
    title: "Jeans",
    description: "Denim picks for casual and everyday outfits.",
    test: (p) => p.name.toLowerCase().includes("jean") || matchesAny(p.pattern, ["denim"]),
  },
  skirts: {
    title: "Skirts",
    description: "Skirt outfit ideas for casual, preppy, and event looks.",
    test: (p) => matchesAny(p.gender, ["female"]) && p.name.toLowerCase().includes("skirt"),
  },
  "matching sets": {
    title: "Matching Sets",
    description: "Coordinated pieces that can be styled together.",
    test: (p) => {
      const name = p.name.toLowerCase();
      return matchesAny(p.category, ["matching sets"]) || name.includes("set") || name.includes("two-piece") || name.includes("coord");
    },
  },
  dresses: {
    title: "Dresses",
    description: "Dress recommendations for casual days and special occasions.",
    test: (p) => matchesAny(p.category, ["dresses"]),
  },
  "casual dresses": {
    title: "Casual Dresses",
    description: "Easy dress options for day-to-day styling.",
    test: (p) => matchesAny(p.category, ["dresses"]) && matchesAny(p.occasions, ["casual", "everyday", "vacation"]),
  },
  "event dresses": {
    title: "Event Dresses",
    description: "Dress picks for parties, dinners, and polished occasions.",
    test: (p) => matchesAny(p.category, ["dresses"]) && (matchesAny(p.occasions, ["party", "formal", "date night"]) || matchesAny(p.style, ["romantic", "elegant"])),
  },
  "party dresses": {
    title: "Party Dresses",
    description: "Women's statement dresses for parties, date nights, and evening events.",
    test: (p) => matchesAny(p.gender, ["female"]) && matchesAny(p.category, ["dresses"]) && (matchesAny(p.occasions, ["party", "date night", "evening"]) || matchesAny(p.style, ["party"])),
  },
  "formal outfits": {
    title: "Formal Outfits",
    description: "Women's polished outfits for work, business, and formal occasions.",
    test: (p) => matchesAny(p.gender, ["female"]) && (matchesAny(p.occasions, ["work", "formal", "business"]) || matchesAny(p.style, ["formal", "classic", "elegant"])),
  },
  "formal dresses": {
    title: "Formal Dresses",
    description: "Women's formal dresses and skirt-suit inspired looks.",
    test: (p) => matchesAny(p.gender, ["female"]) && matchesAny(p.category, ["dresses"]) && (matchesAny(p.occasions, ["work", "formal", "business"]) || matchesAny(p.style, ["formal", "classic", "elegant"])),
  },
  "maxi dresses": {
    title: "Maxi Dresses",
    description: "Longer dress-inspired picks and elegant silhouettes.",
    test: (p) => matchesAny(p.gender, ["female"]) && matchesAny(p.category, ["dresses"]) && p.name.toLowerCase().includes("maxi"),
  },
  tops: {
    title: "Tops",
    description: "Tops and blouses to anchor your outfits.",
    test: (p) => matchesAny(p.category, ["tops"]),
  },
  shirts: {
    title: "Shirts",
    description: "Shirts and easy tops for everyday outfits.",
    test: (p) => matchesAny(p.category, ["tops"]) || p.name.toLowerCase().includes("shirt"),
  },
  blouses: {
    title: "Blouses",
    description: "Polished blouse options for work and dressier plans.",
    test: (p) => matchesAny(p.category, ["tops"]) && (p.name.toLowerCase().includes("blouse") || matchesAny(p.style, ["elegant", "classic"])),
  },
  hoodies: {
    title: "Hoodies",
    description: "Women's relaxed hoodie picks for cozy casual styling.",
    test: (p) => matchesAny(p.gender, ["female"]) && (p.name.toLowerCase().includes("hoodie") || p.name.toLowerCase().includes("sweatshirt")),
  },
  "crop tops": {
    title: "Crop Tops",
    description: "Trendy top picks for casual and going-out outfits.",
    test: (p) => matchesAny(p.category, ["tops"]) && p.name.toLowerCase().includes("crop"),
  },
  plus: {
    title: "Plus",
    description: "Inclusive outfit recommendations suited to flexible styling.",
    test: (p) => matchesAny(p.bodyTypeSuitable, ["all", "hourglass", "triangle", "rectangle", "round"]),
  },
  "plus dresses": {
    title: "Plus Dresses",
    description: "Dress ideas selected for flattering, flexible styling.",
    test: (p) => matchesAny(p.category, ["dresses"]) || matchesAny(p.bodyTypeSuitable, ["all", "hourglass", "triangle"]),
  },
  "plus tops": {
    title: "Plus Tops",
    description: "Top picks with flexible styling potential.",
    test: (p) => matchesAny(p.category, ["tops"]) || matchesAny(p.bodyTypeSuitable, ["all"]),
  },
  "plus jeans": {
    title: "Plus Jeans",
    description: "Denim and bottom picks for confident outfit building.",
    test: (p) => p.name.toLowerCase().includes("jean") || matchesAny(p.category, ["bottoms"]),
  },
  mens: {
    title: "Mens",
    description: "Menswear pieces for everyday styling.",
    test: (p) => matchesAny(p.gender, ["male"]),
  },
  men: {
    title: "Mens",
    description: "Menswear pieces for everyday styling.",
    test: (p) => matchesAny(p.gender, ["male"]),
  },
  "men sweaters": {
    title: "Men Sweaters",
    description: "Men's sweaters for cold and rainy-weather outfit ideas.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("sweater") || p.name.toLowerCase().includes("quarter-zip")),
  },
  "mens sweaters": {
    title: "Mens Sweaters",
    description: "Men's sweaters for cold and rainy-weather outfit ideas.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("sweater") || p.name.toLowerCase().includes("quarter-zip")),
  },
  "men's sweaters": {
    title: "Men's Sweaters",
    description: "Men's sweaters for cold and rainy-weather outfit ideas.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("sweater") || p.name.toLowerCase().includes("quarter-zip")),
  },
  "men hoodies": {
    title: "Men Hoodies",
    description: "Men's hoodie picks for sporty, casual, and streetwear outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("hoodie"),
  },
  "mens hoodies": {
    title: "Mens Hoodies",
    description: "Men's hoodie picks for sporty, casual, and streetwear outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("hoodie"),
  },
  "men's hoodies": {
    title: "Men's Hoodies",
    description: "Men's hoodie picks for sporty, casual, and streetwear outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("hoodie"),
  },
  "men shirts": {
    title: "Men Shirts",
    description: "Men's shirts and easy tops for everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (matchesAny(p.category, ["tops"]) || p.name.toLowerCase().includes("shirt")),
  },
  "mens shirts": {
    title: "Mens Shirts",
    description: "Men's shirts and easy tops for everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (matchesAny(p.category, ["tops"]) || p.name.toLowerCase().includes("shirt")),
  },
  "men's shirts": {
    title: "Men's Shirts",
    description: "Men's shirts and easy tops for everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (matchesAny(p.category, ["tops"]) || p.name.toLowerCase().includes("shirt")),
  },
  "men outerwear": {
    title: "Men Outerwear",
    description: "Men's jackets and layering pieces for cool-weather outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("jacket") || matchesAny(p.category, ["outerwear"])),
  },
  "mens outerwear": {
    title: "Mens Outerwear",
    description: "Men's jackets and layering pieces for cool-weather outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("jacket") || matchesAny(p.category, ["outerwear"])),
  },
  "men's outerwear": {
    title: "Men's Outerwear",
    description: "Men's jackets and layering pieces for cool-weather outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && (p.name.toLowerCase().includes("jacket") || matchesAny(p.category, ["outerwear"])),
  },
  "men trousers": {
    title: "Men Trousers",
    description: "Men's trousers for smart-casual, work, and everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("trouser"),
  },
  "mens trousers": {
    title: "Mens Trousers",
    description: "Men's trousers for smart-casual, work, and everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("trouser"),
  },
  "men's trousers": {
    title: "Men's Trousers",
    description: "Men's trousers for smart-casual, work, and everyday outfits.",
    test: (p) => matchesAny(p.gender, ["male"]) && p.name.toLowerCase().includes("trouser"),
  },
  "men shoes": {
    title: "Men Shoes",
    description: "Men's sneakers and dress shoes for complete outfit recommendations.",
    test: (p) => matchesAny(p.gender, ["male"]) && matchesAny(p.category, ["shoes"]),
  },
  "mens shoes": {
    title: "Mens Shoes",
    description: "Men's sneakers and dress shoes for complete outfit recommendations.",
    test: (p) => matchesAny(p.gender, ["male"]) && matchesAny(p.category, ["shoes"]),
  },
  "men's shoes": {
    title: "Men's Shoes",
    description: "Men's sneakers and dress shoes for complete outfit recommendations.",
    test: (p) => matchesAny(p.gender, ["male"]) && matchesAny(p.category, ["shoes"]),
  },
  trousers: {
    title: "Trousers",
    description: "Bottoms and tailored pieces for structured outfits.",
    test: (p) => matchesAny(p.category, ["bottoms"]) && (p.name.toLowerCase().includes("trouser") || p.name.toLowerCase().includes("palazzo")),
  },
  outerwear: {
    title: "Outerwear",
    description: "Layering pieces and jackets for finished looks.",
    test: (p) => matchesAny(p.category, ["outerwear"]),
  },
  sale: {
    title: "Sale",
    description: "Budget-friendly picks and discounted outfit ideas.",
    test: (p) => Number(p.price) <= 100,
  },
  "under $25": {
    title: "Under $25",
    description: "Low-cost finds for affordable outfit building.",
    test: (p) => Number(p.price) < 25,
  },
  clearance: {
    title: "Clearance",
    description: "Lower-priced items and end-of-season picks.",
    test: (p) => Number(p.price) <= 75,
  },
  "last chance": {
    title: "Last Chance",
    description: "Limited stock items to grab before they go.",
    test: (p) => Number(p.stockQuantity || 0) <= 20,
  },
};

function matchesAny(value = "", options = []) {
  const text = String(value || "").toLowerCase();
  return options.some((option) => text.includes(option));
}

function getCollection(categoryParam, typeParam) {
  const categoryKey = (categoryParam || "").toLowerCase();
  const typeKey = (typeParam || "").toLowerCase();
  const isMensRoute = categoryKey === "men" || categoryKey === "mens";
  if (isMensRoute && (typeKey === "sweaters" || typeKey === "men sweaters" || typeKey === "mens sweaters" || typeKey === "men's sweaters")) {
    return SHOP_COLLECTIONS["men's sweaters"];
  }
  if (isMensRoute && (typeKey === "shirts" || typeKey === "men shirts" || typeKey === "mens shirts" || typeKey === "men's shirts")) {
    return SHOP_COLLECTIONS["men's shirts"];
  }
  if (isMensRoute && (typeKey === "hoodies" || typeKey === "men hoodies" || typeKey === "mens hoodies" || typeKey === "men's hoodies")) {
    return SHOP_COLLECTIONS["men's hoodies"];
  }
  if (isMensRoute && (typeKey === "outerwear" || typeKey === "men outerwear" || typeKey === "mens outerwear" || typeKey === "men's outerwear")) {
    return SHOP_COLLECTIONS["men's outerwear"];
  }
  if (isMensRoute && (typeKey === "trousers" || typeKey === "men trousers" || typeKey === "mens trousers" || typeKey === "men's trousers")) {
    return SHOP_COLLECTIONS["men's trousers"];
  }
  if (isMensRoute && (typeKey === "men's shoes" || typeKey === "mens shoes" || typeKey === "men shoes" || typeKey === "shoes")) {
    return SHOP_COLLECTIONS["men's shoes"];
  }
  const key = (typeParam || categoryParam || "").toLowerCase();
  return SHOP_COLLECTIONS[key] || null;
}

function arrangeProductCategory(product) {
  const name = product.name?.toLowerCase() || "";
  if (product.gender === "male" || name.includes("men's") || name.includes("mens")) {
    return {
      ...product,
      category: name.includes("sweater") || name.includes("cardigan") || name.includes("sweatshirt") || name.includes("quarter-zip")
        ? "Mens"
        : product.category,
      gender: "male",
    };
  }
  if (name.includes("sweater") || name.includes("cardigan") || name.includes("sweatshirt")) {
    return { ...product, category: "Sweaters", gender: product.gender || "female" };
  }
  return product;
}

function mergeSweaterProducts(products) {
  const arranged = (products || []).map(arrangeProductCategory);
  const existingNames = new Set(arranged.map((product) => product.name.toLowerCase()));
  const extraWomenSweaters = WOMEN_SWEATER_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMenSweaters = MEN_SWEATER_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraCasualDresses = WOMEN_CASUAL_DRESS_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraFormalProducts = WOMEN_FORMAL_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMaxiDresses = WOMEN_MAXI_DRESS_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraPartyDresses = WOMEN_PARTY_DRESS_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenHoodies = WOMEN_HOODIE_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMenHoodies = MEN_HOODIE_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenJackets = WOMEN_JACKET_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMenJackets = MEN_JACKET_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMenTrousers = MEN_TROUSER_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraMenShoes = MEN_SHOE_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenFootwear = WOMEN_FOOTWEAR_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraAccessories = ACCESSORY_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenTrousers = WOMEN_TROUSER_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenMatchingSets = WOMEN_MATCHING_SET_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenTops = WOMEN_TOP_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  const extraWomenSkirts = WOMEN_SKIRT_PRODUCTS.filter(
    (product) => !existingNames.has(product.name.toLowerCase())
  );
  return [
    ...arranged,
    ...extraWomenSweaters,
    ...extraMenSweaters,
    ...extraCasualDresses,
    ...extraFormalProducts,
    ...extraMaxiDresses,
    ...extraPartyDresses,
    ...extraWomenHoodies,
    ...extraMenHoodies,
    ...extraWomenJackets,
    ...extraMenJackets,
    ...extraMenTrousers,
    ...extraMenShoes,
    ...extraWomenFootwear,
    ...extraAccessories,
    ...extraWomenTrousers,
    ...extraWomenMatchingSets,
    ...extraWomenTops,
    ...extraWomenSkirts,
  ];
}

function StarRow({ rating, reviews }) {
  return (
    <div className="ss-card-stars">
      <div className="ss-star-group">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={14} className={n <= rating ? "ss-star filled" : "ss-star"} />
        ))}
      </div>
      <span className="ss-review-count">({reviews})</span>
    </div>
  );
}

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart, onViewImage, justAdded }) {
  const Icon = CATEGORY_ICON[product.category] || Shirt;
  const rating = product.rating || 4;
  const reviews = product.reviews || product.stockQuantity || 0;
  const stores = product.stores || ["StyleSense Store"];
  const image = getProductImage(product);
  return (
    <div className="ss-card">
      <div className="ss-card-image photo-card">
        <button
          type="button"
          className="ss-image-view-button"
          onClick={() => onViewImage(product)}
          aria-label={`View full image of ${product.name}`}
        >
          <img src={image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
          <span>View image</span>
        </button>
        <Icon size={32} className="ss-card-icon photo-icon" />

        <button
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="ss-card-wishlist"
        >
          <Heart size={17} className={isWishlisted ? "ss-heart filled" : "ss-heart"} />
        </button>

        <button onClick={() => onAddToCart(product.id)} className="ss-card-addcart">
          {justAdded ? (
            <>
              <Check size={15} /> Added
            </>
          ) : (
            <>
              <Plus size={15} /> Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="ss-card-body">
        <p className="ss-card-category">{product.category}</p>
        <h3 className="ss-card-title">{product.name}</h3>
        <StarRow rating={rating} reviews={reviews} />
        <div className="ss-card-tags">
          <span>{product.color}</span>
          <span>{product.season}</span>
          <span>{product.style}</span>
        </div>
        <p className="ss-store-label">Where to buy</p>
        <div className="ss-store-list">
          {stores.map((store) => (
            <a key={store} href="#" onClick={(event) => event.preventDefault()}>
              {store}
            </a>
          ))}
        </div>
        <p className="ss-card-price">${product.price}</p>
      </div>
    </div>
  );
}

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRangeId, setPriceRangeId] = useState("all");
  const [sortId, setSortId] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { products, setProducts, wishlist, toggleWishlist, addToCart, justAddedId } = useShop();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingProduct, setViewingProduct] = useState(null);
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = query.get("category");
  const typeParam = query.get("type");
  const categoryKey = (categoryParam || "").toLowerCase();
  const isMensRoute = categoryKey === "men" || categoryKey === "mens";
  const collection = useMemo(() => getCollection(categoryParam, typeParam), [categoryParam, typeParam]);

  useEffect(() => {
    if (isMensRoute) {
      setCategory("Mens");
      return;
    }

    const mappedCategory = {
      dresses: "Dresses",
      tops: "Tops",
      shoes: "Shoes",
      accessories: "Accessories",
      outerwear: "Outerwear",
      sweaters: "Sweaters",
      men: "Mens",
      mens: "Mens",
    }[categoryParam] || "All";

    const typeCategory = {
      jackets: "Outerwear",
      outerwear: "Outerwear",
      jeans: "Bottoms",
      skirts: "Bottoms",
      trousers: "Bottoms",
      "men sweaters": "Mens",
      "mens sweaters": "Mens",
      "men's sweaters": "Mens",
      "plus jeans": "Bottoms",
      shirts: "Tops",
      blouses: "Tops",
      hoodies: "Tops",
      sweaters: "Sweaters",
      "crop tops": "Tops",
      "plus tops": "Tops",
      "matching sets": "Matching Sets",
      dresses: "Dresses",
      "casual dresses": "Dresses",
      "event dresses": "Dresses",
      "party dresses": "Dresses",
      "formal outfits": "Dresses",
      "formal dresses": "Dresses",
      "maxi dresses": "Dresses",
      "plus dresses": "Dresses",
    }[typeParam];

    setCategory(typeCategory || mappedCategory);
  }, [categoryParam, isMensRoute, typeParam]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api.getProducts()
      .then((data) => {
        if (!ignore) {
          setProducts(mergeSweaterProducts(data));
          setError("");
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Unable to load products. Start the Spring Boot backend on localhost:8080.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [setProducts]);

  const priceRange = PRICE_RANGES.find((r) => r.id === priceRangeId);
  const baseProducts = useMemo(
    () => (isMensRoute ? products.filter((p) => matchesAny(p.gender, ["male"])) : products),
    [isMensRoute, products]
  );

  const filtered = useMemo(() => {
    let list = baseProducts.filter(
      (p) =>
        (isMensRoute || category === "All" || p.category === category) &&
        (!collection || collection.test(p)) &&
        priceRange.test(p.price) &&
        p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (collection?.sort) list = [...list].sort(collection.sort);
    if (sortId === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortId === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortId === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortId === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [baseProducts, category, collection, isMensRoute, priceRange, search, sortId]);

  const categoryCounts = useMemo(() => {
    const counts = { All: baseProducts.length };
    CATEGORIES.slice(1).forEach((c) => {
      counts[c] = baseProducts.filter((p) => p.category === c).length;
    });
    return counts;
  }, [baseProducts]);

  function resetFilters() {
    setCategory("All");
    setPriceRangeId("all");
    setSearch("");
  }

  function handleAddToCart(productId) {
    if (!getToken()) {
      navigate("/login", { state: { message: "Sign in to add items to your cart." } });
      return;
    }

    addToCart(productId);
  }

  const displayProducts = filtered.length > 0
    ? filtered
    : collection
      ? baseProducts.filter((p) => collection.test(p) && priceRange.test(p.price) && p.name.toLowerCase().includes(search.trim().toLowerCase()))
      : filtered;

  const filtersPanel = (
    <div className="ss-filters">
      <div>
        <h3 className="ss-filter-heading">Category</h3>
        <div className="ss-filter-list">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={category === c ? "ss-filter-btn active" : "ss-filter-btn"}
            >
              <span>{c}</span>
              <span className="ss-filter-count">{categoryCounts[c]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="ss-filter-heading">Price Range</h3>
        <div className="ss-filter-list">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setPriceRangeId(r.id)}
              className={priceRangeId === r.id ? "ss-filter-btn active" : "ss-filter-btn"}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={resetFilters} className="ss-clear-btn">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="ss-app">
      <div className="ss-main">
   
        <div className="ss-toolbar">
          <div className="ss-search">
            <Search size={18} className="ss-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="ss-search-input"
            />
          </div>

          <button onClick={() => setMobileFiltersOpen(true)} className="ss-filter-toggle">
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div className="ss-sort">
            <select value={sortId} onChange={(e) => setSortId(e.target.value)} className="ss-sort-select">
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort by: {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="ss-sort-chevron" />
          </div>
        </div>

        <div className="ss-layout">
        
          <aside className="ss-sidebar">
            <div className="ss-sidebar-title">
              <SlidersHorizontal size={18} />
              <h2>Filters</h2>
            </div>
            {filtersPanel}
          </aside>

  
          <div className="ss-results">
            {collection && (
              <div className="ss-collection-banner">
                <p className="ss-collection-kicker">Selected collection</p>
                <h1>{collection.title}</h1>
                <p>{collection.description}</p>
              </div>
            )}

            <p className="ss-results-count">
              {loading ? "Loading products from backend..." : `Showing ${displayProducts.length} of ${baseProducts.length} products`}
            </p>

            {error ? (
              <div className="ss-empty">
                <p className="ss-empty-title">Backend connection needed</p>
                <p className="ss-empty-text">{error}</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="ss-empty">
                <p className="ss-empty-title">No products match your filters</p>
                <p className="ss-empty-text">Try a different category, price range, or search term.</p>
                <button onClick={resetFilters} className="ss-btn-primary">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="ss-grid">
                {displayProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.has(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={handleAddToCart}
                    onViewImage={setViewingProduct}
                    justAdded={justAddedId === p.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    
      {mobileFiltersOpen && (
        <div className="ss-mobile-drawer">
          <div className="ss-drawer-overlay" onClick={() => setMobileFiltersOpen(false)} />
          <div className="ss-drawer-panel">
            <div className="ss-drawer-header">
              <h2>Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="ss-drawer-close">
                <X size={18} />
              </button>
            </div>
            {filtersPanel}
            <button onClick={() => setMobileFiltersOpen(false)} className="ss-btn-primary ss-drawer-cta">
              Show {displayProducts.length} results
            </button>
          </div>
        </div>
      )}

      {viewingProduct && (
        <div className="ss-image-modal" role="dialog" aria-modal="true" aria-label={`${viewingProduct.name} full image`}>
          <button
            type="button"
            className="ss-image-modal-backdrop"
            onClick={() => setViewingProduct(null)}
            aria-label="Close image preview"
          />
          <div className="ss-image-modal-panel">
            <button
              type="button"
              className="ss-image-modal-close"
              onClick={() => setViewingProduct(null)}
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>
            <img
              src={getProductImage(viewingProduct)}
              alt={viewingProduct.name}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />
            <div className="ss-image-modal-caption">
              <p>{viewingProduct.category}</p>
              <h3>{viewingProduct.name}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
