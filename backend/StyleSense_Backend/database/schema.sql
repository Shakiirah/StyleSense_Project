-- StyleSense Database Schema
-- Target database: PostgreSQL
-- Development note: this can be adapted for SQLite by replacing UUID defaults,
-- ENUM checks, and JSONB columns with SQLite-compatible alternatives.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(40) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(role_id),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    CONSTRAINT chk_users_status CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

CREATE TABLE user_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    address_type VARCHAR(30) NOT NULL DEFAULT 'SHIPPING',
    street VARCHAR(180) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80),
    postal_code VARCHAR(30),
    country VARCHAR(80) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE style_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    gender VARCHAR(30),
    body_type VARCHAR(50),
    style_preference VARCHAR(80),
    occasion_preference VARCHAR(80),
    budget_range VARCHAR(50),
    weather_preference VARCHAR(50),
    favorite_colors JSONB DEFAULT '[]',
    disliked_styles JSONB DEFAULT '[]',
    size_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(80) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES categories(category_id),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(category_id),
    product_name VARCHAR(160) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    color VARCHAR(60),
    season VARCHAR(60),
    style_tag VARCHAR(80),
    occasion_tag VARCHAR(80),
    gender_target VARCHAR(40),
    body_type_suitability JSONB DEFAULT '[]',
    size_options JSONB DEFAULT '[]',
    fabric VARCHAR(100),
    base_price NUMERIC(10, 2) NOT NULL,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_products_price CHECK (base_price >= 0)
);

CREATE TABLE product_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(180),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    sku VARCHAR(80) NOT NULL UNIQUE,
    size VARCHAR(30),
    quantity_available INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_inventory_quantity CHECK (quantity_available >= 0)
);

CREATE TABLE stores (
    store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(120) NOT NULL UNIQUE,
    website_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_store_links (
    product_store_link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
    external_product_url TEXT NOT NULL,
    listed_price NUMERIC(10, 2),
    availability_status VARCHAR(40) NOT NULL DEFAULT 'AVAILABLE',
    last_checked_at TIMESTAMP,
    CONSTRAINT uq_product_store UNIQUE (product_id, store_id, external_product_url),
    CONSTRAINT chk_store_price CHECK (listed_price IS NULL OR listed_price >= 0),
    CONSTRAINT chk_availability CHECK (availability_status IN ('AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'UNKNOWN'))
);

CREATE TABLE outfits (
    outfit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outfit_name VARCHAR(160) NOT NULL,
    description TEXT,
    style_tag VARCHAR(80),
    occasion_tag VARCHAR(80),
    weather_tag VARCHAR(60),
    gender_target VARCHAR(40),
    total_estimated_price NUMERIC(10, 2),
    created_by_user_id UUID REFERENCES users(user_id),
    is_system_generated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outfit_items (
    outfit_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outfit_id UUID NOT NULL REFERENCES outfits(outfit_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    item_role VARCHAR(50) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_outfit_product_role UNIQUE (outfit_id, product_id, item_role)
);

CREATE TABLE uploaded_items (
    uploaded_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    original_filename VARCHAR(180),
    detected_category VARCHAR(80),
    detected_color VARCHAR(60),
    detected_style VARCHAR(80),
    confidence_score NUMERIC(5, 2),
    ai_analysis JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE upload_matches (
    upload_match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_item_id UUID NOT NULL REFERENCES uploaded_items(uploaded_item_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    match_score NUMERIC(5, 2) NOT NULL,
    match_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    outfit_id UUID REFERENCES outfits(outfit_id),
    uploaded_item_id UUID REFERENCES uploaded_items(uploaded_item_id),
    recommendation_type VARCHAR(50) NOT NULL,
    input_context JSONB DEFAULT '{}',
    recommendation_score NUMERIC(5, 2),
    ai_explanation TEXT,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_recommendation_type CHECK (
        recommendation_type IN ('QUIZ_BASED', 'OUTFIT_MATCH', 'UPLOAD_MATCH', 'TRENDING', 'MANUAL_ADMIN')
    )
);

CREATE TABLE recommendation_items (
    recommendation_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(recommendation_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    item_role VARCHAR(50),
    score NUMERIC(5, 2),
    reason TEXT
);

CREATE TABLE recommendation_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(recommendation_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    outfit_id UUID REFERENCES outfits(outfit_id),
    rating INTEGER,
    feedback_text TEXT,
    action_taken VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_feedback_rating CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    CONSTRAINT chk_feedback_action CHECK (
        action_taken IS NULL OR action_taken IN ('VIEWED', 'SAVED', 'ADDED_TO_CART', 'PURCHASED', 'DISMISSED')
    )
);

CREATE TABLE wishlist_items (
    wishlist_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_wishlist_product UNIQUE (user_id, product_id)
);

CREATE TABLE saved_outfits (
    saved_outfit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    outfit_id UUID NOT NULL REFERENCES outfits(outfit_id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_saved_outfit UNIQUE (user_id, outfit_id)
);

CREATE TABLE carts (
    cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    cart_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_cart_status CHECK (cart_status IN ('ACTIVE', 'CHECKED_OUT', 'ABANDONED'))
);

CREATE TABLE cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_size VARCHAR(30),
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),
    CONSTRAINT chk_cart_unit_price CHECK (unit_price >= 0)
);

CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    shipping_address_id UUID REFERENCES user_addresses(address_id),
    order_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_order_status CHECK (
        order_status IN ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')
    )
);

CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    selected_size VARCHAR(30),
    unit_price NUMERIC(10, 2) NOT NULL,
    line_total NUMERIC(10, 2) NOT NULL,
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_item_price CHECK (unit_price >= 0 AND line_total >= 0)
);

CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_provider VARCHAR(80),
    provider_transaction_id VARCHAR(160),
    payment_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    amount NUMERIC(10, 2) NOT NULL,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_payment_amount CHECK (amount >= 0)
);

CREATE TABLE user_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(product_id) ON DELETE SET NULL,
    outfit_id UUID REFERENCES outfits(outfit_id) ON DELETE SET NULL,
    interaction_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_interaction_type CHECK (
        interaction_type IN ('VIEW_PRODUCT', 'SEARCH', 'FILTER', 'VIEW_OUTFIT', 'SAVE_PRODUCT', 'SAVE_OUTFIT', 'ADD_TO_CART', 'CHECKOUT_START', 'PURCHASE')
    )
);

CREATE TABLE admin_audit_logs (
    audit_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(80) NOT NULL,
    entity_id UUID,
    previous_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_style ON products(style_tag);
CREATE INDEX idx_products_occasion ON products(occasion_tag);
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_store_links_product ON product_store_links(product_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_generated_at ON recommendations(generated_at);
CREATE INDEX idx_uploaded_items_user ON uploaded_items(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_product ON user_interactions(product_id);

INSERT INTO roles (role_name) VALUES ('USER'), ('ADMIN')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO categories (category_name, description) VALUES
    ('Dresses', 'Dresses for casual, formal, event, and seasonal styling'),
    ('Tops', 'Shirts, blouses, sweaters, crop tops, and related upper-body clothing'),
    ('Bottoms', 'Jeans, skirts, trousers, pants, and shorts'),
    ('Outerwear', 'Blazers, jackets, coats, and layering pieces'),
    ('Shoes', 'Footwear recommendations for complete outfits'),
    ('Accessories', 'Bags, jewelry, belts, and outfit accessories')
ON CONFLICT (category_name) DO NOTHING;
