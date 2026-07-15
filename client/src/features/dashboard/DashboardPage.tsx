import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <h2>NotaMed</h2>
      <div className="quick-actions">
        <Link to="/record" className="action-card">
          <span className="icon">🎤</span>
          <span>New Recording</span>
        </Link>
        <Link to="/history" className="action-card">
          <span className="icon">📋</span>
          <span>History</span>
        </Link>
        <Link to="/settings" className="action-card">
          <span className="icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;