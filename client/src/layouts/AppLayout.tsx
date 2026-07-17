import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <main className="content">
        <Outlet />
      </main>
      {/* Simple navigation instead of BottomNav */}
      <nav className="bottom-nav">
        <a href="/" className="nav-item">🏠 Home</a>
        <a href="/record" className="nav-item">🎤 Record</a>
        <a href="/settings" className="nav-item">⚙️ Settings</a>
      </nav>
    </div>
  );
};

export default AppLayout;
