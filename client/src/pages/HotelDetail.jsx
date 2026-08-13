import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotel } from '../api';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHotel(id)
      .then(setHotel)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      Loading hotel...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#dc2626' }}>
      Error: {error}
    </div>
  );

  if (!hotel) return null;

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
        <p style={{ color: '#f4a261', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
          {hotel.destination?.name} · {hotel.destination?.region}
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
          {hotel.name}
        </h1>
        <p style={{ color: '#94a3b8' }}>
          {'★'.repeat(hotel.stars)} · {hotel.price_band} · {hotel.city}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Experiences */}
        <InfoSection title="🎯 Experiences Offered">
          {hotel.experiences.length === 0
            ? <Empty />
            : hotel.experiences.map(e => <Tag key={e.id} label={e.name} color="#059669" />)
          }
        </InfoSection>

        {/* Facilities */}
        <InfoSection title="🏊 Facilities">
          {hotel.facilities.length === 0
            ? <Empty />
            : hotel.facilities.map(f => <Tag key={f.id} label={f.name} color="#2563eb" />)
          }
        </InfoSection>
      </div>

      {/* Guests */}
      <InfoSection title="👤 Travelers Who Stayed Here">
        {hotel.guests.length === 0
          ? <Empty text="No recorded guests yet" />
          : hotel.guests.map(g => (
            <div
              key={g.id}
              onClick={() => navigate(`/profile/${g.id}`)}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <strong>{g.name}</strong>
              <span style={{ color: '#6b7280', marginLeft: '8px', textTransform: 'capitalize' }}>
                {g.travel_style} · {g.budget_band}
              </span>
            </div>
          ))
        }
      </InfoSection>
    </div>
  );
}

function InfoSection({ title, children }) {
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

function Empty({ text = 'None' }) {
  return <p style={{ color: '#9ca3af', fontSize: '13px' }}>{text}</p>;
}