import { X } from 'lucide-react';
import type { SushiItem } from '../../types';

interface SushiModalProps {
  sushi: SushiItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (sushi: SushiItem) => void;
}

export default function SushiModal({ sushi, isOpen, onClose, onAddToCart }: SushiModalProps) {
  if (!isOpen || !sushi) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundImage: `url(${sushi.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '10px',
            }} />
            <div>
              <h2 style={{ margin: '0 0 10px 0', color: '#2C3E50' }}>{sushi.name}</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {sushi.popular && (
                  <span style={{
                    background: '#fff3cd',
                    color: '#856404',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}>Popular</span>
                )}
                {sushi.spicy && (
                  <span style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}>Spicy</span>
                )}
              </div>
            </div>
          </div>

          <p style={{ color: '#666', lineHeight: '1.6' }}>{sushi.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Weight</div>
              <div style={{ fontWeight: 'bold', color: '#2C3E50' }}>{sushi.weight}g</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Calories</div>
              <div style={{ fontWeight: 'bold', color: '#2C3E50' }}>{sushi.calories} kcal</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Category</div>
              <div style={{ fontWeight: 'bold', color: '#2C3E50', textTransform: 'capitalize' }}>
                {sushi.category}
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '10px', color: '#2C3E50' }}>Ingredients:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sushi.ingredients.map((ingredient, index) => (
                <span 
                  key={index}
                  style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '14px',
                  }}
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Price</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B6B' }}>
                €{sushi.price}
              </div>
            </div>
            
            <button
              onClick={() => {
                onAddToCart(sushi);
                onClose();
              }}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF9E7D)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
