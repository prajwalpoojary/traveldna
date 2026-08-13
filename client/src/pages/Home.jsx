import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTravelers } from '../api';

const styleLabels = {
  spiritual: { emoji: '🕉️', color: '#7c3aed' },
  wellness: { emoji: '🧘', color: '#059669' },
  luxury: { emoji: '✨', color: '#d97706' },
  heritage: { emoji: '🏛️', color: '#dc2626' },
  adventure: { emoji: '🏕️', color: '#2563eb' },
  nature: { emoji: '🌿', color: '#16a34a' },
};

const budgetLabels = {
  budget: '₹',
  mid: '₹₹',
  luxury: '₹₹₹',
};

export default function Home() {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTravelers()
      .then(setTravelers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      Loading travelers...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#dc2626' }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
          Who are you traveling as?
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Select a traveler profile to discover hotels matched to your DNA
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
      }}>
        {travelers.map(traveler => {
          const style = styleLabels[traveler.travel_style] || { emoji: '✈️', color: '#6b7280' };
          return (
            <div
              key={traveler.id}
              onClick={() => navigate(`/profile/${traveler.id}`)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{style.emoji}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '4px' }}>
                {traveler.name}
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span style={{
                  background: `${style.color}15`,
                  color: style.color,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                  {traveler.travel_style}
                </span>
                <span style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  {budgetLabels[traveler.budget_band]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}