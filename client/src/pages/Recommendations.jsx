import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecommendations, getTraveler } from '../api';

export default function Recommendations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recs, setRecs] = useState(null);
  const [traveler, setTraveler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getRecommendations(id), getTraveler(id)])
      .then(([recsData, travelerData]) => {
        setRecs(recsData);
        setTraveler(travelerData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      Analyzing your TravelDNA...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#dc2626' }}>
      Error: {error}
    </div>
  );

  const hasRecs = recs?.destinationBased?.length > 0 || recs?.socialBased?.length > 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Hotels matched for {traveler?.name}
        </h1>
        <p style={{ color: '#6b7280' }}>
          Discovered through your travel graph — destinations, experiences, and travelers like you
        </p>
      </div>

      {!hasRecs && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
          No recommendations found. Try exploring more destinations first.
        </div>
      )}

      {/* Destination Based */}
      {recs?.destinationBased?.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1a1a2e' }}>
            🗺️ Based on your destinations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {recs.destinationBased.map((rec, i) => (
              <RecCard
                key={i}
                hotel={rec.hotel}
                reason={`Because you visited ${rec.becauseYouVisited} → similar to ${rec.similarTo.name}`}
                tags={rec.matchingExperiences}
                tagColor="#2563eb"
                onClick={() => navigate(`/hotel/${rec.hotel.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Social Based */}
      {recs?.socialBased?.length > 0 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1a1a2e' }}>
            👥 Travelers like you also loved
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {recs.socialBased.map((rec, i) => (
              <RecCard
                key={i}
                hotel={rec.hotel}
                reason={`${rec.popularity} traveler${rec.popularity > 1 ? 's' : ''} with your style stayed here`}
                tags={[rec.destination?.name]}
                tagColor="#059669"
                onClick={() => navigate(`/hotel/${rec.hotel.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecCard({ hotel, reason, tags, tagColor, onClick }) {
  const bandColors = { budget: '#16a34a', mid: '#2563eb', luxury: '#d97706' };
  const color = bandColors[hotel.price_band] || '#6b7280';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', flex: 1 }}>{hotel.name}</h3>
        <span style={{
          background: `${color}15`,
          color,
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '700',
          marginLeft: '8px',
          whiteSpace: 'nowrap',
        }}>
          {'★'.repeat(hotel.stars)}
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
        {hotel.city} · {hotel.price_band}
      </p>

      <p style={{
        fontSize: '12px',
        color: '#374151',
        background: '#f9fafb',
        padding: '8px 10px',
        borderRadius: '6px',
        marginBottom: '12px',
        lineHeight: '1.5',
      }}>
        🔗 {reason}
      </p>

      {tags?.filter(Boolean).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tags.filter(Boolean).map((tag, i) => (
            <span key={i} style={{
              background: `${tagColor}12`,
              color: tagColor,
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}