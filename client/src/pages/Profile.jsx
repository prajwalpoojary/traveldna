import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTraveler } from '../api';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [traveler, setTraveler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTraveler(id)
      .then(setTraveler)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      Loading profile...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#dc2626' }}>
      Error: {error}
    </div>
  );

  if (!traveler) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{
        background: '#1a1a2e',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          {traveler.name}
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '16px', textTransform: 'capitalize' }}>
          {traveler.travel_style} traveler · {traveler.budget_band} budget
        </p>
        <button
          onClick={() => navigate(`/recommendations/${id}`)}
          style={{
            background: '#f4a261',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '15px',
          }}
        >
          Discover My Hotels →
        </button>
      </div>

      {/* DNA Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Visited */}
        <Section title="🗺️ Places Visited" color="#2563eb">
          {traveler.visited.map(d => (
            <Tag key={d.id} label={d.name} color="#2563eb" />
          ))}
        </Section>

        {/* Experiences */}
        <Section title="🎯 Experiences Loved" color="#059669">
          {traveler.prefers.map(e => (
            <Tag key={e.id} label={e.name} color="#059669" />
          ))}
        </Section>

        {/* Stayed */}
        <Section title="🏨 Hotels Stayed" color="#7c3aed">
          {traveler.stayed.map(h => (
            <Tag key={h.id} label={h.name} color="#7c3aed" />
          ))}
        </Section>

        {/* Avoids */}
        <Section title="🚫 Avoids" color="#dc2626">
          {traveler.avoids.length === 0
            ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>Nothing avoided</p>
            : traveler.avoids.map(f => (
              <Tag key={f.id} label={f.name} color="#dc2626" />
            ))
          }
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#374151' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      background: `${color}12`,
      color,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {label}
    </span>
  );
}