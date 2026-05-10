import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏝️' },
  { path: '/my-trips', label: 'My Trips', icon: '🧳' },
  { path: '/itinerary-builder', label: 'Itinerary Builder', icon: '🗺️' },
  { path: '/city-search', label: 'City Search', icon: '🌆' },
  { path: '/activity-search', label: 'Activity Search', icon: '🎟️' },
  { path: '/budget', label: 'Budget', icon: '💰' },
  { path: '/packing-list', label: 'Packing List', icon: '📦' },
  { path: '/shared-view', label: 'Shared View', icon: '👥' },
  { path: '/flight-finder', label: 'Flight Finder', icon: '✈️' },
  { path: '/hotel-finder', label: 'Hotel Finder', icon: '🏨' },
  { path: '/travel-journal', label: 'Travel Journal', icon: '📔' },
  { path: '/local-guides', label: 'Local Guides', icon: '🧭' },
  { path: '/travel-alerts', label: 'Travel Alerts', icon: '⚠️' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-slate-800/80 bg-slate-900/95 lg:min-h-screen lg:w-80">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/70 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/90">Traveloop</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-100">Travel Control</h1>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-400/40 lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>

          <nav className={`overflow-hidden transition-[max-height] duration-300 lg:block ${menuOpen ? 'max-h-[1200px]' : 'max-h-0'} lg:max-h-none`}>
            <div className="space-y-1 px-4 py-4 lg:px-6 lg:py-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="hidden border-t border-slate-800/70 px-6 py-5 text-sm text-slate-400 lg:block">
            Designed for modern explorers, teams, and travel planners.
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8">
          <div className="min-h-[calc(100vh-2rem)] rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
