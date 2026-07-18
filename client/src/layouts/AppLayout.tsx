import { Outlet, Link } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        borderTop: '1px solid #ccc',
        background: '#f5f5f5'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>🏠 Home</Link>
        <Link to="/record" style={{ textDecoration: 'none', color: '#333' }}>🎤 Record</Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: '#333' }}>⚙️ Settings</Link>
      </nav>
    </div>
  );
};

export default AppLayout;
