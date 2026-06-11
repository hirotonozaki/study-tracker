import { NavLink, Outlet } from 'react-router-dom';

// SaaS 風のサイドバー + メインエリア
const linkClass = ({ isActive }: { isActive: boolean }) =>
  'navlink' + (isActive ? ' navlink--active' : '');

export function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo">ST</span>
          <span className="sidebar__name">Study Tracker</span>
        </div>
        <nav className="sidebar__nav">
          <NavLink to="/" end className={linkClass}>ダッシュボード</NavLink>
          <NavLink to="/records" className={linkClass}>学習記録</NavLink>
        </nav>
        <p className="sidebar__foot">React · TypeScript · Supabase</p>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
