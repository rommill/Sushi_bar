import { useState } from "react";
import { sushiData } from "../../data/sushi";
import "./MenuSection.css";

interface MenuSectionProps {
  onBackToSunrise: () => void;
  onOpen3DMenu: () => void;
  onAddToCart?: (sushi: any) => void;
}

export default function MenuSection({
  onBackToSunrise,
  onOpen3DMenu,
  onAddToCart,
}: MenuSectionProps) {
  const [selectedSushi, setSelectedSushi] = useState<number | null>(null);

  const handleSushiClick = (id: number, sushi: any) => {
    console.log("Selected sushi:", sushi.name);
    setSelectedSushi(id);

    if (onAddToCart) {
      onAddToCart(sushi);
    }
  };

  return (
    <div className="menu-section">
      <div className="container">
        {/* Header */}
        <header className="menu-header">
          <div className="logo">
            <div className="logo-circle">寿</div>
            <h1>Sushi Bar 3D</h1>
          </div>

          <button className="back-to-sunrise" onClick={onBackToSunrise}>
            🌅 Repeat Animation
          </button>
        </header>

        {/* Main Title */}
        <h2 className="menu-title">🍱 Our 3D Menu</h2>

        {/* Introduction */}
        <div className="menu-intro">
          <p>
            After a beautiful sunrise begins our gastronomic journey. Explore
            the menu in the interactive 3D sphere below or choose from the list.
          </p>
        </div>

        {/* Sushi Cards Grid */}
        <div className="menu-grid">
          {sushiData.map((sushi) => (
            <div
              key={sushi.id}
              className={`card ${selectedSushi === sushi.id ? "selected" : ""}`}
              onClick={() => handleSushiClick(sushi.id, sushi)}
            >
              {/* Image */}
              <div
                className="card-img"
                style={{
                  backgroundImage: `url(${sushi.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Card Content */}
              <div className="card-content">
                <h3>{sushi.name}</h3>
                <p className="card-description">{sushi.description}</p>

                {/* Details */}
                <div className="card-details">
                  <span className="weight">{sushi.weight}g</span>
                  <span className="calories">{sushi.calories} kcal</span>
                  <span className="category">{sushi.category}</span>
                </div>

                {/* Ingredients */}
                <div className="ingredients">
                  {sushi.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="ingredient-tag">
                      {ing}
                    </span>
                  ))}
                  {sushi.ingredients.length > 3 && (
                    <span className="ingredient-tag">
                      +{sushi.ingredients.length - 3}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="price">{sushi.price} ₽</div>

                {/* Badges */}
                <div className="badges">
                  {sushi.popular && (
                    <span className="badge popular">★ Popular</span>
                  )}
                  {sushi.spicy && <span className="badge spicy">🌶️ Spicy</span>}
                  {sushi.vegetarian && (
                    <span className="badge vegetarian">🥬 Vegetarian</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Instructions */}
        <div className="menu-instructions">
          <h3>🎮 How to use 3D Menu:</h3>
          <div className="instructions-grid">
            <div className="instruction">
              <div className="instruction-icon">🖱️</div>
              <h4>Rotation</h4>
              <p>Rotate sphere with left mouse button</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">🔍</div>
              <h4>Zoom</h4>
              <p>Use wheel for zoom in/out</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">👆</div>
              <h4>Selection</h4>
              <p>Click sushi for details</p>
            </div>
            <div className="instruction">
              <div className="instruction-icon">🎯</div>
              <h4>Auto-rotate</h4>
              <p>Sphere rotates automatically</p>
            </div>
          </div>
        </div>

        {/* CTA Button for 3D */}
        <div className="cta-section">
          <h3>Ready for 3D experience?</h3>
          <p>Go to interactive 3D sphere for full immersion</p>
          <button className="cta-3d-button" onClick={onOpen3DMenu}>
            🚀 Open 3D Menu
          </button>
        </div>
      </div>
    </div>
  );
}
