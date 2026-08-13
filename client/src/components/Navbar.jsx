import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      background: '#1a1a2e',
      padding: '0 32px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>
          Travel<span style={{ color: '#f4a261' }}>DNA</span>
        </span>
      </Link>
      <Link to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>
        ← All Travelers
      </Link>
    </nav>
  );
}