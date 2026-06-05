import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { cn } from '../../lib/utils.js';
import { Button } from '../ui/index.jsx';

const links = [
  { to: '/dashboard', label: 'Visão geral', end: true },
  { to: '/dashboard/projects', label: 'Projetos' },
  { to: '/dashboard/skills', label: 'Skills' },
  { to: '/dashboard/settings', label: 'Perfil' },
];

export function DashboardLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
        <Link to="/" className="px-5 py-4 text-lg font-bold border-b border-border">
          Dev<span className="text-brand">Folio</span>
        </Link>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-brand text-white' : 'text-text-muted hover:bg-surface-2'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
          >
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
