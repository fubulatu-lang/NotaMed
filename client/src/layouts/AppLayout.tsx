import { Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <main className="content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
