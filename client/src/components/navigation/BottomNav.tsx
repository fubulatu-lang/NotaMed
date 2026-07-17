import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item" end>
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </NavLink>
      <NavLink to="/record" className="nav-item">
        <span className="icon">🎤</span>
        <span className="label">Record</span>
      </NavLink>
      <NavLink to="/settings" className="nav-item">
        <span className="icon">⚙️</span>
        <span className="label">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
